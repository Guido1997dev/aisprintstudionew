# n8n API is Optional

Webhooks work without API configuration. The API adds monitoring features only.

## Two modes

**Webhook-only:** Trigger workflows, receive responses. No stats.

**Webhook + API:** Full dashboard with execution stats, success rates, runtime metrics.

## Webhook → Callback Flow

```
Dashboard → POST webhook → n8n workflow runs → HTTP response back
```

For longer flows, n8n returns the result via HTTP response at workflow end. The dashboard receives this as the webhook response body.

## Implementation

```typescript
// API functions fail gracefully
if (!N8N_API_URL || !N8N_API_KEY) {
  console.warn('n8n API not configured. Webhooks still work.');
  return { data: [] };
}
```

- Never throw on missing API config
- Return empty arrays for stats functions
- Webhooks always work regardless of API status
