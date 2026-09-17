# REST API Documentation & Specification

The **MedCost.AI** backend exposes high-performance RESTful endpoints built with FastAPI. Interactive OpenAPI Swagger documentation is available at `http://127.0.0.1:8000/docs`.

---

## 1. Endpoints Overview

| Method | Endpoint | Summary | Response Code |
|---|---|---|---|
| `GET` | `/health` | Root service health & model readiness | `200 OK` |
| `GET` | `/api/v1/health` | API v1 scoped health status | `200 OK` |
| `POST` | `/api/v1/predict` | Generate ML cost prediction | `200 OK` / `422` / `503` |
| `GET` | `/api/v1/metadata` | Retrieve verified training metrics | `200 OK` / `404` |
| `GET` | `/api/v1/insights` | Retrieve held-out error subgroup analysis | `200 OK` / `404` |

---

## 2. Endpoint Details

### 2.1 Health Check

#### Request
```http
GET /health HTTP/1.1
Host: 127.0.0.1:8000
Accept: application/json
```

#### Response (`200 OK`)
```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "1.0.0"
}
```

---

### 2.2 Cost Prediction Endpoint

#### Request
```http
POST /api/v1/predict HTTP/1.1
Host: 127.0.0.1:8000
Content-Type: application/json
Accept: application/json

{
  "age": 35,
  "sex": "male",
  "bmi": 26.5,
  "children": 1,
  "smoker": "no",
  "region": "southeast"
}
```

#### Input Validation Constraints (Pydantic v2)
| Field | Type | Required | Constraints / Allowed Values | Description |
|---|---|---|---|---|
| `age` | integer | Yes | `18 <= age <= 100` | Beneficiary age in years |
| `sex` | string | Yes | `'male'`, `'female'` | Biological sex (case-insensitive) |
| `bmi` | float | Yes | `10.0 <= bmi <= 65.0` | Body Mass Index ($kg/m^2$) |
| `children`| integer | No (default: 0) | `0 <= children <= 10` | Covered dependent children |
| `smoker` | string | Yes | `'yes'`, `'no'` | Tobacco smoker status (case-insensitive) |
| `region` | string | Yes | `'northeast'`, `'northwest'`, `'southeast'`, `'southwest'` | US geographical territory |

#### Response (`200 OK`)
```json
{
  "prediction": 6833.60,
  "currency": "USD",
  "model_name": "KNN Regression (k=9)",
  "disclaimer": "This is an educational machine learning estimate based on historical dataset trends, not an official insurance quotation or medical recommendation.",
  "features_received": {
    "age": 35,
    "sex": "male",
    "bmi": 26.5,
    "children": 1,
    "smoker": "no",
    "region": "southeast"
  }
}
```

#### Error Responses
- **`422 Unprocessable Entity`**: Payload failed schema validation (e.g. `age < 18`, invalid category string, missing field, or extra fields passed).
  ```json
  {
    "detail": [
      {
        "type": "greater_than_equal",
        "loc": ["body", "age"],
        "msg": "Input should be greater than or equal to 18",
        "input": 15
      }
    ]
  }
  ```
- **`503 Service Unavailable`**: Pipeline artifact `model.pkl` could not be loaded into server memory.

---

### 2.3 Model Governance Metadata

#### Request
```http
GET /api/v1/metadata HTTP/1.1
Host: 127.0.0.1:8000
Accept: application/json
```

#### Response (`200 OK`)
Returns training audit data including:
- Primary selected model (`KNN Regression (k=9)`)
- Optimal hyperparameters found via 5-fold cross-validation
- Systematic model comparison table (Linear Regression, Ridge Regression, KNN Regression) with Train $R^2$, Test $R^2$, 5-Fold CV $R^2$, Test MAE, and Test RMSE.
- Python and library environment versions.

---

### 2.4 Diagnostic Insights & Error Analysis

#### Request
```http
GET /api/v1/insights HTTP/1.1
Host: 127.0.0.1:8000
Accept: application/json
```

#### Response (`200 OK`)
```json
{
  "model_name": "KNN Regression (k=9)",
  "error_analysis": {
    "percentiles": {
      "p25": 1056.45,
      "p50_median": 2341.12,
      "p75": 4890.34,
      "p90": 8920.10,
      "max": 24500.00
    },
    "by_smoker": {
      "no": {
        "count": 214,
        "mean_actual": 8202.99,
        "mean_predicted": 8406.85,
        "mae": 2636.09,
        "rmse": 4512.30
      },
      "yes": {
        "count": 54,
        "mean_actual": 35311.26,
        "mean_predicted": 32534.54,
        "mae": 7085.22,
        "rmse": 9120.45
      }
    },
    "by_age_bracket": {
      "18-30": { "count": 84, "mae": 3703.45 },
      "31-45": { "count": 89, "mae": 3779.38 },
      "46-64": { "count": 95, "mae": 3457.35 }
    },
    "by_bmi_category": {
      "Normal (18.5-24.9)": { "count": 45, "mae": 2153.97 },
      "Overweight (25-29.9)": { "count": 78, "mae": 4226.59 },
      "Obese (>=30)": { "count": 140, "mae": 3749.46 }
    }
  },
  "dataset_summary": {
    "total_samples": 1337,
    "train_samples": 1069,
    "test_samples": 268
  }
}
```

---

## 3. Example cURL Commands

### Predict Insurance Cost
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/predict" \
     -H "Content-Type: application/json" \
     -d '{
       "age": 42,
       "sex": "female",
       "bmi": 28.3,
       "children": 2,
       "smoker": "no",
       "region": "northwest"
     }'
```

### Health Check
```bash
curl -X GET "http://127.0.0.1:8000/health"
```
