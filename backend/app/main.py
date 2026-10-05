import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager

from . import models, database, ml

models.Base.metadata.create_all(bind=database.engine)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = FastAPI(title="Bhasa Detect Backend")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(
    audio: UploadFile = File(...),
    username: str = Form(None),
    expected_language: str = Form(None),
    db: Session = Depends(database.get_db)
):
    if not audio:
        raise HTTPException(status_code=400, detail="No audio file received")

    file_path = os.path.join(UPLOAD_FOLDER, audio.filename)
    
    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)
        
    try:
        # Predict
        language, confidence, probabilities, duration = ml.predict_language(file_path)
        
        # Save to DB
        new_record = models.PredictionRecord(
            username=username,
            expected_language=expected_language,
            predicted_language=language,
            confidence=confidence,
            dogri_prob=probabilities["Dogri"],
            english_prob=probabilities["English"],
            hindi_prob=probabilities["Hindi"],
            duration_sec=duration
        )
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up file after prediction to save space, as requested "Audio not stored"
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
def get_stats(db: Session = Depends(database.get_db)):
    # Basic stats for the admin dashboard
    total_predictions = db.query(models.PredictionRecord).count()
    # You can add more aggregations here
    return {
        "total_predictions": total_predictions
    }
