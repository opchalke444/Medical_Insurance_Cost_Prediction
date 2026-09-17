from typing import Literal, Dict, Any, List, Optional
from pydantic import BaseModel, Field, field_validator, ConfigDict

class InsuranceInputSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    age: int = Field(
        ...,
        ge=18,
        le=100,
        description="Age of primary beneficiary in years (18 to 100)",
        examples=[35]
    )
    sex: str = Field(
        ...,
        description="Gender of beneficiary ('male' or 'female')",
        examples=["male"]
    )
    bmi: float = Field(
        ...,
        ge=10.0,
        le=65.0,
        description="Body Mass Index in kg/m^2 (10.0 to 65.0)",
        examples=[26.4]
    )
    children: int = Field(
        default=0,
        ge=0,
        le=10,
        description="Number of covered dependents (0 to 10)",
        examples=[1]
    )
    smoker: str = Field(
        ...,
        description="Smoking status ('yes' or 'no')",
        examples=["no"]
    )
    region: str = Field(
        ...,
        description="Beneficiary residential area in the US ('northeast', 'northwest', 'southeast', 'southwest')",
        examples=["southeast"]
    )

    @field_validator("sex")
    @classmethod
    def validate_sex(cls, v: str) -> str:
        cleaned = v.strip().lower()
        if cleaned not in ["male", "female"]:
            raise ValueError("Sex must be either 'male' or 'female'.")
        return cleaned

    @field_validator("smoker")
    @classmethod
    def validate_smoker(cls, v: str) -> str:
        cleaned = v.strip().lower()
        if cleaned not in ["yes", "no"]:
            raise ValueError("Smoker status must be either 'yes' or 'no'.")
        return cleaned

    @field_validator("region")
    @classmethod
    def validate_region(cls, v: str) -> str:
        cleaned = v.strip().lower()
        if cleaned not in ["northeast", "northwest", "southeast", "southwest"]:
            raise ValueError("Region must be one of: 'northeast', 'northwest', 'southeast', 'southwest'.")
        return cleaned


class PredictionResponseSchema(BaseModel):
    prediction: float = Field(..., description="Estimated annual insurance charges in USD")
    currency: str = Field(default="USD", description="Currency symbol/code")
    model_name: str = Field(..., description="Name of the machine learning model used")
    disclaimer: str = Field(
        default="This is an educational machine learning estimate based on historical dataset patterns, not an official insurance quote or medical assessment.",
        description="Educational and legal disclaimer"
    )
    features_received: Dict[str, Any] = Field(..., description="Sanitized demographic features received")


class HealthResponseSchema(BaseModel):
    status: str = Field(default="healthy", description="API operational status")
    model_loaded: bool = Field(..., description="Whether the ML pipeline is loaded and ready")
    metadata_loaded: bool = Field(default=False, description="Whether the training metadata is loaded")
    version: str = Field(..., description="API version")


class ModelComparisonItemSchema(BaseModel):
    model_name: str
    train_r2: float
    test_r2: float
    cv_r2_mean: float
    cv_r2_std: float
    cv_mae: float
    cv_rmse: float
    test_mae: float
    test_rmse: float


class ModelMetadataResponseSchema(BaseModel):
    model_name: str
    model_type: str
    task: str
    target: str
    training_date: str
    random_state: int
    dataset: Dict[str, Any]
    hyperparameter_search: Dict[str, Any]
    selected_hyperparameters: Dict[str, Any]
    metrics: Dict[str, Any]
    model_comparison: List[ModelComparisonItemSchema]
    environment: Dict[str, str]


class InsightsResponseSchema(BaseModel):
    model_name: str
    error_analysis: Dict[str, Any]
    dataset_summary: Dict[str, Any]
