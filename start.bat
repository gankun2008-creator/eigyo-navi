@echo off
setlocal
cd /d "%~dp0"
set "PS_EXE=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
if not exist "%PS_EXE%" set "PS_EXE=pwsh.exe"
"%PS_EXE%" -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-docker.ps1"
set "START_EXIT=%ERRORLEVEL%"
if not "%START_EXIT%"=="0" (
  echo.
  echo Startup failed. Check startup.log.
  echo Exit code: %START_EXIT%
  pause
)
exit /b %START_EXIT%
