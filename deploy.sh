#!/bin/bash

# Family Photo App Deployment Script
# This script helps deploy your app to various platforms

echo "🚀 Family Photo App Deployment Helper"
echo "======================================"

# Check if Git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Family Photo Sharing App"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository found"
fi

# Check environment files
echo ""
echo "🔧 Checking environment configuration..."

if [ ! -f ".env.production" ]; then
    echo "❌ .env.production not found"
    echo "Please copy .env.example to .env.production and configure your production variables"
    exit 1
else
    echo "✅ Production environment file found"
fi

if [ ! -f "client/.env.production" ]; then
    echo "❌ client/.env.production not found"
    echo "Please create client/.env.production with your backend URL"
    exit 1
else
    echo "✅ Client production environment file found"
fi

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo "Before deploying, make sure you have:"
echo ""
echo "☐ MongoDB Atlas cluster created and connection string ready"
echo "☐ Cloudinary account set up with API credentials"
echo "☐ GitHub repository created and code pushed"
echo "☐ Railway/Render account for backend deployment"
echo "☐ Vercel account for frontend deployment"
echo ""
echo "Environment Variables Needed:"
echo "-----------------------------"
echo "Backend (.env.production):"
echo "- MONGODB_URI"
echo "- JWT_SECRET"
echo "- CLOUDINARY_CLOUD_NAME"
echo "- CLOUDINARY_API_KEY"
echo "- CLOUDINARY_API_SECRET"
echo "- CLIENT_URL"
echo ""
echo "Frontend (client/.env.production):"
echo "- REACT_APP_API_URL"
echo ""
echo "🌐 Deployment Steps:"
echo "===================="
echo "1. Deploy Backend:"
echo "   - Railway: Connect GitHub repo, set env vars, deploy"
echo "   - Render: Connect GitHub repo, set env vars, deploy"
echo ""
echo "2. Deploy Frontend:"
echo "   - Update client/.env.production with backend URL"
echo "   - Vercel: Connect GitHub repo, set root to 'client', deploy"
echo ""
echo "3. Test Deployment:"
echo "   - Visit backend /api/health endpoint"
echo "   - Test frontend functionality"
echo "   - Create test user and upload photo"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo "🎉 Your family photo sharing app will be live soon!"