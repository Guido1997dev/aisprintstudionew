# CROONCO Webhook Setup Guide

## Overzicht

Dit document beschrijft hoe je webhooks configureert voor CROONCO automatiseringen in N8N.

## Huidige Status

### ✅ Geconfigureerde Automatiseringen

**1. Zaken schikken**
- Status: Actief
- Webhook URL: `https://guidocroon.com/n8n/webhook/cf0b17f2-527e-4058-9c64-1dfe008e515f`
- Method: POST
- Beschrijving: Automatische verwerking van zakelijke schikkingen

### 🔧 Nog te Configureren

**2. Verzoekschriften analyseren**
- Status: Configuratie vereist
- Webhook URL: Nog niet ingesteld
- Method: POST
- Beschrijving: AI-analyse van juridische verzoekschriften

## Webhook Configuratie Stappen

### Stap 1: Login op N8N

1. Ga naar: https://guidocroon.com/n8n
2. Log in met je admin credentials

### Stap 2: Open de Workflow

1. Klik op "Workflows" in het linker menu
2. Zoek naar "Verzoekschriften analyseren"
3. Klik op de workflow om deze te openen

### Stap 3: Voeg Webhook Trigger toe

1. Klik op het **+** icoon om een nieuwe node toe te voegen
2. Zoek naar "Webhook"
3. Selecteer **"Webhook"** trigger node
4. De node wordt toegevoegd aan je workflow

### Stap 4: Configureer Webhook Settings

In de Webhook node:

```
HTTP Method: POST
Path: croonco-verzoekschriften
Authentication: None (of kies een methode)
Response Mode: When Last Node Finishes
Response Code: 200
```

### Stap 5: Test de Webhook

1. Klik op "Execute Workflow" (driehoek icoon rechtsboven)
2. De workflow wordt geactiveerd in test mode
3. Kopieer de **Test URL** die verschijnt
4. Test URL formaat: `https://guidocroon.com/n8n/webhook-test/croonco-verzoekschriften`

### Stap 6: Test via Dashboard

1. Log in op het dashboard: http://localhost:3333/login
2. Gebruik credentials:
   - Email: `info@croonco.nl`
   - Password: `croonco123`
3. Je ziet nu de "Verzoekschriften analyseren" automatisering
4. Klik op "Start Verzoekschriften analyseren"
5. Check in N8N of de execution is gestart

### Stap 7: Activeer de Workflow

Als de test succesvol is:

1. Klik op de **toggle switch** rechtsboven in N8N (van grijs naar blauw)
2. De workflow is nu actief
3. De production webhook URL is: `https://guidocroon.com/n8n/webhook/croonco-verzoekschriften`

### Stap 8: Update Dashboard Configuration

In het project, update `/src/lib/company-workflows.ts`:

```typescript
{
  id: 'croonco-verzoekschriften',
  name: 'Verzoekschriften analyseren',
  webhookUrl: 'https://guidocroon.com/n8n/webhook/croonco-verzoekschriften',
  description: 'AI-analyse van juridische verzoekschriften',
  requiresSetup: false, // Verander van true naar false
  method: 'POST',
}
```

## Webhook Request Format

Wanneer een automatisering wordt getriggerd via het dashboard, stuurt het een POST request met deze JSON body:

```json
{
  "triggeredFrom": "dashboard",
  "company": "CROONCO",
  "timestamp": "2025-01-17T14:30:00.000Z"
}
```

## Voorbeeld Workflow Structure

Een typische N8N workflow voor CROONCO:

```
[Webhook Trigger]
    ↓
[Process Input Data]
    ↓
[AI Analysis / Business Logic]
    ↓
[Store Results]
    ↓
[Send Notification]
    ↓
[Return Response]
```

## Best Practices

### 1. Error Handling

Voeg een "Error Trigger" node toe:
- Catch errors automatisch
- Log errors naar een database
- Stuur notificaties bij failures

### 2. Response Format

Return altijd een JSON response:

```json
{
  "success": true,
  "message": "Verzoekschrift succesvol geanalyseerd",
  "executionId": "abc123",
  "timestamp": "2025-01-17T14:30:00.000Z"
}
```

### 3. Tags

Tag je workflows met "CROONCO":
- Makkelijker te filteren
- Beter te organiseren
- Dashboard kan automatisch detecteren

### 4. Monitoring

- Check execution logs regelmatig in N8N
- Monitor success/error rates in dashboard
- Set up email alerts voor critical failures

## Troubleshooting

### Probleem: Webhook geeft 404

**Oplossing:**
- Check of workflow is geactiveerd (toggle moet blauw zijn)
- Verify dat de webhook path correct is
- Test de URL in Postman of curl eerst

### Probleem: Workflow start niet

**Oplossing:**
- Check N8N logs: Settings → Log Streaming
- Verify dat webhook node correct is geconfigureerd
- Check of er geen conflicterende workflows zijn

### Probleem: Dashboard toont "Setup Required"

**Oplossing:**
- Update `company-workflows.ts`
- Zet `requiresSetup: false`
- Herstart development server

## Testing Commands

### Test met cURL

```bash
# Test de webhook direct
curl -X POST https://guidocroon.com/n8n/webhook/croonco-verzoekschriften \
  -H "Content-Type: application/json" \
  -d '{
    "triggeredFrom": "test",
    "company": "CROONCO",
    "timestamp": "2025-01-17T14:30:00.000Z"
  }'
```

### Test Response

Verwachte response:
```json
{
  "message": "Workflow was started",
  "executionId": "12345"
}
```

## N8N API Integration

Voor toekomstige uitbreiding kun je ook de N8N API gebruiken:

### Get API Key

1. Ga naar: https://guidocroon.com/n8n/settings/api
2. Generate new API key
3. Kopieer de key

### Update .env.local

```bash
NEXT_PUBLIC_N8N_API_URL=https://guidocroon.com/n8n
N8N_API_KEY=n8n_api_[your-key-here]
```

### API Calls

Hiermee kun je:
- Workflows activeren/deactiveren
- Execution history ophalen
- Detailed execution logs bekijken
- Workflow statistics verzamelen

## Support

Voor vragen of problemen:
- Email: support@aisprintstudio.nl
- N8N Docs: https://docs.n8n.io
- Dashboard Issues: GitHub repository

## Checklist voor Go-Live

- [ ] Beide workflows geconfigureerd in N8N
- [ ] Webhooks getest via cURL
- [ ] Webhooks getest via dashboard
- [ ] Error handling toegevoegd
- [ ] Tags ingesteld op workflows
- [ ] Monitoring/alerts geconfigureerd
- [ ] Dashboard geüpdatet met production URLs
- [ ] CROONCO getraind in gebruik dashboard
- [ ] Backup plan voor failures
- [ ] Contact persoon aangewezen voor support

## Versie Historie

- **v1.0** - Initiele setup met "Zaken schikken"
- **v1.1** - "Verzoekschriften analyseren" configuratie guide toegevoegd







