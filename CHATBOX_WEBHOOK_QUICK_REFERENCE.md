# 🚀 Chatbox Webhook - Quick Reference

## Waar Webhook URL Invullen?

### 📍 Optie 1: Settings Panel (Easiest)
```
1. Open de applicatie
2. Zoek naar "Webhook Settings" component
3. Klik "Edit"
4. Plak je n8n webhook URL
5. Klik "Save"
```

### 📍 Optie 2: Browser Console
```javascript
localStorage.setItem('chatbox_webhook_url', 'YOUR_WEBHOOK_URL_HERE')
```

### 📍 Optie 3: Environment Variable
```bash
# In .env.local
NEXT_PUBLIC_CHATBOX_WEBHOOK_URL=https://your-n8n.com/webhook/path
```

---

## N8N Setup Cheatsheet

### 1️⃣ Create Webhook Trigger
- N8N → Workflows → Open/Create
- Click **+** → Search "Webhook"
- Select **"Webhook"** (trigger)
- HTTP Method: **POST**
- Copy the URL that appears

### 2️⃣ Save Webhook URL in App
- Paste the URL in the Webhook Settings panel
- Click Save

### 3️⃣ Test It!
- Send a message from chatbox
- Check N8N executions tab
- Should see your message there

---

## What Gets Sent?

```json
{
  "message": "Your text here",
  "tool": null,
  "image": null,
  "timestamp": "2025-10-18T14:30:00.000Z"
}
```

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Webhook not configured" | Check localStorage or env variable |
| 404 Error | Webhook URL wrong or n8n workflow not active |
| Nothing happens | Check N8N execution logs |
| CORS Error | Add your domain to N8N CORS settings |

---

## Useful Commands

### Check if URL is saved:
```javascript
console.log(localStorage.getItem('chatbox_webhook_url'))
```

### Test webhook manually:
```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"message":"test","tool":null,"image":null,"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"}'
```

---

## File Locations

- **Chatbox Component:** `/src/components/prompt-box.tsx`
- **Webhook Settings:** `/src/components/webhook-settings.tsx`
- **Full Setup Guide:** `/CHATBOX_WEBHOOK_SETUP.md`

---

## Key Files Modified

```
✅ src/components/prompt-box.tsx       → Added webhook send function
✅ src/components/webhook-settings.tsx → New settings panel
✅ CHATBOX_WEBHOOK_SETUP.md            → Full documentation
```

---

## LocalStorage Key

```
Key: chatbox_webhook_url
Value: https://your-n8n-instance.com/webhook/your-path
```

---

## Environment Variable

```bash
NEXT_PUBLIC_CHATBOX_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-path
```

---

## Response Format from N8N

Your n8n workflow should return JSON:

```json
{
  "success": true,
  "message": "Message processed",
  "data": { }
}
```

---

**Need help?** See `CHATBOX_WEBHOOK_SETUP.md` for detailed guide
