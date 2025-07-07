@echo off
echo Starting War3 UI Designer with direct Electron...

:: Set environment variables
set NODE_ENV=development

:: Start webpack server
start powershell -ExecutionPolicy Bypass -Command "npm run start-react"

:: Wait for webpack server to start
echo Waiting for webpack server to start...
timeout /t 10 /nobreak

:: Start Electron directly with development flag
echo Starting Electron in development mode...
.\node_modules\.bin\electron.cmd . --dev

pause