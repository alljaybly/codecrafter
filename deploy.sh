#!/bin/bash

echo "🚀 CodeCrafter Deployment Script"
echo "================================="

# Check if required tools are installed
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Dependencies installed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Set up Supabase database (see deployment-checklist.md)"
echo "2. Configure environment variables"
echo "3. Deploy backend to Railway"
echo "4. Deploy frontend to Netlify"
echo ""
echo "📖 See deployment-checklist.md for detailed instructions"