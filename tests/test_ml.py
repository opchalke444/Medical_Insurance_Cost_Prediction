import os
import joblib
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from backend.app.core.config import resolve_file_path

def test_model_artifact_exists():
    model_path = resolve_file_path("backend/models/model.pkl", "model.pkl")
    assert os.path.exists(model_path), f"model.pkl not found at {model_path}"

def test_model_loading_and_pipeline_structure():
    model_path = resolve_file_path("backend/models/model.pkl", "model.pkl")
    model = joblib.load(model_path)
    assert isinstance(model, Pipeline), "Exported model must be a scikit-learn Pipeline"
    assert "preprocessor" in model.named_steps, "Pipeline must contain 'preprocessor' step"
    assert "scaler" in model.named_steps, "Pipeline must contain 'scaler' step"
    assert "knn" in model.named_steps, "Pipeline must contain 'knn' step"

def test_inference_on_raw_demographics():
    model_path = resolve_file_path("backend/models/model.pkl", "model.pkl")
    model = joblib.load(model_path)
    
    test_input = pd.DataFrame([{
        "age": 30,
        "sex": "female",
        "bmi": 22.0,
        "children": 0,
        "smoker": "no",
        "region": "northeast"
    }])
    
    pred = model.predict(test_input)
    assert len(pred) == 1
    assert isinstance(pred[0], (float, np.floating))
    assert pred[0] > 0.0

def test_inference_consistency_and_determinism():
    model_path = resolve_file_path("backend/models/model.pkl", "model.pkl")
    model = joblib.load(model_path)
    
    test_input = pd.DataFrame([{
        "age": 45,
        "sex": "male",
        "bmi": 32.5,
        "children": 2,
        "smoker": "yes",
        "region": "southwest"
    }])
    
    pred_1 = model.predict(test_input)[0]
    pred_2 = model.predict(test_input)[0]
    assert pred_1 == pred_2, "Inference must be strictly deterministic"

def test_unknown_category_graceful_handling():
    model_path = resolve_file_path("backend/models/model.pkl", "model.pkl")
    model = joblib.load(model_path)
    
    # Passing an unseen category to OneHotEncoder(handle_unknown='ignore')
    test_input = pd.DataFrame([{
        "age": 35,
        "sex": "male",
        "bmi": 26.0,
        "children": 1,
        "smoker": "no",
        "region": "midwest"  # Unseen region
    }])
    
    pred = model.predict(test_input)
    assert len(pred) == 1
    assert pred[0] > 0.0
