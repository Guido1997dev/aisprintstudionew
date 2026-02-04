# 🧪 Testing Guide - AI Sprint Studio Data Library

De server draait nu op **http://localhost:3333** met de nieuwe Supabase configuratie!

## ✅ Setup Status

- ✅ Database opgeschoond en klaar
- ✅ Tabellen aangemaakt (projects, documents, document_chunks)
- ✅ Storage bucket "documents" aangemaakt
- ✅ Vector extension enabled
- ✅ Server draait op poort 3333
- ✅ Environment variables geladen

## 🧪 Test Checklist

### 1. Test Database Connectie
- [ ] Ga naar `/dashboard/data-library`
- [ ] Check of de pagina laadt zonder errors
- [ ] Check browser console voor errors

### 2. Test Project Aanmaken
- [ ] Klik op "New Project"
- [ ] Vul een project naam in (bijv. "Test Project")
- [ ] Klik "Create Project"
- [ ] Check of het project verschijnt in de lijst

### 3. Test Document Upload
- [ ] Klik op een project om details te zien
- [ ] Upload een PDF, TXT, MD of CSV bestand
- [ ] Check of het bestand wordt geüpload
- [ ] Check document status (uploading → processing → ready)

### 4. Test RAG Functionaliteit
- [ ] Ga naar `/dashboard/chat`
- [ ] Selecteer een project met ready documents
- [ ] Stel een vraag over de documenten
- [ ] Check of RAG context wordt meegestuurd

### 5. Test Vector Search
- [ ] Check of embeddings worden gegenereerd tijdens document processing
- [ ] Test vector similarity search via `/api/rag/search`

## 🐛 Troubleshooting

### Error: "Supabase is not configured"
- Check of `.env.local` bestaat en de juiste variabelen heeft
- Restart de server: `npm run dev`
- Check browser console voor specifieke errors

### Error: "Projects table does not exist"
- Database migratie is al uitgevoerd
- Check Supabase Dashboard > Table Editor om te bevestigen dat tabellen bestaan

### Error: "Storage bucket not found"
- Storage bucket is al aangemaakt
- Check Supabase Dashboard > Storage om te bevestigen

### Documents blijven "processing"
- Check of `OPENAI_API_KEY` is ingesteld
- Check server logs voor embedding errors
- Documenten kunnen niet verwerkt worden zonder OpenAI API key

## 📊 Expected Behavior

1. **Project aanmaken:** Direct zichtbaar in project list
2. **Document upload:** 
   - Status: uploading → processing → ready (of error)
   - Processing duurt 10-30 seconden afhankelijk van bestandsgrootte
3. **RAG search:** 
   - Werkt alleen met "ready" documenten
   - Retourneert top 5 relevante chunks

## 🎯 Next Steps

Als alles werkt:
1. ✅ Upload test documenten
2. ✅ Test RAG queries in chat
3. ✅ Configureer n8n webhook voor AI responses
4. ✅ Customize RAG parameters indien nodig

Veel succes met testen! 🚀





