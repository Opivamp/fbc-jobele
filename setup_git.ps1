$ErrorActionPreference = "Stop"
$mingitDir = "C:\Users\Acer\.gemini\antigravity\scratch\mingit"
$zipPath = "$env:TEMP\mingit.zip"

if (-not (Test-Path "$mingitDir\cmd\git.exe")) {
    Write-Host "Downloading MinGit..."
    New-Item -ItemType Directory -Force -Path $mingitDir | Out-Null
    $url = "https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/MinGit-2.44.0-64-bit.zip"
    Invoke-WebRequest -Uri $url -OutFile $zipPath
    Write-Host "Extracting MinGit to $mingitDir..."
    Expand-Archive -Path $zipPath -DestinationPath $mingitDir -Force
    Remove-Item -Path $zipPath -Force
}

$gitExe = "$mingitDir\cmd\git.exe"
Write-Host "Git available at: $gitExe"
& $gitExe --version

# Initialize git repository
Set-Location "C:\Users\Acer\.gemini\antigravity\scratch\fbc-jobele"
if (-not (Test-Path ".git")) {
    & $gitExe init
    & $gitExe config user.name "First Baptist Church Jobele"
    & $gitExe config user.email "admin@fbcjobele.org"
    & $gitExe branch -M main
    & $gitExe add .
    & $gitExe commit -m "feat: complete production church web app and CMS for FBC Jobele"
    Write-Host "Git repository initialized and initial commit created successfully!"
} else {
    & $gitExe add .
    & $gitExe commit -m "feat: responsiveness, live countdown, cloud storage, and admin registration"
    Write-Host "Git repository updated with latest changes!"
}

& $gitExe status
