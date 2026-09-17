from fastapi import APIRouter, status
from backend.app.schemas.prediction import (
    InsuranceInputSchema,
    PredictionResponseSchema,
    HealthResponseSchema,
    ModelMetadataResponseSchema,
    InsightsResponseSchema
)
from backend.app.services.prediction_service import prediction_service
from backend.app.core.config import settings

api_router = APIRouter()

@api_router.get("/health", response_model=HealthResponseSchema, tags=["Health"])
def health_check():
    """Health check endpoint to verify backend status, model readiness, and metadata."""
    if not prediction_service.is_ready:
        prediction_service.load_artifacts()
    return HealthResponseSchema(
        status="healthy" if (prediction_service.is_ready and prediction_service.metadata is not None) else "degraded",
        model_loaded=prediction_service.is_ready,
        metadata_loaded=prediction_service.metadata is not None,
        version=settings.VERSION
    )

@api_router.post("/predict", response_model=PredictionResponseSchema, status_code=status.HTTP_200_OK, tags=["Prediction"])
def predict_insurance_cost(payload: InsuranceInputSchema):
    """
    Accepts validated beneficiary demographic and health features.
    Executes ML inference using the trained unified pipeline in memory.
    No user prediction records or personal inputs are persisted.
    """
    return prediction_service.predict(payload)

@api_router.get("/metadata", response_model=ModelMetadataResponseSchema, tags=["Model Governance"])
def get_model_metadata():
    """
    Retrieves full verified training metadata, cross-validation metrics,
    hyperparameter search results, and candidate model comparisons.
    """
    return prediction_service.get_metadata()

@api_router.get("/insights", response_model=InsightsResponseSchema, tags=["Model Governance"])
def get_model_insights():
    """
    Retrieves held-out test error analysis broken down by smoker status,
    age brackets, and BMI categories, along with dataset summary.
    """
    return prediction_service.get_insights()
