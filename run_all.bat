@echo off
TITLE MedCost.AI Full-Stack Launcher
cd /d "%~dp0"

echo ========================================================
echo         Launching MedCost.AI Full-Stack Application
echo ========================================================
echo.

echo [1/3] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "MedCost.AI - Backend (FastAPI)" cmd /k "cd /d "%~dp0" & python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000"

timeout /t 2 /nobreak >nul

echo [2/3] Starting React + Vite Frontend on http://localhost:5173 ...
start "MedCost.AI - Frontend (Vite)" cmd /k "cd /d "%~dp0frontend" & npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ========================================================
echo Both servers are active!
echo  * Frontend Web UI: http://localhost:5173
echo  * Backend API:     http://127.0.0.1:8000
echo  * Swagger Docs:    http://127.0.0.1:8000/docs
echo.
echo Keep the opened command windows running while using the app.
echo ========================================================
