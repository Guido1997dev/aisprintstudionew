# 💬 Chatbox Webhook Setup

De chatbox op het dashboard is nu verbonden met n8n via webhooks.

## ⚡ Quick Start (2 minuten)

### 1. Maak Webhook in N8N
```
N8N → Workflows → Open/Create
→ + icoon → "Webhook" → Selecteer "Webhook"
→ HTTP Method: POST
→ Kopieer de URL
```

### 2. Vul URL in Dashboard
```
Dashboard → Webhook Settings tab → Paste URL → Save
```

### 3. Test
```
Stuur een bericht via chatbox → Check N8N Executions
```

---

## 📍 Waar Webhook URL Invullen?

### Optie 1: Dashboard (Easiest) ✅
```
Dashboard → "Webhook Settings" tab → Paste & Save
```

### Optie 2: Browser Console
```javascript
localStorage.setItem('chatbox_webhook_url', 'https://your-n8n.com/webhook/...')
```

### Optie 3: Environment Variable
```bash
# .env.local
NEXT_PUBLIC_CHATBOX_WEBHOOK_URL=https://your-n8n.com/webhook/...
```

---

## 📤 Wat Wordt Verzonden?

```json
{
  "message": "User text",
  "tool": null,
  "image": { "data": "base64", "type": "base64" } | null,
  "timestamp": "2025-10-18T14:30:00.000Z"
}
```

---

## 🧪 Testing

### Check in Browser
```javascript
console.log(localStorage.getItem('chatbox_webhook_url'))
```

### Manual Test
```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"message":"test","tool":null,"image":null,"timestamp":"2025-10-18T14:30:00.000Z"}'
```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Webhook not configured" | Set URL in Dashboard → Webhook Settings |
| 404 Error | Check N8N workflow is active (toggle on) |
| Nothing happens | Check N8N execution logs |

---

## 📁 Wat Is Gewijzigd

**Modified:**
- `src/components/prompt-box.tsx` - Webhook send function
- `src/app/dashboard/page.tsx` - Added floating chatbox + webhook settings tab

**Created:**
- `src/components/webhook-settings.tsx` - Settings panel
- `CHATBOX_WEBHOOK_QUICK_REFERENCE.md` - Quick ref
- `CHATBOX_WEBHOOK_INDEX.md` - Documentation index

---

**Done!** The chatbox is now on your dashboard (bottom right) and ready to send messages to n8n.
