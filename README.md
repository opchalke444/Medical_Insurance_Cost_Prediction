# MedCost.AI — Medical Insurance Cost Prediction
### Full-Stack Machine Learning Web Application & Empirical Research

An academic full-stack machine learning application that predicts individual annual medical insurance expenditures based on demographic and health risk factors. Built with a verified **scikit-learn** pipeline, an asynchronous **FastAPI** backend, and a modern **React + Vite + Tailwind CSS** frontend.

---

## 1. Project Overview & Problem Statement

In health insurance economics, predicting annual medical claims (`charges`) is essential for calculating fair actuarial premiums, identifying high-risk clinical populations, and understanding health disparities.

This project delivers:
- **Reproducible Machine Learning:** End-to-end scikit-learn `Pipeline` utilizing `ColumnTransformer` (One-Hot Encoding with `drop='first'` + `StandardScaler`) and `KNeighborsRegressor`.
- **Systematic Cross-Validation:** Hyperparameter tuning across parameter grids for Ridge ($\alpha$) and KNN ($k$) performed strictly on training data via 5-fold cross-validation.
- **RESTful Backend:** Asynchronous API built with **FastAPI** featuring strict **Pydantic v2** validation and zero user data persistence.
- **Modern Responsive Frontend:** Educational, accessibility-compliant web interface with interactive presets, dynamic benchmark visualizations, subgroup error analysis, and a viva voce study guide.

---

## 2. Technology Stack

| Layer | Technologies Used | Key Purpose |
|---|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons | Responsive SPA, interactive form controls, dynamic benchmarks |
| **Backend** | Python 3.11, FastAPI, Uvicorn, Pydantic v2 | In-memory inference, strict input schema validation, CORS |
| **Machine Learning** | scikit-learn, pandas, numpy, joblib | Leakage-free `ColumnTransformer` pipeline, cross-validation |
| **Testing** | pytest, FastAPI TestClient, httpx | Automated API endpoint, ML determinism, and validation tests |

---

## 3. System Architecture

```text
ml_pro1-v2/
├── frontend/                                # React + Vite + Tailwind CSS Web Application
│   ├── src/
│   │   ├── components/                      # Navbar, Hero, Form, Result, Benchmarks, Viva
│   │   ├── services/api.js                  # Frontend API service layer
│   │   ├── App.jsx                          # Main application layout & state
│   │   └── index.css                        # Tailwind directives & global styling
│   ├── package.json
│   └── vite.config.js
│
├── backend/                                 # FastAPI RESTful Backend
│   ├── app/
│   │   ├── main.py                          # FastAPI lifespan & route mounting
│   │   ├── api/routes.py                    # /health, /predict, /metadata, /insights
│   │   ├── schemas/prediction.py            # Pydantic v2 validation schemas
│   │   ├── services/prediction_service.py   # In-memory ML inference execution
│   │   └── core/config.py                   # CORS & artifact resolution
│   ├── models/
│   │   ├── model.pkl                        # Persisted unified ML pipeline
│   │   └── model_metadata.json              # Full cross-validation audit metrics
│   └── requirements.txt
│
├── data/
│   └── insurance.csv                        # 1,338 records (cleaned to 1,337 unique)
│
├── notebooks/
│   └── Medical_Insurance_Cost_Prediction_Third_Year_FINAL.ipynb # Research notebook
│
├── tests/
│   ├── test_api.py                          # 12 API endpoint tests
│   ├── test_ml.py                           # 5 ML pipeline & determinism tests
│   └── test_validation.py                   # 6 Pydantic boundary & rejection tests
│
├── docs/
│   ├── PROJECT_AUDIT.md                     # Comprehensive pre-refactoring audit
│   ├── ARCHITECTURE.md                      # Detailed architecture & sequence diagrams
│   ├── API_DOCUMENTATION.md                 # OpenAPI REST endpoints specification
│   ├── ML_METHODOLOGY.md                    # Detailed ML methodology & math
│   ├── TESTING.md                           # Automated test matrix & execution guide
│   └── DEPLOYMENT.md                        # Local, Docker, and cloud deployment guide
│
├── train_and_save_model.py                  # Reproducible training & export script
├── pytest.ini                               # Pytest configuration
├── requirements.txt                         # Root dependencies
└── README.md
```

---

## 4. Machine Learning Methodology & Benchmarks

### 4.1 Preprocessing Pipeline
1. **Cleaning:** Dropped duplicate observation (1,338 $\to$ 1,337 unique rows).
2. **Train/Test Split:** 80% train ($N=1,069$) and 20% held-out test ($N=268$) with fixed `random_state=42`.
3. **ColumnTransformer:**
   - Categorical (`sex`, `smoker`, `region`): `OneHotEncoder(drop='first', handle_unknown='ignore')` avoids the dummy variable trap.
   - Numerical (`age`, `bmi`, `children`): Scaled with `StandardScaler` alongside one-hot features inside the pipeline to normalize Euclidean distance.

