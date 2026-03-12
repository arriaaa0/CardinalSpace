#!/bin/bash

echo "🚀 CardinalSpace Database Setup"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Create database
echo "🗄️ Creating database schema..."
npx prisma db push

# Seed initial data
echo "🌱 Seeding initial data..."
curl -X POST http://localhost:3000/api/seed 2>/dev/null || {
    echo "⚠️  Could not seed data automatically. Please run:"
    echo "   npm run dev"
    echo "   Then: curl -X POST http://localhost:3000/api/seed"
}

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Start development server: npm run dev"
echo "   2. Open: http://localhost:3000"
echo "   3. Login with: admin@example.com / CardinalAdmin2024!"
echo ""
echo "📚 For detailed setup, see: DATABASE_SETUP.md"
