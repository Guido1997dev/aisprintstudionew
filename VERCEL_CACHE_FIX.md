# 🔧 Vercel Deploy Probleem Oplossen

## Probleem
Je pusht naar GitHub maar Vercel toont nog steeds de oude website.

## Oorzaak
Vercel gebruikt een build cache en pakt soms de oude versie, zelfs na een nieuwe push.

## ✅ Oplossing 1: Force Update Script (MAKKELIJKST)

Run dit script:
```bash
./FORCE_VERCEL_UPDATE.sh
```

Dit script:
1. ✅ Check of er uncommitted changes zijn
2. ✅ Pusht alles naar GitHub
3. ✅ Maakt een empty commit om Vercel te triggeren
4. ✅ Forceert een nieuwe deployment

## ✅ Oplossing 2: Handmatig Vercel Cache Clearen

### Stap 1: Ga naar Vercel Dashboard
https://vercel.com/guido1997devs-projects

### Stap 2: Selecteer je project
Klik op: **aisprintstudionew**

### Stap 3: Clear Build Cache
1. Ga naar **Settings** (links in menu)
2. Scroll naar **Build & Development Settings**
3. Klik op **Clear Build Cache**
4. Confirm

### Stap 4: Redeploy
1. Ga naar **Deployments** tab
2. Klik op de laatste deployment
3. Klik op de **⋮** (drie puntjes) rechtsboven
4. Klik op **Redeploy**
5. Selecteer **Use existing Build Cache** = **OFF** (belangrijk!)
6. Klik **Redeploy**

## ✅ Oplossing 3: Vercel CLI Gebruiken

Install Vercel CLI:
```bash
npm i -g vercel
```

Login en redeploy:
```bash
vercel login
vercel --prod --force
```

## 🔍 Check of je wijzigingen op GitHub staan

```bash
# Check laatste commits
git log --oneline -5

# Check remote
git remote -v

# Check branch
git branch -a

# Push laatste wijzigingen
git push origin main
```

## 📋 Vercel Settings Checken

Ga naar Vercel → Settings → General:

### Build & Development Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (of leeg laten)
- **Output Directory**: `.next` (of leeg laten)
- **Install Command**: `npm install` (of leeg laten)

### Root Directory
- Moet leeg zijn (tenzij je project in een subfolder zit)

### Node.js Version
- Gebruik Node.js 18.x of 20.x

### Environment Variables
Check of je alle benodigde environment variables hebt ingesteld:
- `N8N_API_KEY` (indien van toepassing)
- `N8N_BASE_URL` (indien van toepassing)

## 🚨 Veelvoorkomende Problemen

### 1. Vercel kijkt naar verkeerde branch
**Fix:**
- Ga naar Settings → Git
- Check of **Production Branch** = `main`

### 2. Vercel gebruikt oude commit
**Fix:**
```bash
# Force een nieuwe commit
git commit --allow-empty -m "Trigger rebuild"
git push origin main
```

### 3. Build errors op Vercel
**Check:**
- Ga naar Deployments → klik op failed deployment
- Check de build logs voor errors
- Fix de errors en push opnieuw

### 4. Cache issues
**Fix:**
```bash
# Lokaal
rm -rf .next
npm run build

# Test lokaal of het werkt
npm run dev

# Dan push
git add .
git commit -m "Fix build issues"
git push origin main
```

## 📊 Deployment Checklist

Na elke push naar GitHub:

1. ✅ Check GitHub: is de commit zichtbaar?
   - https://github.com/Guido1997dev/aisprintstudionew/commits/main

2. ✅ Check Vercel: start een nieuwe deployment?
   - https://vercel.com/guido1997devs-projects/aisprintstudionew/deployments

3. ✅ Wacht op groene build
   - Klik op de deployment om logs te zien

4. ✅ Test de live URL
   - Klik op "Visit" of ga naar je production URL

5. ✅ Hard refresh in browser
   - **Cmd+Shift+R** (Mac) of **Ctrl+Shift+R** (Windows)

## 🎯 Snelle Fix (TL;DR)

```bash
# 1. Force push + trigger rebuild
./FORCE_VERCEL_UPDATE.sh

# 2. Check Vercel dashboard voor nieuwe deployment
# https://vercel.com/guido1997devs-projects

# 3. Clear browser cache (Cmd+Shift+R)

# 4. Test je website
```

## 💡 Pro Tip

Voeg deze line toe aan je commit message om Vercel te forceren:
```bash
git commit -m "Update: login system [vercel-rebuild]"
```

Of gebruik een empty commit:
```bash
git commit --allow-empty -m "Force Vercel rebuild"
git push origin main
```

## 📞 Nog steeds problemen?

Check deze dingen:
1. ✅ Build succesvol lokaal? (`npm run build`)
2. ✅ Alle bestanden gecommit? (`git status`)
3. ✅ Gepusht naar GitHub? (`git log origin/main`)
4. ✅ Vercel connected met juiste repo?
5. ✅ Build logs op Vercel geen errors?
6. ✅ Browser cache gecleared? (Cmd+Shift+R)

Als alles klopt maar het werkt nog niet:
- Clear Vercel build cache (Settings → Clear Build Cache)
- Disconnect en reconnect GitHub integration in Vercel
- Contact Vercel support









