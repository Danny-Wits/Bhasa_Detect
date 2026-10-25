import os
import shutil
import json
import jwt
from typing import List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel

from . import models, database, ml, auth

# Drop all and recreate since models changed dramatically (it's fine for prototype)
# Or just recreate if not exists
models.Base.metadata.create_all(bind=database.engine)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = FastAPI(title="Bhasa Detect Backend")

allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
if allowed_origins_env == "*":
    origins = ["*"]
else:
    origins = [orig.strip() for orig in allowed_origins_env.split(",") if orig.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "app": "Bhasa Detect API"}

# --- DEPENDENCIES ---
def get_current_user(authorization: str = Header(None), db: Session = Depends(database.get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Token expired or invalid")
    
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# --- SCHEMAS ---
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ProfileRequest(BaseModel):
    age: str
    gender: str
    state: str
    district: str
    mothertongue: str
    qualification: str
    languages: List[str]
    location: str = None

# --- AUTH ENDPOINTS ---
@app.post("/auth/register")
def register(req: RegisterRequest, db: Session = Depends(database.get_db)):
    if db.query(models.User).filter(models.User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = models.User(
        email=req.email,
        name=req.name,
        password_hash=auth.get_password_hash(req.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    token = auth.create_access_token({"sub": str(user.id)})
    return {"token": token, "user": {"id": user.id, "email": user.email, "name": user.name}}

@app.post("/auth/login")
def login(req: LoginRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user or not auth.verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = auth.create_access_token({"sub": str(user.id)})
    return {"token": token, "user": {"id": user.id, "email": user.email, "name": user.name}}

@app.get("/auth/me")
def get_me(current_user: models.User = Depends(get_current_user)):
    profile = current_user.profile
    prof_data = None
    if profile:
        prof_data = {
            "age": profile.age,
            "gender": profile.gender,
            "state": profile.state,
            "district": profile.district,
            "mothertongue": profile.mothertongue,
            "qualification": profile.qualification,
            "languages": json.loads(profile.languages) if profile.languages else [],
            "location": profile.location
        }
    return {
        "user": {"id": current_user.id, "email": current_user.email, "name": current_user.name},
        "profile": prof_data
    }

@app.post("/auth/profile")
def update_profile(req: ProfileRequest, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    profile = current_user.profile
    if not profile:
        profile = models.UserProfile(user_id=current_user.id)
        db.add(profile)
    
    profile.age = req.age
    profile.gender = req.gender
    profile.state = req.state
    profile.district = req.district
    profile.mothertongue = req.mothertongue
    profile.qualification = req.qualification
    profile.languages = json.dumps(req.languages)
    profile.location = req.location

    db.commit()
    return {"status": "success"}

# --- ML ENDPOINTS ---
@app.post("/predict")
async def predict(
    audio: UploadFile = File(...),
    expected_language: str = Form(None),
    authorization: str = Header(None),
    db: Session = Depends(database.get_db)
):
    if not audio:
        raise HTTPException(status_code=400, detail="No audio file received")

    # Try auth but don't fail strictly if not there (fallback for robustness)
    user_id = None
    username = None
    if authorization and authorization.startswith("Bearer "):
        try:
            token = authorization.split(" ")[1]
            payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
            user_id = int(payload.get("sub"))
        except:
            pass

    file_path = os.path.join(UPLOAD_FOLDER, audio.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)
        
    try:
        language, confidence, probabilities, duration = ml.predict_language(file_path)
        
        new_record = models.PredictionRecord(
            user_id=user_id,
            username=username,
            expected_language=expected_language,
            predicted_language=language,
            confidence=confidence,
            dogri_prob=probabilities.get("Dogri", 0),
            english_prob=probabilities.get("English", 0),
            hindi_prob=probabilities.get("Hindi", 0),
            duration_sec=duration
        )
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
            
    return {
        "id": new_record.id,
        "predicted_language": language,
        "confidence": round(confidence, 2),
        "probabilities": {k: round(v, 2) for k, v in probabilities.items()},
        "duration_sec": round(duration, 2)
    }

@app.get("/stats")
def get_stats(authorization: str = Header(None), db: Session = Depends(database.get_db)):
    # Calculate real stats
    try:
        token = authorization.split(" ")[1] if authorization else ""
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        user_id = int(payload.get("sub"))
    except:
        user_id = None

    # Filter by user if not admin (for prototype, assume users only see their own)
    query = db.query(models.PredictionRecord)
    if user_id:
        query = query.filter(models.PredictionRecord.user_id == user_id)
        
    total_sentences = query.count()
    if total_sentences == 0:
        return {
            "totalSessions": 0, "totalSentences": 0, "overallAccuracy": 0, 
            "totalSpeakingTime": "0s", "avgUtteranceDuration": "0s",
            "languageAccuracy": [], "activityData": [], "languageData": [], "predictionData": [], "recentSessions": []
        }
        
    total_duration = db.query(func.sum(models.PredictionRecord.duration_sec)).filter(models.PredictionRecord.user_id == user_id).scalar() or 0
    correct = db.query(models.PredictionRecord).filter(
        models.PredictionRecord.user_id == user_id, 
        models.PredictionRecord.expected_language == models.PredictionRecord.predicted_language
    ).count()
    
    overall_accuracy = int((correct / total_sentences) * 100) if total_sentences > 0 else 0
    
    # Calculate language accuracy
    langs = ["English", "Hindi", "Dogri"]
    lang_acc = []
    pred_data = []
    lang_dist = []
    colors = {"English": "blue", "Hindi": "grape", "Dogri": "teal"}
    
    for l in langs:
        l_total = query.filter(models.PredictionRecord.expected_language == l).count()
        if l_total > 0:
            l_correct = query.filter(
                models.PredictionRecord.expected_language == l,
                models.PredictionRecord.predicted_language == l
            ).count()
            l_incorrect = l_total - l_correct
            lang_acc.append({
                "language": l, "accuracy": int((l_correct/l_total)*100),
                "correct": l_correct, "incorrect": l_incorrect, "color": colors[l]
            })
            pred_data.append({"language": l, "Correct": l_correct, "Incorrect": l_incorrect})
            lang_dist.append({"name": l, "value": l_total, "color": colors[l]+".6"})

    # Recent sessions (we don't have a formal session table, so group by 5 records or just latest records)
    recent = query.order_by(models.PredictionRecord.created_at.desc()).limit(5).all()
    recent_formatted = []
    for r in recent:
        recent_formatted.append({
            "id": f"REC-{r.id}",
            "date": r.created_at.strftime("%Y-%m-%d"),
            "combo": r.expected_language,
            "sentences": 1,
            "accuracy": 100 if r.expected_language == r.predicted_language else 0,
            "duration": f"{round(r.duration_sec, 1)}s"
        })

    mins, secs = divmod(int(total_duration), 60)
    avg_sec = total_duration / total_sentences if total_sentences > 0 else 0
    
    return {
        "totalSessions": total_sentences // 5 + 1,
        "totalSentences": total_sentences,
        "overallAccuracy": overall_accuracy,
        "totalSpeakingTime": f"{mins}m {secs}s",
        "avgUtteranceDuration": f"{round(avg_sec, 1)}s",
        "languageAccuracy": lang_acc,
        "activityData": [], # Complex to query in sqlite without DATE func easily, returning empty for now
        "languageData": lang_dist,
        "predictionData": pred_data,
        "recentSessions": recent_formatted
    }

@app.get("/admin/analytics")
def get_admin_analytics(db: Session = Depends(database.get_db)):
    from sqlalchemy.orm import joinedload
    preds = db.query(models.PredictionRecord).options(
        joinedload(models.PredictionRecord.user).joinedload(models.User.profile)
    ).all()
    
    total_records = len(preds)
    correct_records = sum(1 for p in preds if p.expected_language == p.predicted_language)
    overall_accuracy = round((correct_records / total_records) * 100, 1) if total_records > 0 else 0.0
    
    langs = ["Dogri", "Hindi", "English"]
    cm = {l: {l2: 0 for l2 in langs} for l in langs}
    lang_stats = {l: {"total": 0, "correct": 0} for l in langs}
    
    durations = []
    correct_durations = []
    incorrect_durations = []
    confidences = []
    correct_confidences = []
    incorrect_confidences = []

    for p in preds:
        exp = p.expected_language
        pred = p.predicted_language
        dur = p.duration_sec or 0.0
        conf = p.confidence or 0.0
        durations.append(dur)
        confidences.append(conf)
        
        is_corr = (exp == pred)
        if is_corr:
            correct_durations.append(dur)
            correct_confidences.append(conf)
        else:
            incorrect_durations.append(dur)
            incorrect_confidences.append(conf)
            
        if exp in cm and pred in cm[exp]:
            cm[exp][pred] += 1
            
        if exp in lang_stats:
            lang_stats[exp]["total"] += 1
            if is_corr:
                lang_stats[exp]["correct"] += 1
                
    users = db.query(models.User).options(joinedload(models.User.profile)).all()
    live_speakers = []
    for u in users:
        u_preds = [p for p in preds if p.user_id == u.id]
        u_total = len(u_preds)
        u_correct = sum(1 for p in u_preds if p.expected_language == p.predicted_language)
        u_acc = round((u_correct / u_total) * 100, 1) if u_total > 0 else 0.0
        u_dur = round(sum(p.duration_sec or 0 for p in u_preds) / u_total, 1) if u_total > 0 else 0.0
        
        prof = u.profile
        langs_spoken = []
        if prof and prof.languages:
            try:
                langs_spoken = json.loads(prof.languages)
            except:
                langs_spoken = ["Dogri", "Hindi"]
                
        live_speakers.append({
            "id": f"SPK-{u.id:03d}",
            "name": u.name,
            "age": prof.age if prof and prof.age else "20-30",
            "gender": prof.gender if prof and prof.gender else "Not Specified",
            "place": prof.district if prof and prof.district else (prof.state if prof and prof.state else "Jammu"),
            "languages": langs_spoken or ["Dogri", "Hindi", "English"],
            "sessions": max(1, u_total // 5),
            "totalSamples": u_total,
            "accuracy": u_acc,
            "avgDuration": f"{u_dur}s",
            "date": u.created_at.strftime("%Y-%m-%d") if u.created_at else "2026-10-25"
        })
        
    recent_rows = []
    for p in sorted(preds, key=lambda x: str(x.created_at or ""), reverse=True)[:50]:
        recent_rows.append({
            "id": p.id,
            "speaker": p.user.name if p.user else (p.username or "Anonymous"),
            "expectedLanguage": p.expected_language or "—",
            "predictedLanguage": p.predicted_language or "—",
            "confidence": round(p.confidence, 1) if p.confidence else 0.0,
            "isCorrect": p.expected_language == p.predicted_language,
            "duration": round(p.duration_sec, 1) if p.duration_sec else 0.0,
            "date": p.created_at.strftime("%Y-%m-%d %H:%M") if p.created_at else "—"
        })
        
    return {
        "status": "connected",
        "database": "bhasa.db",
        "totalRecords": total_records,
        "correctRecords": correct_records,
        "overallAccuracy": overall_accuracy,
        "totalSpeakers": len(users),
        "meanConfidence": round(sum(confidences) / len(confidences), 1) if confidences else 0.0,
        "meanCorrectConfidence": round(sum(correct_confidences) / len(correct_confidences), 1) if correct_confidences else 0.0,
        "meanIncorrectConfidence": round(sum(incorrect_confidences) / len(incorrect_confidences), 1) if incorrect_confidences else 0.0,
        "avgDurationSec": round(sum(durations) / len(durations), 1) if durations else 0.0,
        "totalSpeakingMins": round(sum(durations) / 60, 1),
        "confusionMatrix": cm,
        "languageStats": lang_stats,
        "liveSpeakers": live_speakers,
        "recentPredictions": recent_rows
    }

# --- OPTIONAL FRONTEND STATIC ASSETS SERVING (Single-Service Deployment) ---
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DIST_DIR = os.path.join(ROOT_DIR, "dist")

if os.path.isdir(DIST_DIR):
    from fastapi.staticfiles import StaticFiles
    from starlette.responses import FileResponse

    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Exclude API endpoints from being captured
        if full_path.startswith(("auth", "predict", "stats", "admin", "health", "docs", "openapi.json")):
            raise HTTPException(status_code=404, detail="Not Found")
        
        target_file = os.path.join(DIST_DIR, full_path)
        if os.path.isfile(target_file):
            return FileResponse(target_file)
        return FileResponse(os.path.join(DIST_DIR, "index.html"))
else:
    @app.get("/")
    def index_fallback():
        return {"message": "Bhasa Detect API is active. Connect your frontend or visit /docs for API documentation."}

