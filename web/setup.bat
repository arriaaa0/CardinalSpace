@echo off
echo 🚀 CardinalSpace Database Setup
echo ================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npx prisma generate

REM Create database
echo 🗄️ Creating database schema...
npx prisma db push

REM Seed initial data
echo 🌱 Seeding initial data...
curl -X POST http://localhost:3000/api/seed >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Could not seed data automatically. Please run:
    echo    npm run dev
    echo    Then: curl -X POST http://localhost:3000/api/seed
)

echo.
echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo    1. Start development server: npm run dev
echo    2. Open: http://localhost:3000
echo    3. Login with: admin@example.com / CardinalAdmin2024!
echo.
echo 📚 For detailed setup, see: DATABASE_SETUP.md
pause
