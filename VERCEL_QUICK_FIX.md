# ⚡ Vercel Quick Fix - Environment Variables

## 🎯 Je Probleem

De build message die je ziet is **GEEN ERROR!**

De build zal waarschijnlijk succesvol zijn, MAAR je dashboard werkt niet omdat:
👉 **Je n8n API keys ontbreken in Vercel!**

## ✅ Snelle Oplossing (5 minuten)

### Stap 1: Open Vercel Project Settings

1. Ga naar: **https://vercel.com/dashboard**
2. Klik op: **aisprintstudionew**
3. Klik op: **Settings** (bovenaan)
4. Klik op: **Environment Variables** (sidebar links)

### Stap 2: Voeg Deze 4 Variables Toe

Klik **"Add New"** en voeg één voor één toe:

#### Variable 1 ⭐
```
Name:  N8N_API_URL
Value: https://guidocroon.com/n8n
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Variable 2 ⭐
```
Name:  N8N_API_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYmU1NzhlMC1hODgzLTQyYWMtYmM1NC0yNWQ2Y2E0NzY0MjMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUyMTMyMDc3LCJleHAiOjE3NTk4OTYwMDB9.-ssql39foEdVRJ1_AdHxcBfODUX4VkJLEQgOwV4C9_o
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Variable 3 ⭐
```
Name:  NEXT_PUBLIC_N8N_API_URL
Value: https://guidocroon.com/n8n
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Variable 4 ⭐
```
Name:  NEXT_PUBLIC_N8N_API_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYmU1NzhlMC1hODgzLTQyYWMtYmM1NC0yNWQ2Y2E0NzY0MjMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUyMTMyMDc3LCJleHAiOjE3NTk4OTYwMDB9.-ssql39foEdVRJ1_AdHxcBfODUX4VkJLEQgOwV4C9_o
Environments: ✅ Production ✅ Preview ✅ Development
```

### Stap 3: Redeploy

1. Ga naar **Deployments** tab (bovenaan)
2. Klik op de **3 dots (⋮)** bij de laatste deployment
3. Klik **Redeploy**
4. Wacht 2-3 minuten

### Stap 4: Test!

1. Open je Vercel URL
2. Ga naar `/dashboard`
3. Check of je n8n workflows zichtbaar zijn ✅

## 🎯 Waarom Dit Nodig Is?

```
Lokaal (je computer):
├─ .env.local ✅ (heeft n8n keys)
└─ Dashboard werkt! ✅

GitHub:
├─ .env.local ❌ (wordt NIET gepusht - dat is goed!)
└─ Alleen code

Vercel:
├─ Code van GitHub ✅
├─ Environment Variables ❌ (moet je toevoegen!)
└─ Dashboard werkt alleen na variables toevoegen ✅
```

## ✅ Success Checklist

```
□ Alle 4 environment variables toegevoegd
□ Alle 3 environments aangevinkt (Prod, Preview, Dev)
□ Redeploy uitgevoerd
□ Website laadt
□ Dashboard toont n8n workflows
```

## 🎉 Klaar!

Als alles goed is gegaan:
- ✅ Homepage werkt met AI Sprint Studio branding
- ✅ Dashboard toont je n8n workflows
- ✅ Alle features werken
- ✅ Website is live!

**Je Vercel URL**: https://aisprintstudionew.vercel.app

Voor gedetailleerde uitleg, zie: `VERCEL_DEPLOYMENT.md`

