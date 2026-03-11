#!/bin/bash

# Cardinal Space - Production Startup Script

set -e

echo "🚀 Starting Cardinal Space Production Server..."
echo ""

# Check if .next directory exists and is up to date
if [ ! -d ".next" ]; then
    echo "📦 .next directory not found. Running build..."
    npm run build
fi

# Set production environment
export NODE_ENV=production
export PORT=${PORT:-3000}

echo "✅ Build verified"
echo "📍 Server will run on port $PORT"
echo ""

# Start the server
exec npm start