### 4.2 Systematic 5-Fold Cross-Validation Tuning
- **Ridge Regression:** Searched $\alpha \in [0.01, 0.1, 1.0, 10.0, 100.0, 1000.0]$ $\to$ Optimal $\alpha = 1.0$.
- **KNN Regression:** Searched $k \in [3, 5, 7, 9, 11, 15, 21, 31]$ $\to$ Optimal $k = 9$.

### 4.3 Benchmark Comparison (Held-Out Test Set, N=268)

| Model Name | Train $R^2$ | Test $R^2$ | 5-Fold CV $R^2$ | Test MAE ($) | Test RMSE ($) |
|---|:---:|:---:|:---:|:---:|:---:|
| **Linear Regression** | 0.7299 | 0.8069 | 0.7228 | $4,177.05 | $5,956.34 |
| **Ridge Regression ($\alpha=1.0$)** | 0.7299 | 0.8067 | 0.7228 | $4,179.62 | $5,959.23 |
| **KNN Regression ($k=9$)** *(Best Performing)* | **0.8234** | **0.8185** | **0.7673** | **$3,632.17** | **$5,775.73** |

### Model Selection Rationale:
- **Best Overall Performance:** **KNN Regression ($k=9$)** achieves the highest accuracy across all evaluated metrics:
  - **Highest Test $R^2$:** **81.85%** (vs 80.69% for Linear and 80.67% for Ridge)
  - **Lowest Test MAE:** **$3,632.17** (saving over $545 in mean prediction error compared to linear models)
  - **Highest 5-Fold Cross-Validation Score:** **0.7673**
- **Why KNN Outperforms Linear & Ridge Regression:** Linear and Ridge regression assume a purely linear additive relationship between demographic indicators and claims. However, clinical cost drivers interact non-linearly (e.g. smoking combined with high BMI creates exponential claim risks). KNN captures these non-linear local neighborhood clusters directly in standardized Euclidean space without needing artificial polynomial terms.

---

## 5. Subgroup Error Analysis

Held-out test set diagnostics reveal:
- **Smoker Disparity:** Non-smoker claims have low variance ($\text{MAE} \approx \$2,636$), whereas smoker claims exhibit high volatility ($\text{MAE} \approx \$7,085$) due to varying catastrophic hospitalizations.
- **Age Stability:** Error magnitude remains consistent across cohorts ($18-30$ yrs: $\$3,703$, $31-45$ yrs: $\$3,779$, $46-64$ yrs: $\$3,457$).

---

## 6. Local Setup & Execution Guide

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### Quick Start (Run Complete Project At Once)

**Option A — Windows Batch Script (Double-Click or Command Line):**
```cmd
.\run_all.bat
```
This automatically opens both the FastAPI backend and Vite frontend servers in separate windows.

**Option B — PowerShell Script:**
```powershell
.\run_all.ps1
```

**Option C — Single Unified Process (FastAPI serving built frontend & API together):**
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
Open `http://127.0.0.1:8000` to access both the web UI and backend directly from one port!

---

### Manual / Separate Terminal Setup

#### 1. Backend Setup
```bash
# Install Python dependencies (first time only)
pip install -r requirements.txt

# (Optional) Retrain and export ML pipeline
python train_and_save_model.py

# Launch FastAPI Backend Server
uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/health`

#### 2. Frontend Setup
```bash
cd frontend

# Install Node dependencies (first time only)
npm install

# Start Vite Development Server
npm run dev
```
- Open browser at `http://localhost:5173`.

---

## 7. Running Automated Tests

Run the full automated test suite with pytest:
```bash
python -m pytest -v
```
**Results:** 23 passing tests covering API endpoints, Pydantic boundary checks, and ML pipeline determinism.

---

## 8. Privacy & Data Governance

- **Zero Database Persistence:** This application implements no user account or prediction database.
- **In-Memory Inference:** Patient demographics are processed strictly in RAM and discarded immediately after response delivery.
- **Sanitized Logging:** Operational logs do not record raw prediction payloads.

---

## 9. Project Limitations & Future Scope

1. **Dataset Scope:** Trained on benchmark US insurance demographics ($N=1,337$). Real underwriting requires clinical lab results, prescription history, and pre-existing condition markers.
2. **Geographical Granularity:** Limited to 4 US quadrants rather than municipal zip codes.
3. **Future Extension:** Integration of Shapley Additive Explanations (SHAP) for real-time individual patient feature attributions.

---

## 10. License & Academic Attribution
Developed as an academic final-year engineering project for demonstration, examination, and viva voce presentation.

#   M e d i c a l _ I n s u r a n c e _ C o s t _ P r e d i c t i o n  
 #   M e d i c a l _ I n s u r a n c e _ C o s t _ P r e d i c t i o n  
 #   M e d i c a l _ I n s u r a n c e _ C o s t _ P r e d i c t i o n  
 