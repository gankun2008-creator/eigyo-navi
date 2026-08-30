$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)
$logPath = Join-Path (Get-Location) 'startup.log'
try { Start-Transcript -Path $logPath -Append | Out-Null } catch {}

function Wait-BeforeExit([string]$message) {
  Write-Host $message -ForegroundColor Red
  Write-Host "Detailed log: $logPath" -ForegroundColor Yellow
  Read-Host 'This window will stay open. Press Enter to close'
}

function Test-DockerReady {
  docker info *> $null
  return $LASTEXITCODE -eq 0
}

Write-Host 'Checking Eigyo Navi AI startup requirements...' -ForegroundColor Cyan

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  $dockerCliCandidates = @(
    "$env:ProgramFiles\Docker\Docker\resources\bin\docker.exe",
    "$env:LOCALAPPDATA\Programs\Docker\Docker\resources\bin\docker.exe"
  )
  $dockerCli = $dockerCliCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
  if ($dockerCli) {
    $env:Path = "$(Split-Path -Parent $dockerCli);$env:Path"
    Write-Host "Docker CLI found: $dockerCli" -ForegroundColor Green
  }
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Host 'Docker Desktop is not installed.' -ForegroundColor Yellow
  Write-Host 'Opening the Docker Desktop download page.'
  Start-Process 'https://www.docker.com/products/docker-desktop/'
  Wait-BeforeExit 'Install Docker Desktop, restart Windows, and run start.bat again.'
  exit 1
}

if (-not (Test-DockerReady)) {
  $dockerDesktopPaths = @(
    "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe",
    "$env:LOCALAPPDATA\Programs\Docker\Docker\Docker Desktop.exe"
  )
  $dockerDesktop = $dockerDesktopPaths | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
  if ($dockerDesktop) {
    Write-Host 'Starting Docker Desktop...' -ForegroundColor Yellow
    Start-Process -FilePath $dockerDesktop
  }

  $ready = $false
  for ($attempt = 1; $attempt -le 60; $attempt++) {
    Start-Sleep -Seconds 3
    if (Test-DockerReady) { $ready = $true; break }
    Write-Progress -Activity 'Waiting for Docker Desktop' -Status "$attempt / 60" -PercentComplete (($attempt / 60) * 100)
  }
  Write-Progress -Activity 'Waiting for Docker Desktop' -Completed
  if (-not $ready) {
    Wait-BeforeExit 'Docker Desktop did not become ready. Start it manually and try again.'
    exit 1
  }
}

Write-Host 'Starting the app. The first Ollama and model download can take several minutes.' -ForegroundColor Cyan
docker compose up -d --build
if ($LASTEXITCODE -ne 0) {
  Write-Host 'Docker Compose failed. Recent logs:' -ForegroundColor Red
  docker compose logs --tail 80
  Wait-BeforeExit 'Docker Compose returned an error.'
  exit 1
}

Write-Host ''
Write-Host 'Eigyo Navi AI started: http://localhost:3000' -ForegroundColor Green
docker compose ps
Start-Process 'http://localhost:3000'
Read-Host 'The app keeps running after this window closes. Press Enter to close'
try { Stop-Transcript | Out-Null } catch {}
