#!/bin/bash

# 🚀 AI Sprint Studio - Quick Deploy Script
# Voer uit met: bash QUICK_DEPLOY.sh

echo "🚀 AI Sprint Studio - GitHub Deploy"
echo "===================================="
echo ""

# Stap 1: Check of we in de juiste directory zitten
if [ ! -f "package.json" ]; then
    echo "❌ Fout: Niet in de juiste directory!"
    echo "   Ga eerst naar: cd '/Users/guidocroon/AI sprint studio shadcn'"
    exit 1
fi

# Stap 2: Check of git geïnitialiseerd is
if [ ! -d ".git" ]; then
    echo "❌ Fout: Git is nog niet geïnitialiseerd!"
    echo "   Voer eerst uit: git init"
    exit 1
fi

# Stap 3: Check of er remote bestaat
if git remote | grep -q "origin"; then
    echo "✅ Remote 'origin' bestaat al"
else
    echo "📡 Remote toevoegen..."
    git remote add origin https://github.com/Guido1997dev/aisprintstudionew.git
    echo "✅ Remote toegevoegd"
fi

echo ""
echo "📝 Status van je wijzigingen:"
git status --short

echo ""
read -p "🤔 Wil je deze wijzigingen committen en pushen? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    read -p "💬 Commit message: " commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Update AI Sprint Studio website"
    fi
    
    echo ""
    echo "📦 Wijzigingen toevoegen..."
    git add .
    
    echo "💾 Commit maken..."
    git commit -m "$commit_message"
    
    echo "🚀 Pushen naar GitHub..."
    git branch -M main
    git push -u origin main
    
    echo ""
    echo "✅ Gelukt! Je code staat nu op GitHub!"
    echo "🌐 Bekijk op: https://github.com/Guido1997dev/aisprintstudionew"
else
    echo "❌ Deploy geannuleerd"
fi

