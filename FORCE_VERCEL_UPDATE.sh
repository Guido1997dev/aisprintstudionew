#!/bin/bash

# 🔥 Force Vercel Update Script
# Dit script forceert een complete nieuwe deploy op Vercel

echo "🔥 FORCE VERCEL UPDATE"
echo "======================"
echo ""

# Stap 1: Check git status
echo "📊 Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Er zijn uncommitted wijzigingen!"
    git status --short
    echo ""
    read -p "Wil je deze wijzigingen committen? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "💬 Commit message: " commit_message
        if [ -z "$commit_message" ]; then
            commit_message="Update: Force Vercel deployment with latest changes"
        fi
        git add .
        git commit -m "$commit_message"
        echo "✅ Changes committed"
    fi
else
    echo "✅ Working tree is clean"
fi

echo ""
echo "🚀 Forcing push to GitHub..."
git push origin main --force

echo ""
echo "📝 Creating empty commit to trigger Vercel rebuild..."
git commit --allow-empty -m "Trigger Vercel rebuild - $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

echo ""
echo "✅ DONE!"
echo ""
echo "📋 Volgende stappen:"
echo "1. Ga naar: https://vercel.com/guido1997devs-projects"
echo "2. Selecteer je project: aisprintstudionew"
echo "3. Klik op 'Deployments'"
echo "4. De nieuwe deployment zou nu moeten starten"
echo "5. Wacht tot de build klaar is (groen vinkje)"
echo ""
echo "💡 TIP: In Vercel kun je ook:"
echo "   - Op 'Settings' > 'General' > scroll naar 'Build & Development Settings'"
echo "   - Clear 'Build Cache' indien nodig"
echo ""









