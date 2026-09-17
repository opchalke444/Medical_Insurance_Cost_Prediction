# MedCost.AI — Medical Insurance Cost Prediction

[![Python](https://img.shields.io/badge/Python-3.11-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.3+-F7931E.svg?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Tests Passing](https://img.shields.io/badge/tests-26%20passed-success.svg)](tests/)

An academic full-stack machine learning application designed to predict annual medical insurance expenditures based on individual demographic, clinical, and lifestyle factors.

---

## 📌 Quick Links

- 🌐 **Live Web Application:** [Medical Insurance Cost Predictor](https://medical-insurance-cost-prediction-u-beta.vercel.app/)
- 📖 **Interactive API Documentation:** [Swagger UI (/docs)](https://medical-insurance-cost-prediction-u-beta.vercel.app/docs)
- 🔬 **Research Notebook:** [`notebooks/Medical_Insurance_Cost_Prediction_Third_Year_FINAL.ipynb`](notebooks/Medical_Insurance_Cost_Prediction_Third_Year_FINAL.ipynb)
- 🧪 **Automated Test Suite (26 Tests):** [`tests/`](tests/)
- 🎓 **Viva Voce Defense Guide:** [`docs/VIVA_QUESTIONS.md`](docs/VIVA_QUESTIONS.md)
- ⚠️ **Project Limitations Document:** [`docs/LIMITATIONS.md`](docs/LIMITATIONS.md)

---

## 1. Project Overview

In health insurance economics, accurate claims forecasting is critical for fair premium computation, risk categorization, and identifying health disparities.

This project delivers:
- **Reproducible Machine Learning:** A verified, leakage-free `scikit-learn` Pipeline incorporating categorical One-Hot Encoding (`drop='first'`), feature scaling (`StandardScaler`), and non-linear regression.
- **Strict 3-Model Scope:** Focuses squarely on core syllabus models — **Linear Regression**, **Ridge Regression**, and **KNN Regression**.
- **Asynchronous REST API:** Built with **FastAPI** featuring strict **Pydantic v2** input validation, in-memory model execution, and health monitoring.
- **Modern Web Interface:** Built with **React 19, Vite, and Tailwind CSS**, featuring real-time form validation, cost estimation, dynamic benchmark tables, and risk factor badges.

---

## 2. Machine Learning Methodology & Benchmarks

### Dataset Summary
- **Source:** US Medical Insurance Dataset (`data/insurance.csv`)
- **Total Records:** 1,338 records (1 duplicate cleaned $\rightarrow$ 1,337 unique samples)
- **Train/Test Split:** 80% Train ($N=1,069$) / 20% Test ($N=268$), `random_state=42`
- **Features:**
  - **Numerical (3):** `age`, `bmi`, `children`
  - **Categorical (3):** `sex` (male/female), `smoker` (yes/no), `region` (northeast/northwest/southeast/southwest)
- **Target:** `charges` (Annual medical expenditures in USD)

### 3-Model Comparison & Evaluation

All three project models were evaluated on the exact same held-out test split ($N=268$):

| Model Name | Train $R^2$ | Test $R^2$ | 5-Fold CV $R^2$ | Test MAE | Test RMSE | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **KNN Regression ($k=9$)** | **0.8234** | **0.8185** | **0.7673** | **$3,632.17** | **$5,775.73** | **Selected Best Model** |
| **Linear Regression** | 0.7299 | 0.8069 | 0.7228 | $4,177.05 | $5,956.34 | Linear Baseline |
| **Ridge Regression ($\alpha=1.0$)** | 0.7299 | 0.8067 | 0.7228 | $4,179.62 | $5,959.23 | Regularized Baseline |

### Why KNN Regression ($k=9$) Was Selected:
1. **Highest Predictive Accuracy:** Achieves the highest test $R^2$ (**81.85%**) and the lowest Mean Absolute Error (**$3,632.17**), reducing prediction error by over **$545** compared to linear baselines.
2. **Non-Linear Interactions:** Linear models assume uniform additive effects. KNN captures local non-linear demographic clusters (such as the exponential claim risk of obese smokers) directly in standardized Euclidean space.
3. **Neighborhood Interpretability:** The instance-based neighborhood representation reflects real-world actuarial comparisons: *"Individuals with similar demographics historically experienced similar healthcare costs."*

---

## 3. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons | Responsive UI, interactive form, instant visual results |
| **Backend** | Python 3.11, FastAPI, Uvicorn, Pydantic v2 | High-speed REST API, schema validation, CORS security |
| **Machine Learning** | scikit-learn, pandas, numpy, joblib | Leakage-free Pipeline, ColumnTransformer, 5-fold CV |
| **Testing** | pytest, FastAPI TestClient, httpx | 26 automated tests covering API, ML, and validation |
| **Deployment** | Vercel Serverless | Automated Git deployment, zero-config FastAPI serving |

---

## 4. Repository Structure

```text
.
├── backend/
│   ├── app/
│   │   ├── api/routes.py                  # API routes: /health, /predict, /metadata, /insights
│   │   ├── core/config.py                 # Settings, CORS whitelist, artifact paths
│   │   ├── schemas/prediction.py          # Pydantic v2 input schemas and constraints
│   │   ├── services/prediction_service.py # In-memory pipeline inference loader
│   │   └── main.py                        # FastAPI application entrypoint & static SPA mounting
│   └── models/
│       ├── model.pkl                      # Trained scikit-learn pipeline artifact
│       └── model_metadata.json            # Verified benchmark metrics & SHA-256 checksum
├── data/
│   └── insurance.csv                      # Canonical insurance demographics dataset
├── docs/
│   ├── API_DOCUMENTATION.md               # Full REST API specification & curl examples
│   ├── ARCHITECTURE.md                    # System design and request lifecycle diagrams
│   ├── DEPLOYMENT.md                      # Deployment guide for local, Docker, and Vercel
│   ├── LIMITATIONS.md                     # Clinical, academic, and algorithmic boundaries
│   ├── ML_METHODOLOGY.md                  # Mathematical equations and preprocessing steps
│   └── VIVA_QUESTIONS.md                  # Comprehensive viva voce preparation guide
├── frontend/
│   ├── dist/                              # Production pre-built assets
│   ├── src/
│   │   ├── components/                    # Prediction form, comparison tables, navbar
│   │   ├── services/api.js                # API client connecting to FastAPI
│   │   ├── App.jsx                        # Main application component
│   │   └── main.jsx                       # React root entrypoint
│   ├── index.html                         # HTML5 template
│   └── package.json                       # Node.js dependencies
├── notebooks/
│   └── Medical_Insurance_Cost_Prediction_Third_Year_FINAL.ipynb # Academic research notebook
├── tests/
│   ├── README.md                          # Test suite documentation & coverage guide
│   ├── test_api.py                        # 15 tests for FastAPI endpoints
│   ├── test_ml.py                         # 5 tests for ML pipeline & determinism
│   └── test_validation.py                 # 6 tests for Pydantic input boundary limits
├── pyproject.toml                         # Python package configuration & Vercel entrypoint
├── pytest.ini                             # Pytest configuration
├── requirements.txt                       # Production Python dependencies
└── train_and_save_model.py                # Reproducible training, cross-validation & export script
```

---

## 5. Local Setup & Execution Guide

### Prerequisites
- **Python 3.10+** (Tested on Python 3.11.9)
- **Node.js 18+** (Optional, only needed if modifying frontend)

### Step 1: Clone the Repository
```bash
git clone https://github.com/opchalke444/Medical_Insurance_Cost_Prediction.git
cd Medical_Insurance_Cost_Prediction
```

### Step 2: Set Up Python Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate on Windows:
venv\Scripts\activate

# Activate on macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Run the Reproducible ML Workflow (Optional)
```bash
python train_and_save_model.py
```
*Trains Linear, Ridge, and KNN models, runs 5-fold cross-validation, verifies test metrics, and exports `backend/models/model.pkl` with SHA-256 verification.*

### Step 4: Run Automated Tests
```bash
python -m pytest -v
```
*Executes all 26 unit, integration, and validation tests.*

### Step 5: Start the Full-Stack Application
```bash
# Start FastAPI backend (serves both API and pre-built frontend)
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

- **Web Application:** Open [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs:** Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Health Probe:** Open [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## 6. API Reference

### Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Application status & model readiness probe |
| `GET` | `/api/v1/health` | Scoped API health verification |
| `POST` | `/api/v1/predict` | Generate cost estimate for demographic inputs |
| `GET` | `/api/v1/metadata` | Retrieve verified 3-model benchmark metrics |
| `GET` | `/api/v1/insights` | Held-out error percentiles and subgroup metrics |
| `GET` | `/docs` | Interactive Swagger API documentation |

### Example Prediction Request

```bash
curl -X POST "https://medical-insurance-cost-prediction-u-beta.vercel.app/api/v1/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 35,
    "sex": "male",
    "bmi": 28.5,
    "children": 1,
    "smoker": "no",
    "region": "northwest"
  }'
```

**Response (`200 OK`):**
```json
{
  "prediction": 5719.81,
  "currency": "USD",
  "model_name": "KNN Regression (k=9)",
  "disclaimer": "This is an educational machine learning estimate based on historical dataset trends, not an official insurance quotation or medical recommendation.",
  "features_received": {
    "age": 35,
    "sex": "male",
    "bmi": 28.5,
    "children": 1,
    "smoker": "no",
    "region": "northwest"
  }
}
```

---

## 7. Input Validation Boundaries

Inputs to `/api/v1/predict` are strictly validated by Pydantic v2:

| Field | Type | Permitted Range / Values | Description |
| :--- | :--- | :--- | :--- |
| `age` | Integer | $18 \le \text{age} \le 100$ | Insured party age in years |
| `sex` | String | `"male"`, `"female"` | Biological sex (case-insensitive) |
| `bmi` | Float | $10.0 \le \text{BMI} \le 65.0$ | Body Mass Index ($\text{kg/m}^2$) |
| `children` | Integer | $0 \le \text{children} \le 10$ | Number of covered dependents |
| `smoker` | String | `"yes"`, `"no"` | Smoking status (case-insensitive) |
| `region` | String | `"northeast"`, `"northwest"`, `"southeast"`, `"southwest"` | Residential zone |

*Any unlisted or extra fields in the JSON payload are rejected with HTTP 422.*

---

## 8. Academic Viva Voce & Presentation Guide

For college examination and project defense, refer to the curated documentation:
- 📋 [**Viva Voce Questions & Answers**](docs/VIVA_QUESTIONS.md) — Common professor questions regarding train/test splitting, why KNN outperforms Linear/Ridge on this dataset, feature scaling, and evaluation metrics.
- 🔬 [**Mathematical Methodology**](docs/ML_METHODOLOGY.md) — Equations for OLS, Ridge L2 penalty, and Euclidean distance KNN.
- ⚖️ [**Limitations & Ethical Considerations**](docs/LIMITATIONS.md) — Discussion of real-world underwriting boundaries and demographic bias.

---

## 9. License & Attribution

This project is created for academic research, university examination, and demonstration purposes.

**Author:** Omkar Prakash Chalke ([@opchalke444](https://github.com/opchalke444))  
**Academic Degree:** Final-Year Engineering Project