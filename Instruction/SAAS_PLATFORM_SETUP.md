# Multi-Tenant SaaS Platform - Setup Guide

## 🎯 Overview

You now have the **foundation** of a complete multi-tenant SaaS platform with:
- ✅ Supabase integration (EU-hosted PostgreSQL)
- ✅ Subscription tier system (Free, Pro, Enterprise)
- ✅ Feature gating component
- ✅ Tenant context for company-specific data
- ✅ N8N credentials management
- ✅ Cost-limited LLM integration foundation

## 🏗️ Phase 1: Foundation (COMPLETED)

### Files Created/Modified

**New Libraries:**
- `src/lib/supabase.ts` - Supabase client & database types
- `src/lib/subscriptions.ts` - Feature tiers & pricing
- `src/lib/n8n-integration.ts` - N8N API wrapper

**New Components:**
- `src/components/feature-gate.tsx` - Feature gating UI

**New Contexts:**
- `src/contexts/tenant-context.tsx` - Multi-tenant state

### What You Can Do Now

1. **Feature Gating:**
   ```typescript
   import { FeatureGate } from '@/components/feature-gate';
   
   <FeatureGate feature="triggering">
     <TriggerButton />
   </FeatureGate>
   ```

2. **Access Tenant Data:**
   ```typescript
   import { useTenant } from '@/contexts/tenant-context';
   
   const { company, subscriptionTier, features } = useTenant();
   ```

3. **Check Specific Features:**
   ```typescript
   import { useFeature } from '@/contexts/tenant-context';
   
   const canTrigger = useFeature('triggering');
   if (canTrigger) {
     // Show trigger button
   }
   ```

## 📦 Phase 2: Supabase Setup (NEXT)

### Prerequisites

1. Create Supabase project:
   - Go to: https://supabase.com
   - Choose EU region (Ireland, Frankfurt, etc)
   - Create new project

2. Get credentials:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Key → `NEXT_PUBLIC_SUPABASE_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

### Setup Instructions

1. **Update .env.local:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   NEXT_PUBLIC_N8N_API_URL=https://guidocroon.com/n8n
   N8N_API_KEY=your-n8n-api-key
   OPENAI_API_KEY=your-openai-key
   STRIPE_SECRET_KEY=your-stripe-secret
   STRIPE_PUBLISHABLE_KEY=your-stripe-public
   ```

2. **Create Database Schema:**
   Copy & paste into Supabase SQL editor:

   ```sql
   -- Enable UUID extension
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

   -- Companies table
   CREATE TABLE IF NOT EXISTS companies (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR NOT NULL,
     slug VARCHAR UNIQUE NOT NULL,
     subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
     subscription_start TIMESTAMP,
     subscription_end TIMESTAMP,
     trial_end_date TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW(),
     custom_branding JSONB,
     metadata JSONB
   );

   -- Users table
   CREATE TABLE IF NOT EXISTS users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
     email VARCHAR UNIQUE NOT NULL,
     name VARCHAR,
     password_hash VARCHAR,
     role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Feature access table
   CREATE TABLE IF NOT EXISTS feature_access (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
     feature_name VARCHAR NOT NULL,
     is_enabled BOOLEAN DEFAULT TRUE,
     limit_value INT,
     created_at TIMESTAMP DEFAULT NOW(),
     UNIQUE(company_id, feature_name)
   );

   -- N8N credentials table
   CREATE TABLE IF NOT EXISTS n8n_credentials (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     company_id UUID NOT NULL UNIQUE REFERENCES companies(id) ON DELETE CASCADE,
     n8n_url VARCHAR NOT NULL,
     api_key VARCHAR NOT NULL,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Workflows table
   CREATE TABLE IF NOT EXISTS workflows (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
     name VARCHAR NOT NULL,
     n8n_workflow_id VARCHAR,
     webhook_url VARCHAR,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Executions table
   CREATE TABLE IF NOT EXISTS executions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
     workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
     status TEXT DEFAULT 'running' CHECK (status IN ('success', 'error', 'running', 'waiting')),
     started_at TIMESTAMP DEFAULT NOW(),
     ended_at TIMESTAMP
   );

   -- Chat messages table
   CREATE TABLE IF NOT EXISTS chat_messages (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     message TEXT NOT NULL,
     role TEXT CHECK (role IN ('user', 'assistant')),
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Enable Row-Level Security (RLS)
   ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE n8n_credentials ENABLE ROW LEVEL SECURITY;
   ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
   ALTER TABLE executions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
   ALTER TABLE feature_access ENABLE ROW LEVEL SECURITY;
   ```

3. **Set Up Row-Level Security (RLS) Policies:**
   ```sql
   -- Users can only see their own company
   CREATE POLICY "users_see_own_company" ON companies
     FOR SELECT USING (
       auth.uid() IN (SELECT id FROM users WHERE company_id = companies.id)
     );

   -- Similar policies for other tables...
   -- This ensures complete data isolation
   ```

## 💰 Phase 3: Payment Integration (COMING NEXT)

### Files to Create

- `src/pages/api/billing/create-checkout.ts`
- `src/pages/api/billing/webhook.ts`
- `src/components/pricing-table.tsx`
- `src/pages/pricing.tsx`

### Stripe Setup

