import os
import sys
import uvicorn

# Ensure ffmpeg binary and directory are in PATH so audioread/librosa can decode WebM audio
try:
    import imageio_ffmpeg
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    ffmpeg_dir = os.path.dirname(ffmpeg_exe)
    if ffmpeg_dir not in os.environ.get("PATH", ""):
        os.environ["PATH"] = ffmpeg_dir + os.pathsep + os.environ.get("PATH", "")
    
    # Also create symlink in python bin directory if possible
    venv_bin = os.path.dirname(sys.executable)
    symlink_path = os.path.join(venv_bin, "ffmpeg")
    if not os.path.exists(symlink_path):
        try:
            os.symlink(ffmpeg_exe, symlink_path)
        except Exception:
            pass
except Exception as e:
    print(f"Warning: Failed to setup ffmpeg path: {e}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    is_dev = os.environ.get("ENVIRONMENT", "development") == "development"
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=is_dev)
