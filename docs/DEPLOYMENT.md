# Deployment & Operations Guide

Guide for deploying the full-stack **MedCost.AI** application to local, containerized, and cloud environments.

---

## 1. Environment Variables Configuration

### Backend (`.env` or Server Environment)
| Variable | Default Value | Description |
|---|---|---|
| `MODEL_PATH` | `backend/models/model.pkl` | Path to serialized scikit-learn Pipeline artifact |
| `METADATA_PATH` | `backend/models/model_metadata.json` | Path to training metrics JSON |
| `CORS_ORIGINS` | `http://localhost:5173,...` | Whitelist of permitted client domains |

### Frontend (`frontend/.env` or Vercel Environment)
| Variable | Default Value | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000` | Base URL of deployed FastAPI backend |

---

## 2. Local Production Build & Run

### Step 1: Run ML Pipeline & Retrain (If Needed)
```bash
python train_and_save_model.py
```

### Step 2: Start FastAPI Backend
```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --workers 2
```

### Step 3: Build & Serve Frontend
```bash
cd frontend
npm install
npm run build
npm run preview -- --port 5173
```

---

## 3. Docker Containerization (Recommended for Cloud)

### Backend `Dockerfile` (Example)
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ backend/

EXPOSE 8000
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 4. Vercel Cloud Deployment

The repository includes direct configuration for Vercel CLI and Git integration:
- `pyproject.toml`: Configures `[tool.vercel] entrypoint = "backend.app.main:app"` and frontend build script.
- `api/index.py`: Serverless fallback entrypoint.
- `frontend/dist/`: Static assets built and mounted automatically by FastAPI.

### To Deploy on Vercel:
1. Commit and push all changes to your GitHub branch (`main`).
2. In your Vercel Dashboard, import the repository with default settings.
3. Vercel automatically detects the FastAPI configuration and builds both the React frontend and FastAPI backend.

---

## 5. Common Deployment Pitfalls & Resolutions

1. **Model File Not Found (`503 Service Unavailable`):**
   - *Cause:* Model was not trained or relative path was broken in container.
   - *Fix:* Ensure `train_and_save_model.py` is executed before starting backend or set `MODEL_PATH` explicitly.
2. **CORS Errors in Browser:**
   - *Cause:* Client origin not listed in backend CORS whitelist.
   - *Fix:* Verify backend middleware allows client domain or set `allow_origins=["*"]` during preview.
3. **Pydantic Validation 422 on Valid Numbers:**
   - *Cause:* Form sending string numbers instead of floats/ints.
   - *Fix:* Handled automatically by `api.js` and frontend form casting (`parseInt`, `parseFloat`).
