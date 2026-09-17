import os
from typing import List
from pydantic import BaseModel

def _get_cors_origins() -> List[str]:
    raw = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000"
    )
    return [origin.strip() for origin in raw.split(",") if origin.strip()]

class Settings(BaseModel):
    PROJECT_NAME: str = "Medical Insurance Cost Prediction API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Model & Metadata paths with fallbacks
    MODEL_PATH: str = os.getenv("MODEL_PATH", "backend/models/model.pkl")
    METADATA_PATH: str = os.getenv("METADATA_PATH", "backend/models/model_metadata.json")
    
    # Single authoritative CORS Configuration
    CORS_ORIGINS: List[str] = _get_cors_origins()

settings = Settings()

def resolve_file_path(primary_path: str, fallback_filename: str) -> str:
    """Safely resolves model or metadata file path across working directory contexts and serverless runtimes."""
    # 1. Direct path check
    if primary_path and os.path.isabs(primary_path) and os.path.exists(primary_path):
        return primary_path
    if primary_path and os.path.exists(primary_path):
        return os.path.abspath(primary_path)

    # 2. Derive base directories anchored to this file location
    core_dir = os.path.dirname(os.path.abspath(__file__))  # backend/app/core
    app_dir = os.path.dirname(core_dir)                    # backend/app
    backend_dir = os.path.dirname(app_dir)                 # backend
    root_dir = os.path.dirname(backend_dir)                # root

    candidates = [
        os.path.join(backend_dir, "models", fallback_filename),
        os.path.join(root_dir, "backend", "models", fallback_filename),
        os.path.join(root_dir, fallback_filename),
        os.path.join("backend", "models", fallback_filename),
        os.path.join("models", fallback_filename),
        os.path.join("..", "backend", "models", fallback_filename),
        os.path.join("..", "models", fallback_filename),
        fallback_filename
    ]
    for c in candidates:
        if os.path.exists(c):
            return os.path.abspath(c)

    return primary_path
