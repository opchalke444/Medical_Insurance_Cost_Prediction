# Medical Insurance Prediction — FastAPI Backend

A high-performance, asynchronous RESTful API built with **FastAPI** to serve the Medical Insurance Cost Prediction machine learning pipeline.

---

## Features

- **In-Memory ML Inference:** Loads the unified scikit-learn `Pipeline` (ColumnTransformer + StandardScaler + KNN) once at startup.
- **Strict Input Validation:** Uses Pydantic v2 schemas to validate demographic and clinical inputs (`age`, `bmi`, `children`, `sex`, `smoker`, `region`).
- **Zero Personal Data Storage:** Ensures no database or file logging of sensitive user inputs.
- **Model Governance Endpoints:** Exposes `/metadata` and `/insights` returning verified cross-validation scores, candidate comparisons, and subgroup error analysis.
- **Academic & Rigorous:** Includes automated healthchecks, CORS middleware, structured error handling, and interactive Swagger UI.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Root health status & model loading readiness |
| `GET` | `/api/v1/health` | API v1 health check |
| `POST` | `/api/v1/predict` | Generate cost prediction for validated input |
| `GET` | `/api/v1/metadata` | Retrieve verified training metrics & parameters |
| `GET` | `/api/v1/insights` | Retrieve held-out error analysis & dataset summary |
| `GET` | `/docs` | Interactive Swagger API documentation |

---

## Local Development

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Development Server
```bash
uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Test Endpoints
- Swagger Documentation: `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/health`
