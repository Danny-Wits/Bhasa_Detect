# Bahasa Detect Backend

This directory contains the FastAPI backend and machine learning inference pipeline for the Bahasa Detect project.

## Architecture & Implementation Details

The backend is responsible for receiving audio samples from the frontend, processing them using librosa, running inference through a pre-trained Keras CNN model, and storing the prediction results in an SQLite database.

### 1. `ml.py` (Machine Learning Pipeline)
- **Model Loading:** The pre-trained Keras model (`language_cnn.keras`) is loaded into memory globally upon server startup. This avoids the overhead of reloading the model for every request, ensuring fast inference.
- **Feature Extraction:** It takes the raw audio file path, uses `librosa` to load it at a sample rate of 16kHz, normalizes the audio, and trims silence using `librosa.effects.trim` (top_db=20). 
- **MFCC Computation:** It extracts 40 Mel-Frequency Cepstral Coefficients (MFCCs). The feature matrix is then padded or truncated to a fixed time-step length of `MAX_LEN = 200` to match the CNN's expected input shape `(40, 200, 1)`.
- **Prediction:** The model outputs probabilities for three classes: Dogri, English, and Hindi. The system returns the predicted language, the overall confidence, the dictionary of all probabilities, and the total audio duration.

### 2. `database.py` & `models.py` (Database Layer)
- **Database:** Uses SQLite (`bhasa.db`) for lightweight, serverless data storage. 
- **ORM:** SQLAlchemy is used to interact with the database.
- **Schema (`PredictionRecord`):** 
  Stores session metadata for research analysis:
  - `username` (Speaker ID)
  - `expected_language` (Ground truth)
  - `predicted_language` (Model prediction)
  - `confidence` (Prediction certainty)
  - `dogri_prob`, `english_prob`, `hindi_prob` (Raw class probabilities)
  - `duration_sec` (Speech duration)
  - `created_at` (Timestamp)

### 3. `main.py` (FastAPI Server)
- **Endpoints:** 
  - `POST /predict`: Accepts `audio` (multipart file), `username`, and `expected_language`. It saves the audio to a temporary `uploads/` directory, runs `ml.predict_language`, saves the result to SQLite, and securely deletes the audio file immediately after processing to comply with privacy requirements ("Audio not stored").
  - `GET /stats`: Returns basic aggregation metrics (e.g., total predictions) for the admin dashboard.
- **CORS:** Configured to accept requests from the Vite frontend running on `localhost:5173`.

## Running the Backend Locally

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```
   *(If on Windows: `venv\Scripts\activate`)*
3. Run the Uvicorn server:
   ```bash
   python run.py
   ```
   The backend will be available at `http://localhost:8000`.
