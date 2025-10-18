# 🤖 Chatbox Webhook Setup Guide

## Overview

De chatbox in je applicatie is nu verbonden met n8n via webhooks. Dit betekent dat elke bericht dat je in de chatbox typt automatisch naar je n8n workflow wordt gestuurd.

## 🚀 Snel Start (3 Stappen)

### Stap 1: Maak een Webhook Trigger in N8N

1. **Log in op je n8n instance:**
   - Ga naar: `https://your-n8n-domain.com`
   - Log in met je admin credentials

2. **Open of maak een workflow:**
   - Klik op "Workflows" in het menu
   - Klik op "Add Workflow" of open een bestaande workflow

3. **Voeg een Webhook trigger toe:**
   - Klik op het **+** icoon
   - Zoek naar **"Webhook"**
   - Selecteer **"Webhook" trigger** (Trigger, niet Regular)

4. **Configureer de Webhook:**
   ```
   HTTP Method: POST
   Authentication: None (of kies een beveiligingsmethode)
   Response Mode: When Last Node Finishes
   Response Code: 200
   ```

5. **Kopieer de Webhook URL:**
   - Je ziet een URL verschijnen
   - Voorbeeld: `https://your-n8n-domain.com/webhook/abc123xyz`
   - Kopieer deze URL (klik op copy icoon)

### Stap 2: Voeg Webhook URL in Dashboard In

#### Via Settings Panel:

1. **Open de applicatie in je browser**
2. **Zoek de "Webhook Settings" sectie** (meestal in instellingen of dashboard)
3. **Plak de webhook URL:**
   - Klik op "Edit" (als je al iets hebt ingesteld)
   - Of scroll naar het input veld
   - Plak de URL uit n8n
   - Klik **"Save"**

#### Via Browser Console (Alternatief):

```javascript
// Open DevTools (F12 of Cmd+Option+I)
// Plak dit in de console:
localStorage.setItem('chatbox_webhook_url', 'https://your-n8n-domain.com/webhook/your-webhook-path')
console.log('✅ Webhook URL saved!')
```

#### Via Environment Variable (Voor Developers):

Voeg toe aan je `.env.local`:
```bash
NEXT_PUBLIC_CHATBOX_WEBHOOK_URL=https://your-n8n-domain.com/webhook/your-webhook-path
```

### Stap 3: Test de Verbinding

1. **Ga terug naar je applicatie**
2. **Type een test bericht in de chatbox:**
   - Voorbeeld: "Hello from chatbox"
   - Klik op Send

3. **Check in N8N of het bericht is aangekomen:**
   - Ga terug naar je n8n workflow
   - Klik op de Webhook node
   - Je zou een execution moeten zien met je bericht

## 📤 Wat Wordt Verzonden?

Elke keer dat je een bericht verzend, wordt dit JSON object naar je webhook gestuurd:

```json
{
  "message": "Je bericht hier",
  "tool": null,  // Of de geselecteerde tool ID
  "image": {
    "data": "base64-encoded-image-data",
    "type": "base64"
  },  // Alleen als je een afbeelding hebt bijgevoegd
  "timestamp": "2025-10-18T14:30:00.000Z"
}
```

### Voorbeelden:

**Eenvoudig bericht:**
```json
{
  "message": "Wat is de weersvoorspelling?",
  "tool": null,
  "image": null,
  "timestamp": "2025-10-18T14:30:00.000Z"
}
```

**Bericht met tool:**
```json
{
  "message": "Maak een afbeelding van een kat",
  "tool": "createImage",
  "image": null,
  "timestamp": "2025-10-18T14:30:00.000Z"
}
```

**Bericht met afbeelding:**
```json
{
  "message": "Analyseer deze afbeelding",
  "tool": null,
  "image": {
    "data": "data:image/png;base64,iVBORw0KGgoAAAANS...",
    "type": "base64"
  },
  "timestamp": "2025-10-18T14:30:00.000Z"
}
```

## 🔧 Webhook Node Configuratie in N8N

### Eenvoudige Setup (Test)

```
Trigger Webhook
  ↓
Process Input
  ↓
Return Response
```

### Geavanceerde Setup (Productie)

```
Trigger Webhook
  ↓
Extract Message
  ↓
Call AI API (bijv. OpenAI)
  ↓
Process Response
  ↓
Log/Store Results
  ↓
Return Response
```

## 📝 N8N Workflow Voorbeeld

Hier is een basic workflow die je kunt gebruiken:

```
1. Webhook Trigger (POST)
   ├─ HTTP Method: POST
   ├─ Authentication: None
   └─ Response Mode: When Last Node Finishes

2. Function Node (Optional - Process Input)
   └─ Code:
      ```javascript
      return {
        message: $json.message,
        tool: $json.tool,
        timestamp: $json.timestamp
      }
      ```

3. HTTP Request Node (Call AI Service)
   ├─ URL: https://api.openai.com/v1/chat/completions
   ├─ Method: POST
   ├─ Headers:
   │  └─ Authorization: Bearer $json.OPENAI_API_KEY
   └─ Body: {...}

4. Response Node
   └─ Return the AI response to chatbox
```

