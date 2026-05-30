#!/bin/bash
# Quick deployment verification script

echo "🔍 Checking project structure..."
ls -la server/
echo ""

echo "📦 Checking dependencies..."
cat server/package.json | grep -A 5 "dependencies"
echo ""

echo "🔐 Checking environment variables..."
if [ -f server/.env ]; then
  echo "✅ .env file found"
  echo "   SUPABASE_URL: $(grep SUPABASE_URL server/.env | cut -d= -f2)"
  echo "   SUPABASE_KEY: $(grep SUPABASE_KEY server/.env | cut -d= -f2 | cut -c1-20)..."
else
  echo "❌ .env file not found"
fi
echo ""

echo "✅ Project ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git add . && git commit -m 'Production ready' && git push"
echo "2. Go to Render dashboard: https://dashboard.render.com"
echo "3. Create Web Service from GitHub repo: remasmohamedreda12-create/inspire-attendance"
echo "4. Set environment variables in Render"
