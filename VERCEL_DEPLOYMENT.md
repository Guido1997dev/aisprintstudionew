# 🚀 Vercel Deployment Guide - AI Sprint Studio

## ⚠️ Belangrijke Waarschuwing

De melding die je ziet is **GEEN ERROR!** Het is gewoon informatie tijdens de build. 
De build zal waarschijnlijk wel succesvol zijn, MAAR je n8n dashboard zal niet werken omdat de environment variables ontbreken.

## 🔑 Probleem: Environment Variables

Je `.env.local` file is (correct!) NIET mee gepusht naar GitHub.
Dat betekent dat Vercel je n8n API configuratie niet heeft!

## ✅ Oplossing: Environment Variables Toevoegen in Vercel

### Stap 1: Ga Naar Je Project in Vercel

1. Open: https://vercel.com/dashboard
2. Klik op je project: **aisprintstudionew**
3. Ga naar **Settings** (bovenaan)
4. Klik op **Environment Variables** (in sidebar)

### Stap 2: Voeg Deze Variables Toe

Klik "Add New" en voeg één voor één toe:

#### Variable 1
```
Name:  N8N_API_URL
Value: https://guidocroon.com/n8n
```

#### Variable 2
```
Name:  N8N_API_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYmU1NzhlMC1hODgzLTQyYWMtYmM1NC0yNWQ2Y2E0NzY0MjMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUyMTMyMDc3LCJleHAiOjE3NTk4OTYwMDB9.-ssql39foEdVRJ1_AdHxcBfODUX4VkJLEQgOwV4C9_o
```

#### Variable 3
```
Name:  NEXT_PUBLIC_N8N_API_URL
Value: https://guidocroon.com/n8n
```

#### Variable 4
```
Name:  NEXT_PUBLIC_N8N_API_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYmU1NzhlMC1hODgzLTQyYWMtYmM1NC0yNWQ2Y2E0NzY0MjMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUyMTMyMDc3LCJleHAiOjE3NTk4OTYwMDB9.-ssql39foEdVRJ1_AdHxcBfODUX4VkJLEQgOwV4C9_o
```

**Belangrijk:** Selecteer voor ALLE variabelen:
- ✅ Production
- ✅ Preview
- ✅ Development

### Stap 3: Redeploy

Na het toevoegen van de environment variables:

1. Ga naar **Deployments** tab
2. Klik op de **3 dots** bij de laatste deployment
3. Klik **Redeploy**
4. Wacht tot build klaar is (~2 min)

## 🎯 Complete Vercel Setup Guide

### Eerste Keer Deployen

#### 1. Push Code Naar GitHub (Al Gedaan!)
```bash
git push
```

#### 2. Import in Vercel

1. Ga naar: https://vercel.com/new
2. Import je repository: **Guido1997dev/aisprintstudionew**
3. **Belangrijk:** Klik op **Environment Variables**
4. Voeg alle 4 variables toe (zie hierboven)
5. Klik **Deploy**

#### 3. Wacht Op Build

De build neemt 2-3 minuten. Je ziet:
```
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

#### 4. Test Je Website

1. Klik op de **Visit** button
2. Test de homepage
3. **Belangrijk:** Test het dashboard → n8n data moet laden!

## 🔍 Troubleshooting

### "Build Failed"

**Check deze dingen:**

1. **Environment Variables Ingesteld?**
   - Settings → Environment Variables
   - Alle 4 variables aanwezig?
   - Production + Preview + Development aangevinkt?

2. **Build Logs Bekijken**
   - Deployments → Klik op deployment
   - Scroll naar errors
   - Vaak staat hier exact wat mis is

### "Website Laadt Maar n8n Data Niet"

**Oplossing:**
```
1. Settings → Environment Variables
2. Check of NEXT_PUBLIC_ variabelen er staan
3. Redeploy (kan even duren)
```

### "404 Error Op Dashboard"

**Check:**
- Is de build succesvol?
- Ga naar Vercel dashboard → Functions
- Zie je alle routes?

## 📋 Environment Variables Checklist

Kopieer deze lijst en vink af:

```
□ N8N_API_URL = https://guidocroon.com/n8n
□ N8N_API_KEY = eyJhbGc... (je API key)
□ NEXT_PUBLIC_N8N_API_URL = https://guidocroon.com/n8n
□ NEXT_PUBLIC_N8N_API_KEY = eyJhbGc... (je API key)

