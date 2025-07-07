@echo off
echo Starting War3 UI Designer in development mode...

:: Use PowerShell with execution policy bypass to run npm script
powershell -ExecutionPolicy Bypass -Command "npm run dev"

pause