# Project Audit & Technical Evaluation Report

**Project:** Medical Insurance Cost Prediction Using Machine Learning  
**Date of Audit:** 2026-09-16  
**Auditor:** Senior Full-Stack ML Engineer  
**Scope:** Architecture, Notebook Workflow, Training Pipeline, Streamlit UI, Dataset Handling, Reproducibility, Security, and Code Quality.

---

## Executive Summary

The project provides a solid educational foundation for predicting individual medical insurance charges using supervised regression models. However, an in-depth audit of the repository reveals critical architectural, machine learning, and operational gaps that prevent it from being production-ready or resilient to real-world edge cases.

Key areas requiring remediation:
1. **Hyperparameter Tuning Parity:** Discrepancy between research notebook (which performs grid cross-validation) and `train_and_save_model.py` (which hardcoded parameters).
2. **Preprocessing Inconsistency & Training-Serving Skew:** One-hot encoding was executed outside the scikit-learn pipeline using `pd.get_dummies()`, forcing `app.py` to maintain manual dictionary encodings.
3. **Hardcoded UI Metrics:** Model comparison numbers were hardcoded as static strings in Streamlit UI.
4. **Input Validation Gaps:** Only lower-bound checks were implemented without type enforcement or categorical bounds.
5. **Zero Automated Testing:** No automated tests existed for API, ML inference, or input validation.

---

## Detailed Audit Dimensions (A – N)

### A. Project Directory Structure
- **Current State:** Monolithic root directory containing mixed concerns (`app.py`, `train_and_save_model.py`, `model.pkl`, `insurance.csv`, `requirements.txt`, `README.md`, and `.ipynb`).
- **Severity:** Medium
- **Evidence:** All scripts, notebooks, datasets, and models reside in the root directory.
- **Recommended Fix:** Modular full-stack directory hierarchy separating `frontend/`, `backend/`, `data/`, `notebooks/`, `tests/`, and `docs/`.
- **Status:** In Progress (Implementing clean monorepo architecture).

### B. Notebook Workflow
- **Current State:** Notebook `Medical_Insurance_Cost_Prediction_Third_Year_FINAL.ipynb` is well-structured with 86 cells covering exploratory data analysis, visualizations, feature correlation, 5-fold cross-validation, and residual analysis.
- **Severity:** Low
- **Evidence:** Notebook demonstrates rigorous data exploration and compares Linear Regression, Ridge, and KNN.
- **Recommended Fix:** Preserve the notebook in `notebooks/` as the primary exploratory research artifact.
- **Status:** Preserved and documented.

### C. Training Script (`train_and_save_model.py`)
- **Current State:** Does not execute the hyperparameter search established in the notebook; hardcodes Ridge `alpha=1.0` and KNN `k=9`. Encodes categorical variables via `pd.get_dummies()` before creating the pipeline.
- **Severity:** High
- **Evidence:**
  ```python
  # Lines 103-105:
  ridge_pipeline = Pipeline([("scaler", StandardScaler()), ("ridge", Ridge(alpha=1.0))])
  # Lines 115-117:
  knn_pipeline = Pipeline([("scaler", StandardScaler()), ("knn", KNeighborsRegressor(n_neighbors=9))])
  ```
- **Recommended Fix:** Implement automated 5-fold cross-validation grid search for Ridge $\alpha \in [0.01, 0.1, 1.0, 10.0, 100.0, 1000.0]$ and KNN $k \in [3, 5, 7, 9, 11, 15, 21, 31]$. Package preprocessing inside a `ColumnTransformer` within the exported pipeline.
- **Status:** In Progress.

