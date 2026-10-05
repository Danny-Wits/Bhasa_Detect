import os
import sys
import numpy as np
import librosa
import tensorflow as tf

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "language_cnn.keras")
# If language_classes.npy is missing, we hardcode based on the notebook logic
CLASSES = ["Dogri", "English", "Hindi"]

SAMPLE_RATE = 16000
N_MFCC = 40
MAX_LEN = 200

# Load model globally so it's loaded only once on startup
print(f"Loading model from {MODEL_PATH}...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully.")

import subprocess
import imageio_ffmpeg

def extract_mfcc(file_path):
    # Convert file to WAV using ffmpeg if it's not already a WAV.
    # Librosa 0.10+ relies solely on soundfile which doesn't support WebM.
    wav_path = None
    if not file_path.lower().endswith('.wav'):
        wav_path = file_path + "_" + ".wav"
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        subprocess.run([
            ffmpeg_exe, "-y", "-i", file_path, 
            "-ac", "1", "-ar", str(SAMPLE_RATE), 
            wav_path
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        load_path = wav_path
    else:
        load_path = file_path

    try:
        audio, sr = librosa.load(load_path, sr=SAMPLE_RATE, mono=True)
        duration = librosa.get_duration(y=audio, sr=sr)
        
        # Normalize
        audio = librosa.util.normalize(audio)

        # Trim silence
        audio, _ = librosa.effects.trim(audio, top_db=20)

        # MFCC
        mfcc = librosa.feature.mfcc(y=audio, sr=SAMPLE_RATE, n_mfcc=N_MFCC)

        # Fixed length
        if mfcc.shape[1] < MAX_LEN:
            pad_width = MAX_LEN - mfcc.shape[1]
            mfcc = np.pad(mfcc, ((0, 0), (0, pad_width)), mode="constant")
        else:
            mfcc = mfcc[:, :MAX_LEN]

        return mfcc, duration
    finally:
        if wav_path and os.path.exists(wav_path):
            os.remove(wav_path)

def predict_language(file_path):
    mfcc, duration = extract_mfcc(file_path)
    
    # Add channel dimension
    mfcc = mfcc[..., np.newaxis]
    
    # Add batch dimension
    mfcc = np.expand_dims(mfcc, axis=0)

    # Prediction
    probabilities = model.predict(mfcc, verbose=0)[0]

    # Highest probability
    index = np.argmax(probabilities)
    language = CLASSES[index]
    confidence = float(probabilities[index] * 100)
    
    probs_dict = {
        "Dogri": float(probabilities[0] * 100),
        "English": float(probabilities[1] * 100),
        "Hindi": float(probabilities[2] * 100)
    }

    return language, confidence, probs_dict, duration
