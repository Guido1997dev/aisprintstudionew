---
name: Multi-Tenant SaaS Platform - Architecture Plan
overview: ""
todos:
  - id: 91cb2db3-aca0-4ee0-af4d-033624cd4e0d
    content: Set up Supabase project (EU-hosted) with multi-tenant schema and RLS policies
    status: pending
  - id: a635ed62-76ee-4096-91c3-96e6ff45c372
    content: Build tenant-context.tsx extending auth-context with company_id and subscription data
    status: pending
  - id: d5178ebf-71dc-4787-9740-c2a4c199183e
    content: Create subscriptions.ts with feature flags and tier definitions
    status: pending
  - id: 9710c579-934d-499d-9af7-58275cb86d0a
    content: Build chat-interface.tsx component with gpt-4o-mini for free tier
    status: pending
  - id: 4007d57f-1db5-4069-8eed-7fb7fe3899fe
    content: Create n8n-credentials-form.tsx for safe credential management
    status: pending
  - id: 94f4f70e-1f30-46a8-90a2-0ea81a1ea687
    content: Implement feature-gate.tsx and useFeatures() hook for paid features
    status: pending
  - id: 90236081-fdd1-4e7c-8337-ae10837c8e14
    content: Build paid-dashboard.tsx with insights and triggering (gated by subscription)
    status: pending
  - id: bd86be67-2943-4387-832c-b685a68362f6
    content: Integrate Stripe for payments with checkout flow and webhooks
    status: pending
  - id: ee018136-52b7-4173-bc23-d36a53ca73b2
    content: Create signup and onboarding flow with trial period option
    status: pending
  - id: 69c49454-e8d5-42bc-bf19-85d63a38f518
    content: Set up Supabase Realtime for paid tier execution updates
    status: pending
  - id: a2dabb41-43e6-4f8f-8e88-82ada462e17d
    content: Implement Row-Level Security ensuring complete data isolation per company
    status: pending
  - id: fe6fd46e-0ca4-4300-a5e6-f1a302942720
    content: Add backend verification of company_id on all API endpoints
    status: pending
  - id: 277827e2-483e-4ead-a4bd-77d4cc894d82
    content: Build usage tracking and analytics per company
    status: pending
  - id: bf6549a7-e341-4b4b-88f5-d771fcb3da00
    content: Create admin dashboard for monitoring all companies and billing
    status: pending
---

# Multi-Tenant SaaS Platform - Architecture Plan

## 1. Database & Data Layer (Supabase - Europe-based)

**Provider:** Supabase (PostgreSQL, EU-hosted, affordable)

- Free tier: 500MB storage, 2GB bandwidth
- Pay-as-you-go: reasonable pricing

**Database Schema:**

```sql
-- Companies/Tenants
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE,
  subscription_tier TEXT ('free', 'pro', 'enterprise'),
  subscription_start DATE,
  subscription_end DATE,
  trial_end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  custom_branding JSON,
  metadata JSON
);

-- Users (per company)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  email VARCHAR UNIQUE,
  name VARCHAR,
  password_hash VARCHAR,
  role TEXT ('owner', 'admin', 'member'),
  created_at TIMESTAMP
);

-- Feature Access (per subscription tier)
CREATE TABLE feature_access (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  feature_name TEXT,
  is_enabled BOOLEAN,
  limit_value INT, -- null = unlimited
  created_at TIMESTAMP
);

-- N8N Credentials (encrypted)
CREATE TABLE n8n_credentials (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  n8n_url VARCHAR,
  api_key VARCHAR (encrypted),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Workflows (per company)
CREATE TABLE workflows (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  name VARCHAR,
  n8n_workflow_id VARCHAR,
  webhook_url VARCHAR,
  created_at TIMESTAMP
);

-- Executions/Usage Tracking
CREATE TABLE executions (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  workflow_id UUID REFERENCES workflows(id),
  status TEXT ('success', 'error', 'running'),
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

-- Chat History (for LLM)
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  user_id UUID REFERENCES users(id),
  message TEXT,
  role TEXT ('user', 'assistant'),
  created_at TIMESTAMP
);

-- Row-Level Security (RLS) voor data isolatie
-- Automatische filtering per company_id
```

## 2. Authentication & Multi-Tenant Context

**File:** `src/contexts/tenant-context.tsx`

- Replace/extend auth-context with tenant awareness
- Store: company_id, subscription_tier, features_enabled
- Automatic company_id filtering in all queries
- RLS policies enforce data isolation

**Auth Flow:**

1. User logs in
2. Get company_id from user record
3. Load subscription tier & features
4. Set context with permissions
5. All DB queries filtered by company_id (automatic via RLS)

## 3. Subscription & Feature System

**File:** `src/lib/subscriptions.ts`

```typescript
type SubscriptionTier = 'free' | 'pro' | 'enterprise';

const FEATURES = {
  'free': {
    chat: { enabled: true, model: 'gpt-4o-mini', limit: 100 }, // cost-limited
    insights: false,
    triggering: false,
    custom_branding: false,
    scheduling: false,
    api_access: false,
    max_workflows: 1,
    max_team_members: 1,
  },
  'pro': {
    chat: { enabled: true, model: 'gpt-4o', limit: 1000 },
    insights: true,
    triggering: true,
    custom_branding: false,
    scheduling: false,
    api_access: false,
    max_workflows: 10,
    max_team_members: 5,
  },
  'enterprise': {
    chat: { enabled: true, model: 'gpt-4o', limit: null },
    insights: true,
    triggering: true,
    custom_branding: true,
    scheduling: true,
    api_access: true,
    max_workflows: null,
    max_team_members: null,
  }
};
```

