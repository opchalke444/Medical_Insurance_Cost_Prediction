import pytest
from fastapi.testclient import TestClient
from backend.app.main import app as target_app

@pytest.fixture
def client():
    with TestClient(target_app) as test_client:
        yield test_client

def test_root_endpoint(client):
    response = client.get("/api-info")
    assert response.status_code == 200
    data = response.json()
    assert "project" in data
    assert data["version"] == "1.0.0"

def test_frontend_spa_served(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "<!doctype html>" in response.text.lower()
    assert "root" in response.text

def test_health_check_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["metadata_loaded"] is True
    assert "version" in data

def test_api_v1_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["metadata_loaded"] is True

def test_valid_prediction_request(client):
    payload = {
        "age": 35,
        "sex": "female",
        "bmi": 24.5,
        "children": 1,
        "smoker": "no",
        "region": "northeast"
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert isinstance(data["prediction"], float)
    assert data["prediction"] > 0.0
    assert data["currency"] == "USD"
    assert "KNN Regression" in data["model_name"]
    assert "disclaimer" in data
    assert data["features_received"]["age"] == 35

def test_prediction_smoker_impact(client):
    non_smoker_payload = {
        "age": 40,
        "sex": "male",
        "bmi": 28.0,
        "children": 0,
        "smoker": "no",
        "region": "southeast"
    }
    smoker_payload = {
        "age": 40,
        "sex": "male",
        "bmi": 28.0,
        "children": 0,
        "smoker": "yes",
        "region": "southeast"
    }
    r_non = client.post("/api/v1/predict", json=non_smoker_payload)
    r_smk = client.post("/api/v1/predict", json=smoker_payload)
    assert r_non.status_code == 200
    assert r_smk.status_code == 200
    # Smoker charges must be substantially higher
    assert r_smk.json()["prediction"] > r_non.json()["prediction"] * 1.5

def test_invalid_payload_age_out_of_bounds(client):
    payload = {
        "age": 10,  # Below minimum 18
        "sex": "male",
        "bmi": 25.0,
        "children": 0,
        "smoker": "no",
        "region": "northwest"
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 422

def test_invalid_payload_negative_children(client):
    payload = {
        "age": 30,
        "sex": "male",
        "bmi": 25.0,
        "children": -2,
        "smoker": "no",
        "region": "northwest"
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 422

def test_invalid_payload_unknown_category(client):
    payload = {
        "age": 30,
        "sex": "other",  # Invalid
        "bmi": 25.0,
        "children": 0,
        "smoker": "sometimes",  # Invalid
        "region": "california"  # Invalid
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 422

def test_missing_required_fields(client):
    payload = {
        "age": 30,
        "bmi": 25.0
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 422

def test_extra_fields_forbidden(client):
    payload = {
        "age": 30,
        "sex": "male",
        "bmi": 25.0,
        "children": 0,
        "smoker": "no",
        "region": "southwest",
        "extra_arbitrary_field": "injected"
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 422

def test_get_metadata_endpoint(client):
    response = client.get("/api/v1/metadata")
    assert response.status_code == 200
    data = response.json()
    assert "model_name" in data
    assert "metrics" in data
    assert "model_comparison" in data
    assert len(data["model_comparison"]) == 3
    model_names = [m["model_name"] for m in data["model_comparison"]]
    assert "Linear Regression" in model_names
    assert "Ridge Regression (alpha=1.0)" in model_names
    assert "KNN Regression (k=9)" in model_names
    assert data["random_state"] == 42

def test_get_insights_endpoint(client):
    response = client.get("/api/v1/insights")
    assert response.status_code == 200
    data = response.json()
    assert "error_analysis" in data
    assert "by_smoker" in data["error_analysis"]
    assert "by_age_bracket" in data["error_analysis"]
    assert "by_bmi_category" in data["error_analysis"]

def test_malformed_json_payload(client):
    response = client.post(
        "/api/v1/predict",
        content="{\"age\": 35, malformed",
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 422

def test_model_unavailable_returns_503(client, monkeypatch):
    from backend.app.services.prediction_service import prediction_service
    # Temporarily simulate missing model and no-op reload
    monkeypatch.setattr(prediction_service, "model", None)
    monkeypatch.setattr(prediction_service, "load_artifacts", lambda: None)
    
    payload = {
        "age": 30,
        "sex": "male",
        "bmi": 25.0,
        "children": 0,
        "smoker": "no",
        "region": "southwest"
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 503
    assert "unavailable" in response.json()["detail"].lower()
