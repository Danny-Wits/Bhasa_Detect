# Bhasa Detect

Bhasa Detect is a community-driven multilingual voice data collection platform. The application is designed to collect voice samples in various languages (currently English, Hindi, and Dogri) to help train state-of-the-art speech recognition AI models.

## 🚀 Features
- **Modern Landing Page:** Clean and engaging UI to convert visitors into contributors.
- **Seamless Onboarding:** Users can easily specify their demographic data and spoken languages.
- **Audio Collection Dashboard:** Interactive recording interface to collect speech samples based on target text lines.
- **Impact Analytics:** Visual feedback on user contributions, language distributions, and AI confidence scores using Mantine Charts.

## 🛠️ Tech Stack
- **Frontend Framework:** React (Vite)
- **UI Library:** Mantine UI v7 & Mantine Charts
- **Frontend Routing:** React Router DOM
- **Backend API:** FastAPI (Python)
- **Machine Learning:** TensorFlow (Keras) & Librosa
- **Database:** SQLite (SQLAlchemy)

## 📦 Getting Started

To run the full application locally, you will need to run both the frontend and the backend servers.

### 1. Start the Backend Server (FastAPI)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment (assuming it's already created):
   ```bash
   source venv/bin/activate
   # On Windows: venv\Scripts\activate
   ```
3. Run the server:
   ```bash
   python run.py
   ```
   The backend will start running on `http://localhost:8000`.

### 2. Start the Frontend Server (Vite/React)

1. Open a **new** terminal window in the root directory of the project.
2. Install the dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the provided local URL (usually `http://localhost:5173`).

## 🚀 Deployment on Render

This repository is pre-configured for instant zero-hassle deployment on [Render](https://render.com).

### Method A: One-Click Render Blueprint (Recommended)
1. Push this repo to your GitHub.
2. In Render Dashboard, click **New +** -> **Blueprint**.
3. Select your repository.
4. Render will read `render.yaml` and automatically configure both:
   - **bhasa-detect-api** (FastAPI Web Service)
   - **bhasa-detect-frontend** (React Vite Static Site with SPA routing)
5. Click **Apply**.

### Method B: Manual Service Setup
If deploying services individually on Render:

1. **Deploy Backend (Web Service):**
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables:**
     - `PYTHON_VERSION`: `3.12.3`
     - `SECRET_KEY`: `(click generate or add a secret string)`
     - `ALLOWED_ORIGINS`: `*`

2. **Deploy Frontend (Static Site):**
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Redirects/Rewrites (SPA):**
     - Type: `Rewrite`
     - Source: `/*`
     - Destination: `/index.html`
   - **Environment Variable:**
     - `VITE_API_URL`: `https://your-backend-service.onrender.com`

---

## 📁 Project Structure

- `/backend` - FastAPI application, ML inference logic, and SQLite database. See [backend/README.md](backend/README.md) for details.
- `/src/pages` - Main application views (Landing, Login, Onboarding, Dashboard, Record, Admin, About).
- `/src/components` - Reusable UI elements (SiteHeader, HeroWaveform, SpectrogramViewer, AudioRecorder).
- `/src/hooks` - Core business logic and API connections (`useRecordingSession`, `useProfile`).
- `/src/lib` - Global Context providers.
