@echo off
echo Starting War3 UI Designer...

:: Set environment variables
set NODE_ENV=development

:: Start webpack server in a separate window
start cmd /c "powershell -ExecutionPolicy Bypass -Command "webpack serve --mode development --open""

:: Wait for webpack server to start
echo Waiting for webpack server to start...
timeout /t 10 /nobreak

:: Start Electron directly with development flag
echo Starting Electron in development mode...
node_modules\.bin\electron.cmd . --dev

pause