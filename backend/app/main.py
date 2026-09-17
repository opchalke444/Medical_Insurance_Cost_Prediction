import sys
import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

# Ensure repository root and backend directory are in sys.path for serverless runtimes
_current_dir = os.path.dirname(os.path.abspath(__file__)) # backend/app
_backend_dir = os.path.dirname(_current_dir)             # backend
_root_dir = os.path.dirname(_backend_dir)                # project root

for _p in [_root_dir, _backend_dir]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

from backend.app.core.config import settings
from backend.app.api.routes import api_router
from backend.app.services.prediction_service import prediction_service

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager to load ML model and metadata on startup."""
    logger.info("Initializing Medical Insurance Prediction Backend...")
    prediction_service.load_artifacts()
    if prediction_service.is_ready:
        logger.info("ML Pipeline loaded and ready for in-memory inference.")
    else:
        logger.warning("ML Pipeline could not be loaded on startup. Check model.pkl location.")
    yield
    logger.info("Shutting down Medical Insurance Prediction Backend.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Full-Stack Machine Learning REST API for Medical Insurance Cost Prediction. "
        "Provides validated in-memory inference, verified evaluation metadata, and "
        "subgroup error analysis with strict zero personal data persistence."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware configuration (authoritative source in core/config.py)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Authorization"],
)

# Mount API routers
app.include_router(api_router, prefix=settings.API_V1_STR)

# Direct root-level /health endpoint for monitoring tools & healthchecks
@app.get("/health", tags=["Health"])
def root_health():
    """Root health check endpoint reporting model and metadata readiness."""
    if not prediction_service.is_ready:
        prediction_service.load_artifacts()
    return {
        "status": "healthy" if (prediction_service.is_ready and prediction_service.metadata is not None) else "degraded",
        "model_loaded": prediction_service.is_ready,
        "metadata_loaded": prediction_service.metadata is not None,
        "version": settings.VERSION
    }

@app.get("/api-info", tags=["Root"])
def root_info():
    """Root info endpoint providing service links."""
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health",
        "api_v1": settings.API_V1_STR
    }

# Mount frontend production build if available
frontend_dist = os.path.abspath(os.path.join(_root_dir, "frontend", "dist"))
if os.path.exists(frontend_dist) and os.path.isdir(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
else:
    @app.get("/", tags=["Root"])
    def root_fallback():
        return {
            "project": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "docs": "/docs",
            "health": "/health",
            "api_v1": settings.API_V1_STR,
            "status": "API is online. Built frontend not mounted."
        }
