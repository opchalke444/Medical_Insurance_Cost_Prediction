# Automated Test Suite

[![Tests Status](https://img.shields.io/badge/tests-26%20passed-success.svg)](#test-execution-summary)
[![Framework](https://img.shields.io/badge/framework-pytest%209.1-blue.svg)](https://docs.pytest.org/)
[![Coverage](https://img.shields.io/badge/coverage-API%20%7C%20ML%20%7C%20Validation-informational.svg)](#test-coverage-breakdown)

Automated testing framework for the **Medical Insurance Cost Prediction** full-stack machine learning application. This test suite verifies REST API endpoints, Pydantic v2 validation boundaries, and in-memory scikit-learn pipeline inference.

---

## Quick Start

Run the entire test suite from the repository root:

```bash
# Run all 26 automated tests
pytest -v

# Or using Python module execution
python -m pytest -v
```

To run a specific test module:

```bash
# Test API endpoints only (15 tests)
pytest tests/test_api.py -v

# Test ML model & pipeline only (5 tests)
pytest tests/test_ml.py -v

# Test Pydantic input validation only (6 tests)
pytest tests/test_validation.py -v
```

---

## Test Directory Structure

```text
tests/
├── README.md               # Test suite documentation (this file)
├── test_api.py             # FastAPI REST endpoints, status codes & responses (15 tests)
├── test_ml.py              # Scikit-learn pipeline, artifact loading & inference (5 tests)
└── test_validation.py      # Demographic boundary limits & schema enforcement (6 tests)
```

---

## Test Coverage Breakdown

### 1. API Integration Tests (`test_api.py`)
Validates that the FastAPI application routes, middleware, and exception handlers function correctly under both normal and adversarial conditions.

| Test Function | Endpoint / Target | What It Verifies |
| :--- | :--- | :--- |
| `test_root_endpoint` | `GET /` | Returns HTTP 200 and root project information |
| `test_frontend_spa_served` | `GET /` | Static SPA HTML is served correctly from `frontend/dist` |
| `test_health_check_endpoint` | `GET /health` | Root health status reports `healthy` with model loaded |
| `test_api_v1_health_check` | `GET /api/v1/health` | API v1 scoped health probe confirms operational state |
| `test_valid_prediction_request` | `POST /api/v1/predict` | Valid demographic input generates numeric USD prediction |
| `test_prediction_smoker_impact` | `POST /api/v1/predict` | Verifies smoker status increases premium significantly ($>1.5\times$) |
| `test_invalid_payload_age_out_of_bounds` | `POST /api/v1/predict` | Out-of-range age ($<18$) returns HTTP 422 Unprocessable Entity |
| `test_invalid_payload_negative_children` | `POST /api/v1/predict` | Negative dependent count returns HTTP 422 |
| `test_invalid_payload_unknown_category` | `POST /api/v1/predict` | Invalid sex/smoker/region categorical values rejected with 422 |
| `test_missing_required_fields` | `POST /api/v1/predict` | Incomplete payload missing mandatory fields returns HTTP 422 |
| `test_extra_fields_forbidden` | `POST /api/v1/predict` | Injected arbitrary JSON keys rejected with HTTP 422 (`extra="forbid"`) |
| `test_get_metadata_endpoint` | `GET /api/v1/metadata` | Confirms exactly 3 comparison models (Linear, Ridge, KNN) |
| `test_get_insights_endpoint` | `GET /api/v1/insights` | Held-out error percentiles and subgroup metrics are returned |
| `test_malformed_json_payload` | `POST /api/v1/predict` | Unparseable raw JSON syntax handled gracefully with HTTP 422 |
| `test_model_unavailable_returns_503` | `POST /api/v1/predict` | Missing artifact returns HTTP 503 Service Unavailable |

---

### 2. Machine Learning Pipeline Tests (`test_ml.py`)
Validates model artifact integrity, preprocessing column transformers, and numerical determinism.

| Test Function | What It Verifies |
| :--- | :--- |
| `test_model_artifact_exists` | Canonical artifact `backend/models/model.pkl` exists on disk |
| `test_model_loading_and_pipeline_structure` | Pipeline steps contain `preprocessor`, `scaler`, and `knn` |
| `test_inference_on_raw_demographics` | Pipeline accepts raw un-preprocessed pandas DataFrame directly |
| `test_inference_consistency_and_determinism` | Repeated predictions with identical input produce exact same float |
| `test_unknown_category_graceful_handling` | OneHotEncoder handles unseen categories gracefully (`handle_unknown='ignore'`) |

---

### 3. Input Validation Boundary Tests (`test_validation.py`)
Validates Pydantic v2 `InsuranceInputSchema` validation boundaries and constraints.

| Test Function | Boundary Rule Tested | Valid Range | Failure Code |
| :--- | :--- | :--- | :--- |
| `test_valid_input_schema` | Case-insensitive normalizer | Capital letters (`MALE`, `YES`) converted to lowercase | Passes |
| `test_age_boundary_limits` | Adult age constraint | $18 \le \text{age} \le 100$ | HTTP 422 |
| `test_bmi_boundary_limits` | Clinical BMI bounds | $10.0 \le \text{BMI} \le 65.0$ | HTTP 422 |
| `test_children_boundary_limits` | Dependents count | $0 \le \text{children} \le 10$ | HTTP 422 |
| `test_categorical_rejection` | Enumerated options | `sex`: male/female, `smoker`: yes/no, `region`: 4 zones | HTTP 422 |
| `test_extra_forbidden` | Payload sanitization | No unauthorized attributes allowed | HTTP 422 |

---

## Test Execution Summary

```text
============================= test session starts =============================
platform win32 -- Python 3.11.9, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Users\User\Desktop\ml_pro1-v2
configfile: pytest.ini
testpaths: tests

tests/test_api.py::test_root_endpoint PASSED                             [  3%]
tests/test_api.py::test_frontend_spa_served PASSED                       [  7%]
tests/test_api.py::test_health_check_endpoint PASSED                     [ 11%]
tests/test_api.py::test_api_v1_health_check PASSED                       [ 15%]
tests/test_api.py::test_valid_prediction_request PASSED                  [ 19%]
tests/test_api.py::test_prediction_smoker_impact PASSED                  [ 23%]
tests/test_api.py::test_invalid_payload_age_out_of_bounds PASSED         [ 26%]
tests/test_api.py::test_invalid_payload_negative_children PASSED         [ 30%]
tests/test_api.py::test_invalid_payload_unknown_category PASSED          [ 34%]
tests/test_api.py::test_missing_required_fields PASSED                   [ 38%]
tests/test_api.py::test_extra_fields_forbidden PASSED                    [ 42%]
tests/test_api.py::test_get_metadata_endpoint PASSED                     [ 46%]
tests/test_api.py::test_get_insights_endpoint PASSED                     [ 50%]
tests/test_api.py::test_malformed_json_payload PASSED                    [ 53%]
tests/test_api.py::test_model_unavailable_returns_503 PASSED             [ 57%]
tests/test_ml.py::test_model_artifact_exists PASSED                      [ 61%]
tests/test_ml.py::test_model_loading_and_pipeline_structure PASSED       [ 65%]
tests/test_ml.py::test_inference_on_raw_demographics PASSED              [ 69%]
tests/test_ml.py::test_inference_consistency_and_determinism PASSED      [ 73%]
tests/test_ml.py::test_unknown_category_graceful_handling PASSED         [ 76%]
tests/test_validation.py::test_valid_input_schema PASSED                 [ 80%]
tests/test_validation.py::test_age_boundary_limits PASSED                [ 84%]
tests/test_validation.py::test_bmi_boundary_limits PASSED                [ 88%]
tests/test_validation.py::test_children_boundary_limits PASSED           [ 92%]
tests/test_validation.py::test_categorical_rejection PASSED              [ 96%]
tests/test_validation.py::test_extra_forbidden PASSED                    [100%]

======================= 26 passed in ~4.3s =======================
```
