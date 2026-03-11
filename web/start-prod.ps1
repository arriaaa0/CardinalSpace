# Cardinal Space - Production Startup Script for PowerShell

Write-Host ""
Write-Host "========================================"
Write-Host "  Cardinal Space Production Server"
Write-Host "========================================"
Write-Host ""

# Set environment variables
$env:NODE_ENV = "production"
$env:PORT = "3000"

Write-Host "Setting up environment:"
Write-Host "  NODE_ENV: $($env:NODE_ENV)"
Write-Host "  PORT: $($env:PORT)"
Write-Host ""

# Check if .next directory exists
if (-not (Test-Path ".next")) {
    Write-Host "Building application..."
    Write-Host ""
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!"
        exit 1
    }
}

Write-Host ""
Write-Host "Starting server on port $($env:PORT)..."
Write-Host "  Visit: http://localhost:$($env:PORT)"
Write-Host ""

# Start the server
npm start