Voor alle variables:
□ Production aangevinkt
□ Preview aangevinkt
□ Development aangevinkt
```

## 🎨 Custom Domain (Optioneel)

Wil je een eigen domein? Bijv: `aisprintstudio.nl`

### Stap 1: Koop Domein
- Koop bij: Vercel, TransIP, of andere registrar

### Stap 2: Voeg Toe in Vercel
1. Project Settings → Domains
2. Klik **Add Domain**
3. Type je domein: `aisprintstudio.nl`
4. Volg de DNS instructies

### Stap 3: Wacht Op Propagatie
- DNS updates nemen 1-24 uur
- Vercel geeft gratis SSL certificaat

## 🔄 Automatische Deployments

**Goed nieuws:** Dit is al geconfigureerd!

Elke keer dat je pusht naar GitHub:
```bash
git add .
git commit -m "Updates"
git push
```

Vercel deployed automatisch! 🎉

### Deployment Triggers

✅ **Automatisch deployed:**
- Push naar `main` branch → Production
- Push naar andere branch → Preview

❌ **Niet deployed:**
- Local changes (nog niet gepusht)
- Commits in draft

## 🌍 Preview Deployments

Handig voor testen!

```bash
# Maak test branch
git checkout -b test/nieuwe-feature

# Push naar GitHub
git push -u origin test/nieuwe-feature
```

Vercel maakt automatisch een preview URL:
```
https://aisprintstudionew-abc123.vercel.app
```

Test daar, en als het werkt:
```bash
git checkout main
git merge test/nieuwe-feature
git push  # → Deployed naar productie!
```

## 📊 Monitoring

### Analytics (Gratis in Vercel)

1. Project → Analytics
2. Zie:
   - Bezoekers
   - Page views
   - Performance

### Error Tracking

1. Project → Deployments → Latest
2. Klik **Functions**
3. Zie errors in real-time

## 💡 Pro Tips

### 1. **Preview Before Merge**

```bash
# Maak feature branch
git checkout -b feature/nieuwe-widget

# Push naar GitHub
git push -u origin feature/nieuwe-widget

# Vercel geeft preview URL
# Test daar eerst!

# Als het werkt:
git checkout main
git merge feature/nieuwe-widget
git push  # Live!
```

### 2. **Environment Per Branch**

In Vercel kun je verschillende env vars hebben voor:
- Production (main branch)
- Preview (andere branches)
- Development (local)

Handig voor test API keys!

### 3. **Build Optimalisatie**

In `vercel.json` (root directory):
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

## 🚨 Security Check

### ✅ Wat IS Safe

- Environment variables in Vercel
- API keys in Vercel dashboard
- `.env.local` in `.gitignore`

### ❌ Wat NIET Safe Is

- API keys in code committen
- `.env.local` pushen naar GitHub
- Secrets in public repository

## 📱 Vercel App

Download de Vercel app voor:
- Push notifications bij deployment
- Quick access naar logs
- Mobile-friendly dashboard

## 🎯 Checklist: Is Mijn Deployment Goed?

```
Website:
□ Homepage laadt
□ About pagina laadt
□ Portfolio pagina laadt
□ Dashboard laadt

Functionaliteit:
□ n8n workflows worden getoond
□ Statistics worden getoond
□ Webhook trigger werkt
□ Dark/light mode werkt

Performance:
□ Pagina's laden snel (<3 sec)
□ Geen console errors
□ Images laden correct
```

## 🆘 Als Het Echt Niet Lukt

### Optie 1: Vercel Support
- https://vercel.com/help
- Vaak snelle response

### Optie 2: Redeploy From Scratch
```
1. Vercel dashboard → Project Settings
2. Scroll naar beneden
3. "Delete Project"
4. Import opnieuw met correcte env vars
```

### Optie 3: Check Build Logs
```
1. Deployments → Latest
2. Bekijk hele build log
3. Zoek naar "Error" of "Failed"
4. Google de error message
```

## ✅ Success!

Als alles werkt zie je:

1. **Homepage**: Modern SaaS landing page ✨
2. **Dashboard**: n8n workflows en stats 📊
3. **About**: Team info en Happy Sprint Machine 👥
4. **Portfolio**: Project showcase 💼

**Live URL**: https://aisprintstudionew.vercel.app
(Of je custom domain!)

## 🎉 Je Website Is Live!

Gefeliciteerd! Je AI Sprint Studio website staat nu online! 🚀

**Deel de URL:**
- Klanten
- Portfolio
- LinkedIn
- Waar je maar wilt!

---

## 📞 Quick Reference

**Vercel Dashboard**: https://vercel.com/dashboard  
**Add Env Vars**: Settings → Environment Variables  
**View Logs**: Deployments → Latest → View Function Logs  
**Custom Domain**: Settings → Domains  

**Problemen?** Check altijd eerst de environment variables! 🔑

