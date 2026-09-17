# Testing Documentation & Verification Matrix

Automated and manual testing strategy for the **Medical Insurance Cost Prediction** application.

---

## 1. Automated Test Suite (`pytest`)

The automated test suite is located in `tests/` and covers FastAPI endpoints, the machine learning pipeline, and Pydantic validation boundaries.

### Running the Tests
```bash
python -m pytest -v
```

### Execution Summary
```text
tests/test_api.py::test_root_endpoint PASSED                             [  4%]
tests/test_api.py::test_health_check_endpoint PASSED                     [  8%]
tests/test_api.py::test_api_v1_health_check PASSED                       [ 13%]
tests/test_api.py::test_valid_prediction_request PASSED                  [ 17%]
tests/test_api.py::test_prediction_smoker_impact PASSED                  [ 21%]
tests/test_api.py::test_invalid_payload_age_out_of_bounds PASSED         [ 26%]
tests/test_api.py::test_invalid_payload_negative_children PASSED         [ 30%]
tests/test_api.py::test_invalid_payload_unknown_category PASSED          [ 34%]
tests/test_api.py::test_missing_required_fields PASSED                   [ 39%]
tests/test_api.py::test_extra_fields_forbidden PASSED                    [ 43%]
tests/test_api.py::test_get_metadata_endpoint PASSED                     [ 47%]
tests/test_api.py::test_get_insights_endpoint PASSED                     [ 52%]
tests/test_ml.py::test_model_artifact_exists PASSED                      [ 56%]
tests/test_ml.py::test_model_loading_and_pipeline_structure PASSED       [ 60%]
tests/test_ml.py::test_inference_on_raw_demographics PASSED              [ 65%]
tests/test_ml.py::test_inference_consistency_and_determinism PASSED      [ 69%]
tests/test_ml.py::test_unknown_category_graceful_handling PASSED         [ 73%]
tests/test_validation.py::test_valid_input_schema PASSED                 [ 78%]
tests/test_validation.py::test_age_boundary_limits PASSED                [ 82%]
tests/test_validation.py::test_bmi_boundary_limits PASSED                [ 86%]
tests/test_validation.py::test_children_boundary_limits PASSED           [ 91%]
tests/test_validation.py::test_categorical_rejection PASSED              [ 95%]
tests/test_validation.py::test_extra_forbidden PASSED                    [100%]

======================= 23 passed in 3.35s =======================
```

---

## 2. Test Coverage Matrix

| Test Module | Test Case | Target Checked | Expected Behavior |
|---|---|---|---|
| `test_api.py` | `test_root_endpoint` | `GET /` | Returns HTTP 200 and project metadata |
| `test_api.py` | `test_health_check_endpoint` | `GET /health` | Returns status 'healthy' and model_loaded: True |
| `test_api.py` | `test_valid_prediction_request`| `POST /api/v1/predict` | Returns valid float charges $> 0$ with USD currency |
| `test_api.py` | `test_prediction_smoker_impact`| Smoker vs Non-smoker | Smoker charge is significantly higher ($> 1.5\times$) |
| `test_api.py` | `test_invalid_payload_age_out_of_bounds` | Boundary age `< 18` | Returns HTTP 422 Unprocessable Entity |
| `test_api.py` | `test_invalid_payload_unknown_category` | Illegal categorical strings | Returns HTTP 422 with descriptive error |
| `test_api.py` | `test_extra_fields_forbidden` | Arbitrary JSON keys | Rejected with HTTP 422 (`extra="forbid"`) |
| `test_api.py` | `test_get_metadata_endpoint` | `GET /api/v1/metadata` | Returns verified training audit JSON |
| `test_api.py` | `test_get_insights_endpoint` | `GET /api/v1/insights` | Returns smoker, age, and BMI error subgroups |
| `test_ml.py` | `test_model_artifact_exists` | Disk artifact check | Confirms `model.pkl` exists |
| `test_ml.py` | `test_model_loading_and_pipeline_structure`| Pipeline steps | Contains preprocessor, scaler, and knn |
| `test_ml.py` | `test_inference_on_raw_demographics` | Direct DataFrame prediction | Produces numeric prediction float |
| `test_ml.py` | `test_inference_consistency_and_determinism`| Predict determinism | Repeated calls yield identical results |
| `test_ml.py` | `test_unknown_category_graceful_handling`| Unseen categories | OneHotEncoder handles unknown gracefully |
| `test_validation.py` | `test_valid_input_schema` | Schema normalization | Lowercases sex, smoker, and region |
| `test_validation.py` | `test_age_boundary_limits` | Age limits | Rejects $< 18$ or $> 100$ |
| `test_validation.py` | `test_bmi_boundary_limits` | BMI limits | Rejects $< 10.0$ or $> 65.0$ |
| `test_validation.py` | `test_children_boundary_limits`| Dependents limits | Rejects $< 0$ or $> 10$ |

---

## 3. Manual Testing Checklist

| Step | Action | Expected Visual / Behavioral Result | Status |
|---|---|---|---|
| 1 | Launch FastAPI (`uvicorn backend.app.main:app`) | Server listens on port 8000, model loaded | Verified |
| 2 | Open `http://127.0.0.1:8000/docs` | Interactive Swagger UI renders all endpoints | Verified |
| 3 | Launch Vite frontend (`npm run dev`) | App loads at `http://localhost:5173` | Verified |
| 4 | Check Navbar health indicator | Green badge displays "Model Online" | Verified |
| 5 | Click "Standard Non-Smoker" preset | Form fields populate automatically | Verified |
| 6 | Click "Calculate Cost Estimate" | Smooth scroll to result card (~$6,833.60) | Verified |
| 7 | Toggle Smoker to "Smoker" | Re-predicted cost surges (~$32,000+) | Verified |
| 8 | Enter invalid age (e.g. 15) | Inline validation error blocks submission | Verified |
| 9 | Check "Benchmarks" section | Real metrics table from `/api/v1/metadata` | Verified |
| 10 | Inspect "Error Analysis" section | Smoker error disparity card ($7,085 vs $2,636) | Verified |
| 11 | Expand Viva Q&A items | Accordion opens explaining ML concepts | Verified |