## 🧪 Testing & Debugging

### Test via cURL

```bash
curl -X POST https://your-n8n-domain.com/webhook/your-path \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test message",
    "tool": null,
    "image": null,
    "timestamp": "2025-10-18T14:30:00.000Z"
  }'
```

### Test via Postman

1. **New Request**
2. **Method:** POST
3. **URL:** Plak je webhook URL
4. **Body (raw JSON):**
```json
{
  "message": "Test message",
  "tool": null,
  "image": null,
  "timestamp": "2025-10-18T14:30:00.000Z"
}
```
5. **Send**

### Debug in Browser Console

```javascript
// Check of webhook URL is ingesteld
const webhookUrl = localStorage.getItem('chatbox_webhook_url');
console.log('Webhook URL:', webhookUrl);

// Manual test
fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Test message',
    tool: null,
    image: null,
    timestamp: new Date().toISOString()
  })
})
.then(r => r.json())
.then(data => console.log('Response:', data))
.catch(e => console.error('Error:', e))
```

## 🚨 Troubleshooting

### ❌ "Webhook not configured" Alert

**Probleem:** Je krijgt een alert dat de webhook niet is ingesteld

**Oplossing:**
1. Check of je webhook URL juist is gekopieerd
2. Open DevTools → Application → LocalStorage
3. Check of `chatbox_webhook_url` key bestaat
4. Vergelijk met je n8n webhook URL

### ❌ 404 Error

**Probleem:** "404 Not Found" bij het verzenden

**Oplossing:**
1. Check of je webhook node in n8n actief is (toggle moet aan zijn)
2. Verify dat je de JUISTE webhook URL hebt gekopieerd
3. Test de URL in Postman/cURL
4. Check of er geen typos in de URL staan

### ❌ Webhook Start, maar Nothing Happens

**Probleem:** Bericht wordt verzonden, maar niets gebeurt in n8n

**Oplossing:**
1. Check je n8n execution logs:
   - Workflow → Executions → Check latest run
2. Verify dat je nodes correct verbonden zijn
3. Check of er errors zijn in de Function/HTTP nodes
4. Use Debug Mode: plaats een `console.log` in je workflow

### ❌ CORS Errors

**Probleem:** CORS error in browser console

**Oplossing:**
1. Dit is normaal - je n8n instance moet CORS toestaan
2. In n8n Settings: Security → Cors Settings
3. Voeg je domain toe: `https://your-app-domain.com`

### ❌ Image niet verzonden

**Probleem:** Afbeeldingen worden niet verzonden

**Oplossing:**
1. Check of afbeelding groter is dan 5MB (te groot)
2. Supported formats: PNG, JPG, GIF, WebP
3. Check browser console voor errors

## 📊 Monitoring

### N8N Execution Logs

1. Open je workflow in n8n
2. Ga naar "Executions" tab
3. Je ziet alle webhook calls
4. Click op een execution om details te zien

### Browser Console Logs

```javascript
// Check browser console (F12)
// Je ziet:
// ✅ Message sent to webhook
// ❌ Failed to send message: ...
```

## 🔐 Security Best Practices

### 1. Voeg Authentication toe (Optioneel)

In n8n Webhook Node:
```
Authentication: API Key
Key Name: X-API-Key
Value: Your-Secret-Key
```

Dan in de chatbox code aanpassen:
```javascript
headers: {
  'Content-Type': 'application/json',
  'X-API-Key': 'Your-Secret-Key',  // Add this
}
```

### 2. Validate Input in Webhook

Voeg validatie toe in je n8n workflow:
```
Webhook → IF Node → Check message length → Process or Reject
```

### 3. Rate Limiting

Voeg Rate Limiting toe op webhook niveau:
- N8N Settings → Security → Webhook Rate Limiting

## 🎯 Production Checklist

- [ ] Webhook URL correct ingesteld in application
- [ ] N8N workflow actief (toggle aan)
- [ ] Test bericht succesvol verzonden en ontvangen
- [ ] Response correct teruggekomen in chatbox
- [ ] Error handling ingebouwd in workflow
- [ ] Logging geconfigureerd voor debugging
- [ ] CORS ingesteld op n8n
- [ ] Authentication geconfigureerd (als gewenst)
- [ ] Rate limiting ingesteld
- [ ] Monitoring setup (execution logs checked)

## 📚 Useful Links

- [N8N Webhook Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [N8N HTTP Request Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)
- [N8N API Reference](https://docs.n8n.io/api/)

## 🆘 Getting Help

If you encounter issues:

1. **Check the browser console** (F12 → Console tab)
2. **Check N8N execution logs** in your workflow
3. **Test the webhook with cURL or Postman**
4. **Review this guide's Troubleshooting section**

## 📝 Notes

- De chatbox stuurt berichten automatisch wanneer je op Send klikt
- De webhook URL wordt opgeslagen in browser localStorage
- Berichten zijn asynchroon (non-blocking)
- Maximum bericht grootte: ~5MB (voor afbeeldingen)

---

**Last Updated:** October 18, 2025  
**Version:** 1.0