## 4. Free Tier: Chat Interface with Cost-Limited LLM

**New File:** `src/components/chat-interface.tsx`

- Modern ChatGPT-style interface
- Uses gpt-4o-mini for free tier (cheap model)
- Shows: latest 10 messages, limitations
- Can integrate automation insights gradually
- Real-time message streaming

**LLM Integration:**

- Use OpenAI API with function calling
- Free tier: gpt-4o-mini ($0.15 per 1M input tokens)
- Can understand N8N context but no triggering
- Cost per free user: ~$0.01-0.05/month average

## 5. N8N Integration with Credentials Management

**New Files:**

- `src/lib/n8n-integration.ts` - N8N API wrapper
- `src/components/n8n-credentials-form.tsx` - Safe credentials input

**Features:**

- Customers can add their N8N instance credentials (via UI form)
- Credentials stored encrypted in Supabase
- Dashboard shows: "Connected ✅" or "Not Connected"
- Instructions: simple copy-paste of N8N credentials
- Test connection before saving
- Credentials never sent to client (backend only)

## 6. Dashboard (Paid Only)

**File:** `src/components/paid-dashboard.tsx`

Feature-gated by subscription:

- **Pro**: Basic insights + triggering
- **Enterprise**: Full features + API access

Shows:

- Workflow insights (only if paid)
- Execution history
- Trigger buttons
- Analytics (success rate, timeline, etc)

## 7. Payment & Billing

**Provider:** Stripe (global, includes EU)

**Files:**

- `src/pages/api/billing/create-checkout.ts`
- `src/pages/api/billing/webhook.ts`
- `src/components/pricing-table.tsx`

**Pricing Model:**

- Free: €0 (always)
- Pro: €29/month (insights + triggering)
- Enterprise: Custom pricing
- Feature add-ons: €5-15 each

## 8. Data Isolation & Security

**Row-Level Security (Supabase RLS):**

```sql
-- Every table has RLS enabled
-- Policies ensure: SELECT/INSERT/UPDATE only own company
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users see own company" ON companies
  USING (auth.uid()::text = user_id);
```

**Backend Verification:**

- Every API call verifies: req.company_id matches user's company_id
- N8N credentials never expose to frontend
- API endpoints check subscription tier
- Usage limits enforced per company

## 9. Onboarding Flow

1. **Sign-up Page**

   - Email, password, company name
   - Create company + first user (owner)
   - Auto-set to free tier
   - Send confirmation email

2. **Trial Period Setup**

   - Option: 14-day free trial of Pro
   - Automatically apply discount code
   - Set trial_end_date in DB
   - Show countdown timer

3. **Initial Setup (Onboarding Wizard)**

   - Step 1: Add N8N credentials (optional for free)
   - Step 2: Import workflows
   - Step 3: Create team members
   - Step 4: Explore features

## 10. Feature Access Pattern

**Global Hook:** `useFeatures()`

```typescript
const { canTrigger, canViewInsights, maxWorkflows } = useFeatures();

// In components:
{canTrigger && <TriggerButton />}
{canViewInsights && <Analytics />}
{!canTrigger && <UpgradePrompt feature="Triggering" />}
```

## 11. Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── onboarding/page.tsx
│   ├── dashboard/page.tsx (routes based on tier)
│   ├── chat/page.tsx (free tier)
│   ├── pricing/page.tsx
│   └── settings/page.tsx
├── components/
│   ├── chat-interface.tsx
│   ├── paid-dashboard.tsx
│   ├── n8n-credentials-form.tsx
│   ├── upgrade-prompt.tsx
│   └── feature-gate.tsx
├── lib/
│   ├── subscriptions.ts
│   ├── n8n-integration.ts
│   ├── supabase.ts
│   └── stripe.ts
├── contexts/
│   └── tenant-context.tsx
└── pages/api/
    ├── auth/
    ├── billing/
    ├── workflows/
    └── chat/

Environment:
.env.local:
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  OPENAI_API_KEY=
  STRIPE_SECRET_KEY=
  STRIPE_PUBLISHABLE_KEY=
```

## 12. Real-time Updates (Paid Feature)

**Using:** Supabase Realtime

- Free tier: None (polling OK)
- Pro/Enterprise: Real-time subscriptions
```typescript
// Real-time execution updates
supabase
  .from('executions')
  .on('INSERT', payload => updateUI(payload))
  .subscribe();
```


## 13. Monitoring & Analytics

**Track per company:**

- API calls (usage limits)
- LLM token consumption
- Workflow executions
- Feature usage
- Billing metrics

**Files:**

- `src/lib/analytics.ts`
- `pages/api/admin/analytics.ts`

## 14. Scaling Strategy (10-50 companies)

**Phase 1 (Now):** Single Supabase instance (handles 1000s of companies)

**Phase 2:** Multi-region Supabase (if needed)

**Phase 3:** Dedicated N8N instances per company (optional)

**No changes needed for 10-50 companies:**

- Supabase easily handles this
- RLS ensures isolation
- Real-time streaming scales well

## 15. Deployment Architecture

```
Frontend (Vercel)
    ↓
API Routes (Vercel Serverless)
    ↓
Supabase PostgreSQL (EU)
    ↓
N8N Instance (Customer-managed or AI Sprint hosted)

External:
- Stripe (Payments)
- OpenAI (LLM)
```

## 16. Admin Dashboard

**Future File:** `src/app/admin/dashboard.tsx`

Access: Your account only

Shows:

- All companies
- Subscription tiers
- Usage analytics
- Billing overview
- Support tickets