### D. Streamlit Application (`app.py`)
- **Current State:** Tightly coupled UI, manual feature mapping, and hardcoded static evaluation metrics.
- **Severity:** Medium
- **Evidence:**
  ```python
  # Lines 36-40:
  "sex_male": 1 if str(sex_val).strip().lower() == "male" else 0,
  "smoker_yes": 1 if str(smoker_val).strip().lower() == "yes" else 0,
  # Lines 284-288:
  eval_df = pd.DataFrame([
      {"Model": "Linear Regression", "Test R²": "0.807", "Test MAE": "$4,177.05", ...}
  ])
  ```
- **Recommended Fix:** Replace with a decoupled React SPA communicating via REST API with dynamic metrics from `model_metadata.json`. Retain `app.py` for legacy demonstration.
- **Status:** In Progress.

### E. Dataset Handling
- **Current State:** `insurance.csv` contains 1,338 records with 1 duplicate row. Data is cleaned with `drop_duplicates().reset_index(drop=True)`.
- **Severity:** Low
- **Evidence:** Confirmed no nulls; target `charges` ranges from $1,121.87 to $63,770.43.
- **Recommended Fix:** Standardize dataset path under `data/insurance.csv` while keeping a root reference if needed.
- **Status:** Verified.

### F. Saved Model (`model.pkl`)
- **Current State:** Persisted pipeline consists only of `StandardScaler` and `KNeighborsRegressor`. Categorical encoding is missing from the artifact.
- **Severity:** High
- **Evidence:**
  `Pipeline(steps=[('scaler', StandardScaler()), ('knn', KNeighborsRegressor(n_neighbors=9))])`
- **Recommended Fix:** Save complete pipeline including `ColumnTransformer` with `OneHotEncoder` and `StandardScaler`.
- **Status:** In Progress.

### G. Requirements & Environment
- **Current State:** `requirements.txt` contains unpinned loose dependencies (`scikit-learn>=1.3.0`, `pandas>=2.0.0`).
- **Severity:** Medium
- **Evidence:** Breaking changes across major versions of pandas/numpy/scikit-learn can compromise model deserialization.
- **Recommended Fix:** Provide tested, compatible dependency specifications for both backend and frontend.
- **Status:** In Progress.

### H. README Documentation
- **Current State:** Comprehensive academic explanation, but focused solely on the Streamlit workflow without API specifications or full-stack architectural diagrams.
- **Severity:** Medium
- **Evidence:** Lacks REST API reference, testing commands, and deployment guidance.
- **Recommended Fix:** Complete rewrite reflecting the full-stack architecture, ML improvements, and viva Q&A.
- **Status:** In Progress.

### I. Existing Bugs
- **Current State:**
  1. Manual one-hot encoding in `app.py` silences invalid/unrecognized categories without warnings or validation errors.
  2. Potential negative prediction boundary (addressed in `app.py` with `max(0.0, pred_cost)` but not guarded in pipeline).
- **Severity:** Medium
- **Evidence:** `app.py` line 266: `pred_cost = max(0.0, pred_cost)`.
- **Recommended Fix:** Enforce rigorous Pydantic input schemas and clip regression outputs at zero.
- **Status:** In Progress.

### J. Reproducibility Issues
- **Current State:** Because hyperparameter tuning was skipped in `train_and_save_model.py`, running the script relied on pre-selected values rather than proving optimality through code execution.
- **Severity:** High
- **Evidence:** Script did not run loop over parameter grids.
- **Recommended Fix:** Full automated CV grid evaluation logging to `model_metadata.json`.
- **Status:** In Progress.

### K. Security Concerns
- **Current State:** Streamlit app exposed raw Python errors upon unhandled exceptions. Arbitrary input sizes were not constrained.
- **Severity:** Medium
- **Evidence:** Lack of request size limits, CORS policies, or input schema boundary validation.
- **Recommended Fix:** FastAPI backend with Pydantic v2 strict boundaries, explicit CORS whitelist, error sanitization, and zero request-payload logging.
- **Status:** In Progress.

