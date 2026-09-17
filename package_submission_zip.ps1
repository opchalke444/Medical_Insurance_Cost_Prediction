# Script to create a clean academic submission ZIP archive
# Excludes .git, __pycache__, node_modules, and cache files

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$zipName = "MedCost_AI_Academic_Project_Submission.zip"
$zipPath = Join-Path -Path (Split-Path -Parent $projectRoot) -ChildPath $zipName

Write-Host "Creating clean academic submission ZIP..." -ForegroundColor Cyan
Write-Host "Project Source: $projectRoot"
Write-Host "Destination:    $zipPath"

# Remove old submission zip if it exists
if (Test-Path $zipPath) {
    Remove-Item -Force $zipPath
}

# Clean any existing pycache / swap files first
Get-ChildItem -Path $projectRoot -Filter "__pycache__" -Recurse -Directory -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
Get-ChildItem -Path $projectRoot -Include *.pyc,*.swp -Recurse -Force | Remove-Item -Force -ErrorAction SilentlyContinue

# Files & Directories to include
$itemsToInclude = @(
    "api",
    "backend",
    "data",
    "docs",
    "frontend",
    "notebooks",
    "tests",
    "package.json",
    "pyproject.toml",
    "pytest.ini",
    "README.md",
    "requirements.txt",
    "run_all.bat",
    "run_all.ps1",
    "train_and_save_model.py",
    "vercel.json"
)

# Temporary staging directory
$tempStaging = Join-Path -Path $env:TEMP -ChildPath ([System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempStaging | Out-Null

try {
    foreach ($item in $itemsToInclude) {
        $sourcePath = Join-Path -Path $projectRoot -ChildPath $item
        if (Test-Path $sourcePath) {
            $destPath = Join-Path -Path $tempStaging -ChildPath $item
            if (Test-Path $sourcePath -PathType Container) {
                # Copy directory excluding node_modules and .git
                Copy-Item -Path $sourcePath -Destination $destPath -Recurse -Force
                # Remove node_modules or pycache if copied
                if (Test-Path (Join-Path $destPath "node_modules")) {
                    Remove-Item -Recurse -Force (Join-Path $destPath "node_modules")
                }
                Get-ChildItem -Path $destPath -Filter "__pycache__" -Recurse -Directory -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
            } else {
                Copy-Item -Path $sourcePath -Destination $destPath -Force
            }
        }
    }

    # Compress into clean ZIP
    Compress-Archive -Path "$tempStaging\*" -DestinationPath $zipPath -CompressionLevel Optimal
    Write-Host "Submission ZIP created successfully!" -ForegroundColor Green
    Write-Host "Clean ZIP located at: $zipPath" -ForegroundColor Yellow
} finally {
    Remove-Item -Recurse -Force $tempStaging -ErrorAction SilentlyContinue
}
