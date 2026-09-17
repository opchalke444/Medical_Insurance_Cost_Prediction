import os
import json
import logging
import joblib
import pandas as pd
from typing import Optional, Dict, Any
from fastapi import HTTPException

from backend.app.core.config import settings, resolve_file_path
from backend.app.schemas.prediction import InsuranceInputSchema, PredictionResponseSchema

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        self.model = None
        self.metadata: Optional[Dict[str, Any]] = None
        self._model_name: str = "KNN Regression (k=9)"

    def load_artifacts(self) -> None:
        """Loads model pipeline and metadata safely into memory during server startup."""
        resolved_model_path = resolve_file_path(settings.MODEL_PATH, "model.pkl")
        resolved_meta_path = resolve_file_path(settings.METADATA_PATH, "model_metadata.json")

        # 1. Load ML Pipeline
        if not os.path.exists(resolved_model_path):
            logger.error(f"Model file not found at '{resolved_model_path}'")
            self.model = None
        else:
            try:
                self.model = joblib.load(resolved_model_path)
                logger.info(f"Loaded ML model successfully from '{resolved_model_path}'")
            except Exception as e:
                logger.error(f"Failed to deserialize model pipeline: {e}")
                self.model = None

        # 2. Load Metadata
        if os.path.exists(resolved_meta_path):
            try:
                with open(resolved_meta_path, "r", encoding="utf-8") as f:
                    self.metadata = json.load(f)
                    self._model_name = self.metadata.get("model_name", self._model_name)
                logger.info(f"Loaded model metadata from '{resolved_meta_path}'")
            except Exception as e:
                logger.warning(f"Could not load metadata: {e}")
                self.metadata = None
        else:
            logger.warning(f"Metadata file not found at '{resolved_meta_path}'")

    @property
    def is_ready(self) -> bool:
        return self.model is not None

    def predict(self, input_data: InsuranceInputSchema) -> PredictionResponseSchema:
        """
        In-memory inference using the unified scikit-learn pipeline.
        
        PRIVACY GUARANTEE:
        - No database persistence.
        - No file persistence of user inputs.
        - No raw payload logging.
        """
        if not self.is_ready:
            self.load_artifacts()
        if not self.is_ready:
            raise HTTPException(
                status_code=503,
                detail="Machine learning model pipeline is currently unavailable."
            )

        # Structure input matching training feature names exactly
        feature_dict = {
            "age": int(input_data.age),
            "sex": str(input_data.sex),
            "bmi": float(input_data.bmi),
            "children": int(input_data.children),
            "smoker": str(input_data.smoker),
            "region": str(input_data.region)
        }
        input_df = pd.DataFrame([feature_dict])

        try:
            # End-to-end pipeline handles ColumnTransformer (OHE + Scaling) + Regressor
            raw_prediction = float(self.model.predict(input_df)[0])
            bounded_prediction = round(max(0.0, raw_prediction), 2)
        except Exception as e:
            logger.error(f"Inference execution failed: {e}")
            raise HTTPException(
                status_code=500,
                detail="Failed to generate prediction from input features."
            )

        return PredictionResponseSchema(
            prediction=bounded_prediction,
            currency="USD",
            model_name=self._model_name,
            disclaimer=(
                "This is an educational machine learning estimate based on historical dataset trends, "
                "not an official insurance quotation or medical recommendation."
            ),
            features_received=feature_dict
        )

    def get_metadata(self) -> Dict[str, Any]:
        """Returns verified non-sensitive model training metadata."""
        if not self.metadata:
            self.load_artifacts()
        if not self.metadata:
            raise HTTPException(
                status_code=404,
                detail="Model metadata is not available. Please ensure training workflow was executed."
            )
        return self.metadata

    def get_insights(self) -> Dict[str, Any]:
        """Returns subgroup error analysis and dataset summary."""
        if not self.metadata:
            self.load_artifacts()
        if not self.metadata or "error_analysis" not in self.metadata:
            raise HTTPException(
                status_code=404,
                detail="Error analysis and dataset insights are currently unavailable."
            )
        return {
            "model_name": self._model_name,
            "error_analysis": self.metadata.get("error_analysis", {}),
            "dataset_summary": self.metadata.get("dataset", {})
        }

prediction_service = PredictionService()