1. Create Stripe account: https://stripe.com
2. Create pricing tiers
3. Implement checkout flow
4. Handle subscription webhooks

## 💬 Phase 4: Chat Interface

### Files to Create

- `src/components/chat-interface.tsx` - ChatGPT-style interface
- `src/pages/api/chat.ts` - OpenAI integration
- `src/pages/chat.tsx` - Chat page

### Features

- Real-time message streaming
- GPT-4o-mini for free tier
- GPT-4o for paid tiers
- Cost limiting per tier
- Message history

## 🔑 Phase 5: Credentials Management

### Files to Create

- `src/components/n8n-credentials-form.tsx` - Safe input form
- `src/pages/api/credentials/save.ts` - Backend encryption
- `src/pages/settings.tsx` - Settings page

### Features

- Encrypted credential storage
- Connection testing
- Clear setup instructions
- Secure backend handling

## 🎨 Phase 6: UI Components

### Files to Create

- `src/components/paid-dashboard.tsx` - Paid dashboard view
- `src/components/upgrade-prompt.tsx` - Upgrade suggestions
- `src/pages/api/auth/signup.ts` - Registration
- `src/pages/auth/signup.tsx` - Sign-up page
- `src/pages/auth/onboarding.tsx` - Onboarding wizard

## 🔄 Current Architecture

```
Frontend (Vercel)
    ↓ Uses
TenantProvider (company context)
    ↓ Checks
FeatureGate (subscription tier)
    ↓ Allows access to
Components (Chat, Dashboard, etc)
    ↓ Communicates with
Supabase API
    ↓ Stores
Multi-tenant data (isolated per company)
```

## 🚀 How to Continue

### Option A: Setup Supabase Now

1. Create project on supabase.com
2. Run the SQL schema
3. Add credentials to `.env.local`
4. Test with: `npm run dev`

### Option B: Continue with Demo Data

Current system works with mock data. You can:
- Build UI components first
- Integrate Supabase later
- Keep development fast

### Option C: Add Features Now

You can already:
- Create pricing page (use PRICING_OPTIONS)
- Build sign-up flow
- Create N8N credentials form
- Build chat interface

## 📝 Key Concepts

### Multi-Tenancy

Each company is completely isolated:
- Own database rows (via company_id)
- Own Row-Level Security
- Own N8N credentials
- Own execution history

### Feature Gating

Control features by subscription:
```typescript
// Free: Chat only
// Pro: Chat + Dashboard + Triggering
// Enterprise: Everything unlimited
```

### Data Isolation

Guaranteed by:
1. **Database**: company_id on all tables
2. **RLS Policies**: SQL-level enforcement
3. **API**: Backend verification on all endpoints
4. **Frontend**: Feature gating component

## 🔐 Security Notes

- Credentials encrypted in Supabase (implement encryption)
- API keys never sent to frontend
- Company isolation via RLS policies
- Webhook signature verification (add after Stripe)
- Rate limiting (add to Vercel config)

## 📊 Pricing Reference

```
Free (€0)
├─ Chat: GPT-4o-mini (100 msgs/month)
├─ 1 workflow
├─ 1 team member
└─ Community support

Professional (€29/month)
├─ Chat: GPT-4o (1000 msgs/month)
├─ Dashboard + insights
├─ Workflow triggering
├─ 10 workflows
├─ 5 team members
└─ Priority support + 14-day trial

Enterprise (Custom)
├─ Everything unlimited
├─ Chat: GPT-4o unlimited
├─ Custom branding
├─ Scheduling + API
├─ Unlimited workflows & team
└─ 24/7 dedicated support

Add-ons (€5-20)
├─ Custom branding
├─ API access
├─ Scheduling
└─ Premium support
```

## 🎯 Next Immediate Steps

1. **Get Supabase Ready:**
   - Create account
   - Create EU project
   - Get credentials

2. **Update .env.local** with Supabase keys

3. **Run SQL Schema** in Supabase

4. **Test Connection:**
   ```typescript
   // In a component
   import { useTenant } from '@/contexts/tenant-context';
   const { company } = useTenant();
   console.log(company); // Should show company data
   ```

5. **Build Next Component:** Pricing page (you have the data!)

## 📚 File Reference

**Core System:**
- Subscriptions: `src/lib/subscriptions.ts`
- Tenant Context: `src/contexts/tenant-context.tsx`
- Feature Gate: `src/components/feature-gate.tsx`

**API Layer:**
- Supabase: `src/lib/supabase.ts`
- N8N: `src/lib/n8n-integration.ts`

**Configuration:**
- Pricing: `PRICING_OPTIONS` in `src/lib/subscriptions.ts`
- Features: `SUBSCRIPTION_TIERS` in `src/lib/subscriptions.ts`

## ✅ Checklist

- [x] Foundation code created
- [x] Subscription system defined
- [x] Feature gating component
- [x] Tenant context
- [x] N8N integration library
- [ ] Supabase project created
- [ ] Database schema created
- [ ] RLS policies configured
- [ ] Environment variables set
- [ ] Payment integration
- [ ] Chat interface
- [ ] Pricing page
- [ ] Sign-up flow
- [ ] Onboarding wizard
- [ ] Analytics dashboard
- [ ] Admin panel

---

**Status: Phase 1 Complete ✅**
**Ready for: Supabase Setup**
**Build: Successful ✅**
