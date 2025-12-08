# 🔑 Vercel Environment Variables - Complete Setup

## ⚠️ Belangrijk

Voor Vercel deployment moeten **ALLE** environment variables in het Vercel dashboard worden toegevoegd. 
`.env.local` wordt **NIET** gebruikt in productie - alleen voor lokale development.

## 📋 Complete Lijst van Environment Variables

### 1. Supabase Configuration (Verplicht)

```
Name:  NEXT_PUBLIC_SUPABASE_URL
Value: https://mbfpkjrvjuuzajgjbbpv.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name:  NEXT_PUBLIC_SUPABASE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iZnBranJ2anV1emFqZ2piYnB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzQ0MTEsImV4cCI6MjA3NzQxMDQxMX0.LX_PXLI0FQBwSIl9_-FFPfUYrCKPNTJ934tab6ipPHY
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name:  SUPABASE_SERVICE_ROLE_KEY
Value: [Je service role key uit Supabase Dashboard]
Environments: ✅ Production ✅ Preview ✅ Development
```

### 2. Email Notifications - Resend (Verplicht voor Quick Scan)

```
Name:  RESEND_API_KEY
Value: [Je Resend API key]
Environments: ✅ Production ✅ Preview ✅ Development
```

**Hoe te krijgen:**
1. Ga naar https://resend.com
2. Maak account aan
3. Ga naar API Keys
4. Maak nieuwe API key aan
5. Kopieer de key

### 3. n8n API Configuration (Verplicht voor Dashboard)

```
Name:  N8N_API_URL
Value: https://guidocroon.com/n8n
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name:  N8N_API_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYmU1NzhlMC1hODgzLTQyYWMtYmM1NC0yNWQ2Y2E0NzY0MjMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUyMTMyMDc3LCJleHAiOjE3NTk4OTYwMDB9.-ssql39foEdVRJ1_AdHxcBfODUX4VkJLEQgOwV4C9_o
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name:  NEXT_PUBLIC_N8N_API_URL
Value: https://guidocroon.com/n8n
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name:  NEXT_PUBLIC_N8N_API_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYmU1NzhlMC1hODgzLTQyYWMtYmM1NC0yNWQ2Y2E0NzY0MjMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUyMTMyMDc3LCJleHAiOjE3NTk4OTYwMDB9.-ssql39foEdVRJ1_AdHxcBfODUX4VkJLEQgOwV4C9_o
Environments: ✅ Production ✅ Preview ✅ Development
```

### 4. NextAuth Authentication (Verplicht voor Login)

```
Name:  GOOGLE_CLIENT_ID
Value: [Je Google OAuth Client ID]
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name:  GOOGLE_CLIENT_SECRET
Value: [Je Google OAuth Client Secret]
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name:  NEXTAUTH_URL
Value: https://aisprintstudio.com (of je Vercel URL)
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name:  NEXTAUTH_SECRET
Value: [Genereer een willekeurige string - kan via: openssl rand -base64 32]
Environments: ✅ Production ✅ Preview ✅ Development
```

### 5. OpenAI (Optioneel - voor RAG/Embeddings)

```
Name:  OPENAI_API_KEY
Value: [Je OpenAI API key]
Environments: ✅ Production ✅ Preview ✅ Development
```

### 6. Quick Scan Webhook (Optioneel)

```
Name:  N8N_QUICK_SCAN_WEBHOOK_URL
Value: https://guidocroon.com/n8n/webhook/quick-scan
Environments: ✅ Production ✅ Preview ✅ Development
```

## 🚀 Stap-voor-stap Setup in Vercel

### Stap 1: Ga naar Vercel Dashboard
1. Open: https://vercel.com/dashboard
2. Klik op je project: **aisprintstudionew** (of je project naam)
3. Klik op **Settings** (bovenaan)
4. Klik op **Environment Variables** (in sidebar links)

### Stap 2: Voeg Alle Variables Toe
1. Klik op **"Add New"** voor elke variable
2. Vul **Name** en **Value** in
3. **BELANGRIJK:** Selecteer voor ALLE variabelen:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

### Stap 3: Redeploy
Na het toevoegen van alle environment variables:

1. Ga naar **Deployments** tab (bovenaan)
2. Klik op de **3 dots (⋮)** bij de laatste deployment
3. Klik **Redeploy**
4. Wacht 2-3 minuten tot build klaar is

## ✅ Checklist

Na het toevoegen van alle variables, controleer:

- [ ] Quick Scan formulier stuurt emails ✅
- [ ] Dashboard login werkt ✅
- [ ] n8n workflows zijn zichtbaar in dashboard ✅
- [ ] RAG/chat functionaliteit werkt (als OpenAI key is toegevoegd) ✅

## 🔍 Troubleshooting

### Probleem: Quick Scan stuurt geen emails
**Oplossing:** Check of `RESEND_API_KEY` correct is toegevoegd in Vercel

### Probleem: Dashboard login werkt niet
**Oplossing:** Check of `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_URL` en `NEXTAUTH_SECRET` zijn toegevoegd

### Probleem: n8n workflows niet zichtbaar
**Oplossing:** Check of `N8N_API_URL` en `N8N_API_KEY` correct zijn toegevoegd

### Probleem: Server error na deploy
**Oplossing:** 
1. Check Vercel deployment logs
2. Controleer of alle verplichte environment variables zijn toegevoegd
3. Check of alle variables de juiste environments hebben geselecteerd (Production, Preview, Development)

## 📝 Notities

- **Lokaal development:** Gebruik `.env.local` (wordt niet gepusht naar GitHub)
- **Vercel production:** Gebruik Vercel Dashboard → Environment Variables
- **Geen secrets in code:** Zorg dat je nooit API keys in code commit
- **Security:** Service role keys zijn gevoelig - deel deze niet publiekelijk

