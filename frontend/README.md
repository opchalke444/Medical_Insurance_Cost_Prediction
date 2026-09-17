# MedCost.AI — Frontend Web Application

A modern, responsive healthcare insurance cost prediction interface built with **React**, **Vite**, and **Tailwind CSS**.

---

## Features

- **Evidence-Based Cost Predictor:** Intuitive 2-column input controls for demographic and clinical indicators with presets for rapid viva demonstration.
- **Dynamic Benchmark Table:** Renders empirical model evaluation metrics directly from the FastAPI backend (`/api/v1/metadata`).
- **Subgroup Error Analysis:** Visualizes error disparities across smoking status, age groups, and BMI categories.
- **Viva Voce Presentation Guide:** Built-in interactive Q&A addressing core machine learning concepts (dummy variable trap, distance scaling, cross-validation).
- **Zero-Persistence Guarantee:** Full transparency that no user predictions or demographics are saved.

---

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Create `.env` or `.env.local` if custom backend URL is desired:
```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```
*(Defaults to `http://127.0.0.1:8000` automatically).*

### 3. Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
Generates production-optimized static assets in `dist/`.
