param (
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl
)

$ErrorActionPreference = "Stop"
$git = "C:\Users\Acer\.gemini\antigravity\scratch\mingit\cmd\git.exe"
Set-Location "C:\Users\Acer\.gemini\antigravity\scratch\fbc-jobele"

Write-Host "Configuring remote repository: $RepoUrl"

try {
    & $git remote remove origin 2>$null
} catch {}

& $git remote add origin $RepoUrl
& $git branch -M main

Write-Host "Pushing branch 'main' to GitHub..."
& $git push -u origin main

Write-Host "`nSuccessfully pushed to GitHub! You can now import this repository directly in Vercel."
