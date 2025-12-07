# Quick Scan Setup Guide

## Overzicht
De Quick Scan feature is een lead generation tool die bezoekers een gratis AI analyse biedt in ruil voor hun contactgegevens.

## ✅ Wat is geïmplementeerd

### 1. Frontend Component
**Locatie:** `/src/components/quick-scan-form.tsx`

**Features:**
- Responsive 2-kolommen layout (copy links, form rechts)
- Required fields: Naam, Email, Bedrijfswebsite
- Optional field: Grootste uitdaging (textarea)
- Success state met thank you message
- Error handling en validatie
- Loading states tijdens submit
- Privacy statement

### 2. API Endpoint
**Locatie:** `/src/app/api/quick-scan/route.ts`

**Features:**
- POST endpoint voor form submissions
- Server-side validatie (email format, URL format)
- Supabase database integratie
- Optional n8n webhook trigger
- Error handling

### 3. Database Schema
**Locatie:** `/quick-scan-table.sql`

**Features:**
- Table: `quick_scan_submissions`
- Fields: name, email, website, challenge, status, notes
- Indexes voor performance
- Row Level Security (RLS) policies
- Status tracking: pending → in_progress → completed
- Auto-update timestamps

### 4. Homepage Integration
**Locatie:** `/src/app/page.tsx`

De Quick Scan section is toegevoegd na de statistics bar, voor de Happy Sprint Machine section.

## 🚀 Setup Instructies

### Stap 1: Database Setup
Run het SQL script in je Supabase dashboard:

```bash
# Via Supabase SQL Editor
# Kopieer de inhoud van quick-scan-table.sql en voer uit
```

Of via command line:
```bash
psql -h [your-supabase-host] -U postgres -d postgres -f quick-scan-table.sql
```

### Stap 2: Environment Variables (Optional)
Als je n8n notificaties wilt:

```env
# .env.local
N8N_QUICK_SCAN_WEBHOOK_URL=https://your-n8n-instance.com/webhook/quick-scan
```

### Stap 3: Test de Form
1. Start dev server: `npm run dev`
2. Ga naar homepage
3. Scroll naar "Krijg je persoonlijke AI Quick Scan"
4. Vul form in en submit
5. Check Supabase database voor nieuwe entry
6. Check n8n webhook logs (indien geconfigureerd)

## 📊 Database Fields Uitleg

```sql
id              UUID        -- Auto-generated unique ID
name            TEXT        -- Naam van de aanvrager
email           TEXT        -- Email voor follow-up
website         TEXT        -- Bedrijfswebsite voor analyse
challenge       TEXT        -- Optional beschrijving van uitdaging
created_at      TIMESTAMP   -- Wanneer aangevraagd
status          TEXT        -- pending | in_progress | completed
notes           TEXT        -- Interne notities over scan results
updated_at      TIMESTAMP   -- Laatst bijgewerkt
```

## 🔔 n8n Webhook Setup (Optional)

### Webhook Payload
Wanneer een Quick Scan wordt aangevraagd, stuurt de API dit naar je n8n webhook:

```json
{
  "name": "Jan Jansen",
  "email": "jan@bedrijf.nl",
  "website": "https://bedrijf.nl",
  "challenge": "We verliezen veel tijd aan...",
  "submission_id": "uuid",
  "submitted_at": "2025-12-07T10:30:00Z"
}
```

### Voorbeeld n8n Workflow
1. **Webhook Trigger** - Ontvang submission
2. **Supabase Node** - Update status naar 'in_progress'
3. **HTTP Request** - Scrape website voor analyse
4. **OpenAI Node** - Genereer AI opportunities
5. **Gmail Node** - Stuur email naar team
6. **Gmail Node** - Stuur bevestiging naar klant
7. **Supabase Node** - Update status naar 'completed'

## 🎯 Follow-up Process

### Binnen 48 uur leveren:
1. **3-5 concrete AI automation opportunities**
   - Specifiek voor hun bedrijf/industrie
   - Met geschatte tijdsbesparing
   - Met ROI inschatting

2. **Format:**
   - PDF of professional email
   - Visuals (screenshots/diagrams)
   - Call-to-action voor kennismakingsgesprek

3. **Template structuur:**
   ```
   Hoi [Naam],
   
   Bedankt voor je interesse in een AI Quick Scan!
   
   Op basis van [website] hebben we 5 concrete mogelijkheden gevonden:
   
   1. [Use Case]: [Description]
      - Tijdsbesparing: X uur/week
      - Implementatie: 1-2 weken
      - ROI: € X/jaar
   
   2. [...]
   
   Wil je hier meer over weten? Plan een gratis gesprek:
   [Calendar link]
   ```

## 📝 Admin View (TODO)
Je kunt een admin pagina maken om submissions te bekijken:

**Suggestie:** `/src/app/dashboard/quick-scans/page.tsx`
- Lijst van alle submissions
- Filter op status
- Bulk actions (mark as completed, etc)
- Export naar CSV

## 🔒 Security Notes
- RLS policies zorgen dat:
  - Iedereen (anon) kan submissions aanmaken
  - Alleen authenticated users kunnen lezen/updaten
- Email/URL validatie server-side
- Rate limiting zou toegevoegd kunnen worden (TODO)

## 🎨 Styling Aanpassingen
Alle styling gebruikt Shadcn components en kan aangepast worden in:
- `/src/components/quick-scan-form.tsx` - Component styling
- Tailwind classes voor responsive design
- Theme variables voor kleuren

## 📈 Analytics (TODO)
Overweeg toe te voegen:
- Google Analytics event tracking
- Conversion rate monitoring
- A/B testing van copy
- Source tracking (waar komen submissions vandaan)

## ✅ Checklist voor Live Gaan
- [ ] SQL script uitgevoerd in productie Supabase
- [ ] Test submission gedaan
- [ ] n8n webhook werkend (indien gewenst)
- [ ] Follow-up proces gedefinieerd
- [ ] Team getraind op hoe te reageren
- [ ] Email templates klaar
- [ ] Calendar link geconfigureerd in emails

