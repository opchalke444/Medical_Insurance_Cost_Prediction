# MedCost.AI Full-Stack Application Launcher for PowerShell
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       Launching MedCost.AI Full-Stack Application      " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir'; python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000"

Write-Host "[2/2] Launching React + Vite Frontend on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\frontend'; npm run dev"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Both servers have been launched in separate windows!" -ForegroundColor Green
Write-Host " - Frontend UI:    http://localhost:5173" -ForegroundColor Yellow
Write-Host " - Backend API:   http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host " - Swagger Docs:  http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
