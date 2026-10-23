import os
import sys
import subprocess
import numpy as np
import librosa
import imageio_ffmpeg

# Paths to models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_TFLITE_PATH = os.path.join(BASE_DIR, "language_cnn.tflite")
MODEL_KERAS_PATH = os.path.join(BASE_DIR, "language_cnn.keras")

CLASSES = ["Dogri", "English", "Hindi"]
SAMPLE_RATE = 16000
N_MFCC = 40
MAX_LEN = 200

# Ensure ffmpeg binary is discoverable in PATH
try:
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    ffmpeg_dir = os.path.dirname(ffmpeg_exe)
    if ffmpeg_dir not in os.environ.get("PATH", ""):
        os.environ["PATH"] = ffmpeg_dir + os.pathsep + os.environ.get("PATH", "")
except Exception as e:
    print(f"Warning: Failed to add imageio_ffmpeg to PATH: {e}")

# Load model engine:
# Priority 1: ai_edge_litert (LiteRT / TFLite runtime).
# Memory usage: ~45 MB RAM vs ~590 MB RAM for full TensorFlow.
# This prevents OOM (Out Of Memory) kills on 512MB free tier cloud hosts like Render.
interpreter = None
keras_model = None

try:
    from ai_edge_litert.interpreter import Interpreter
    if os.path.exists(MODEL_TFLITE_PATH):
        print(f"Loading LiteRT model from {MODEL_TFLITE_PATH}...")
        interpreter = Interpreter(model_path=MODEL_TFLITE_PATH)
        interpreter.allocate_tensors()
        print("LiteRT model loaded successfully (optimized low-memory engine).")
    else:
        print(f"Warning: TFLite model file not found at {MODEL_TFLITE_PATH}")
except Exception as e:
    print(f"LiteRT engine not available ({e}). Attempting Keras fallback...")

if interpreter is None:
    try:
        import tensorflow as tf
        if os.path.exists(MODEL_KERAS_PATH):
            print(f"Loading Keras model from {MODEL_KERAS_PATH}...")
            keras_model = tf.keras.models.load_model(MODEL_KERAS_PATH)
            print("Keras model loaded successfully.")
        else:
            print(f"Warning: Keras model file not found at {MODEL_KERAS_PATH}")
    except Exception as e:
        print(f"Failed to load Keras model: {e}")


def extract_mfcc(file_path):
    wav_path = None
    if not file_path.lower().endswith('.wav'):
        wav_path = file_path + "_" + ".wav"
        ffmpeg_bin = imageio_ffmpeg.get_ffmpeg_exe()
        proc = subprocess.run([
            ffmpeg_bin, "-y", "-i", file_path, 
            "-ac", "1", "-ar", str(SAMPLE_RATE), 
            wav_path
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if proc.returncode != 0:
            print(f"FFmpeg error: {proc.stderr.decode('utf-8', errors='ignore')}")
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

        # Fixed length padding/truncation
        if mfcc.shape[1] < MAX_LEN:
            pad_width = MAX_LEN - mfcc.shape[1]
            mfcc = np.pad(mfcc, ((0, 0), (0, pad_width)), mode="constant")
        else:
            mfcc = mfcc[:, :MAX_LEN]

        return mfcc, duration
    finally:
        if wav_path and os.path.exists(wav_path):
            try:
                os.remove(wav_path)
            except OSError:
                pass


def predict_language(file_path):
    mfcc, duration = extract_mfcc(file_path)
    
    # Add channel dimension: (40, 200, 1)
    mfcc = mfcc[..., np.newaxis]
    
    # Add batch dimension: (1, 40, 200, 1) with float32
    mfcc = np.expand_dims(mfcc, axis=0).astype(np.float32)

    if interpreter is not None:
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        interpreter.set_tensor(input_details[0]['index'], mfcc)
        interpreter.invoke()
        probabilities = interpreter.get_tensor(output_details[0]['index'])[0]
    elif keras_model is not None:
        probabilities = keras_model.predict(mfcc, verbose=0)[0]
    else:
        raise RuntimeError("No model is loaded for language prediction.")

    # Highest probability
    index = int(np.argmax(probabilities))
    language = CLASSES[index]
    confidence = float(probabilities[index] * 100)
    
    probs_dict = {
        "Dogri": float(probabilities[0] * 100),
        "English": float(probabilities[1] * 100),
        "Hindi": float(probabilities[2] * 100)
    }

    return language, confidence, probs_dict, duration
