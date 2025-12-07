# Environment Variables Setup

## Supabase Configuration

De database is opgeschoond en klaar voor AI Sprint Studio. Voeg deze variabelen toe aan je `.env.local` file:

```bash
# Supabase Configuration (moneytool database - opgeschoond voor AI Sprint Studio)
NEXT_PUBLIC_SUPABASE_URL=https://mbfpkjrvjuuzajgjbbpv.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iZnBranJ2anV1emFqZ2piYnB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzQ0MTEsImV4cCI6MjA3NzQxMDQxMX0.LX_PXLI0FQBwSIl9_-FFPfUYrCKPNTJ934tab6ipPHY

# Service Role Key (get this from Supabase Dashboard > Settings > API > service_role key)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI API (voor embeddings - als je dit hebt)
OPENAI_API_KEY=your-openai-api-key-here
```

## Project Naam Aanpassen

De project naam kan niet via MCP worden aangepast, maar je kunt dit handmatig doen:

1. Ga naar https://supabase.com/dashboard
2. Selecteer het project "moneytool"
3. Ga naar **Settings** → **General**
4. Klik op **Edit** naast de project naam
5. Wijzig naar: **AI Sprint Studio - Data Library**
6. Klik **Save**

## Database Status

✅ **Database opgeschoond**
- Oude moneytool tabellen verwijderd
- Nieuwe AI Sprint Studio tabellen aangemaakt

✅ **Tabellen aangemaakt:**
- `projects` - Voor het beheren van projecten
- `documents` - Voor document opslag
- `document_chunks` - Voor RAG met vector embeddings

✅ **Extensions geïnstalleerd:**
- `uuid-ossp` - Voor UUID generatie
- `vector` - Voor pgvector embeddings

✅ **Indexes & Functions:**
- Performance indexes aangemaakt
- Vector similarity search function
- RLS policies geconfigureerd

✅ **Storage Bucket:**
- `documents` bucket aangemaakt (private, 10MB limit)
- Storage policies geconfigureerd
- Toegestane file types: PDF, TXT, MD, CSV

## ✅ Alles is klaar!

De database en storage zijn volledig geconfigureerd. Je hoeft alleen nog:

1. ✅ Zorg dat `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` staat (staat er al volgens jou)
2. ✅ Zorg dat `OPENAI_API_KEY` in `.env.local` staat (nodig voor embeddings/RAG)
3. ✅ Restart je development server: `npm run dev`
4. ✅ Test de Data Library op `/dashboard/data-library`

De database is nu klaar voor gebruik! 🚀

## 🎯 Wat je nu kunt doen:

1. **Projecten aanmaken** in `/dashboard/data-library`
2. **Documenten uploaden** naar projecten (PDF, TXT, MD, CSV)
3. **Documenten worden automatisch verwerkt:**
   - Tekst wordt geëxtraheerd
   - Opgesplitst in chunks
   - Embeddings worden gegenereerd
   - Opgeslagen in database voor RAG
4. **RAG gebruiken in Chat:**
   - Ga naar `/dashboard/chat`
   - Selecteer een project
   - Stel vragen - AI krijgt context uit je documenten! 🎉

