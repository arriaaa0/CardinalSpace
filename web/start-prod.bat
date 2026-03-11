@echo off
REM Cardinal Space - Production Startup Script for Windows

echo.
echo ========================================
echo  Cardinal Space Production Server
echo ========================================
echo.

REM Set environment variables
set NODE_ENV=production
set PORT=3000

echo Setting up environment:
echo   NODE_ENV: %NODE_ENV%
echo   PORT: %PORT%
echo.

REM Check if .next directory exists
if not exist ".next" (
    echo Building application...
    echo.
    call npm run build
    if errorlevel 1 (
        echo Build failed!
        exit /b 1
    )
)

echo.
echo ✓ Starting server on port %PORT%...
echo   Visit: http://localhost:%PORT%
echo.

REM Start the server
npm start