### L. Machine Learning Limitations
- **Current State:**
  - Dataset size is modest ($N=1,338$), collected from US insurance demographics.
  - Linear models exhibit heteroskedasticity and underpredict high-cost smoker claims.
  - KNN performance depends on Euclidean distance normalization across mixed feature types.
- **Severity:** Medium
- **Evidence:** Residuals increase significantly for charges $> \$30,000$.
- **Recommended Fix:** Add comprehensive Error Analysis broken down by smoker status, age brackets, and BMI categories.
- **Status:** In Progress.

### M. UI / UX Limitations
- **Current State:** Streamlit interface is rudimentary, lacks responsive mobile optimization, has no client-side interactive validation, and features hardcoded tables.
- **Severity:** Medium
- **Evidence:** Basic single-column/two-column Streamlit layout.
- **Recommended Fix:** Modern React + Tailwind CSS web application with micro-interactions, responsive grids, dynamic metrics charts, and clear accessibility.
- **Status:** In Progress.

### N. Deployment Limitations
- **Current State:** Streamlit requires a persistent stateful server process and does not decouple frontend from backend.
- **Severity:** Medium
- **Evidence:** Difficult to scale or integrate into modern microservice architectures.
- **Recommended Fix:** Decoupled FastAPI backend and static Vite frontend deployable independently (Docker, Render, Vercel).
- **Status:** In Progress.

---

## Specific Checklist Verification (1 – 14)

| # | Audit Checkpoint | Verified Finding | Severity | Resolution Strategy |
|---|---|---|---|---|
| 1 | **Training script consistent with notebook?** | **No.** Notebook tuned $\alpha$ and $k$ over grids; script hardcoded them. | High | Reintroduce automated CV grid search in script. |
| 2 | **Hyperparameter tuning actually performed?** | **No** in script, **Yes** in notebook. | High | Make script perform 5-fold CV grid search dynamically. |
| 3 | **Is selected model reproducible?** | **Partially.** Random seeds fixed (42), but pipeline missing OHE step. | High | Package end-to-end pipeline with seeds and save metadata. |
| 4 | **Train/test splits performed correctly?** | **Yes.** 80/20 split ($1069/268$) with fixed `random_state=42`. | Low | Maintain split methodology; preserve test set purely for evaluation. |
| 5 | **Is there any data leakage?** | **No scaling leakage** (StandardScaler in pipeline), but OHE was outside pipeline. | Medium | Move OneHotEncoder into ColumnTransformer within pipeline. |
| 6 | **Preprocessing identical in training & inference?** | **Architecturally divergent.** Script used `get_dummies`; app used manual `dict`. | High | Pipeline handles raw categorical strings directly. |
| 7 | **Model compatible with library versions?** | **Yes**, loads in sklearn 1.9.1, but dependencies need structured pinning. | Medium | Standardize and document environment dependencies. |
| 8 | **Reported metrics from actual evaluation?** | **Script/Notebook: Yes.** **App UI: No (hardcoded strings).** | High | UI fetches real metrics from `GET /api/v1/metadata`. |
| 9 | **Are model files loaded safely?** | **Partially.** `joblib.load()` without schema verification. | Medium | Safe startup loader with integrity checks and health endpoint. |
| 10 | **Are invalid user inputs handled?** | **Partially.** Only non-positive checks; upper bounds ignored. | High | Strict Pydantic v2 schemas + frontend validation. |
| 11 | **Feature names & data types consistent?** | **Divergent** between raw inputs and 8-dim dummy vector. | High | Raw feature inputs normalized by pipeline. |
| 12 | **Hardcoded metrics in application?** | **Yes.** Static DataFrame in `app.py`. | High | Replaced with dynamic JSON metadata. |
| 13 | **Missing automated tests?** | **Yes.** Zero test files in workspace. | High | Build comprehensive `pytest` suite for API and ML. |
| 14 | **Deployment issues?** | **Yes.** Monolithic Streamlit without API or CORS support. | Medium | Decoupled FastAPI + Vite architecture. |
