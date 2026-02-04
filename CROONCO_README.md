# CROONCO Dashboard - Quick Start Guide

## 🎯 Overzicht

CROONCO heeft nu een dedicated multi-tenant dashboard voor het beheren en monitoren van hun N8N automatiseringen.

## 🔐 Login Gegevens

**URL:** http://localhost:3333/login (development) of je productie URL

**Credentials:**
- **Email:** `info@croonco.nl`
- **Password:** `croonco123`

## 📊 Dashboard Features

### 1. Automatiseringen Overzicht

Na login zie je direct:
- **Actieve Automatiseringen**: Aantal ready-to-use workflows
- **Totaal Uitgevoerd**: Totaal aantal executions
- **Success Rate**: Percentage succesvolle runs
- **Gefaalde Runs**: Aantal errors die aandacht nodig hebben

### 2. Workflow Trigger Cards

Elke automatisering heeft zijn eigen card met:
- **Grote trigger knop**: Start de automatisering met één klik
- **Status indicator**: Laatste run status (success/failed)
- **Description**: Wat doet deze automatisering
- **Recente runs**: Laatste 3 uitvoeringen met status

#### Geconfigureerde Automatiseringen

**✅ Zaken schikken**
- Status: Actief en ready to use
- Functie: Automatische verwerking van zakelijke schikkingen
- Webhook: `https://guidocroon.com/n8n/webhook/cf0b17f2-527e-4058-9c64-1dfe008e515f`

**🔧 Verzoekschriften analyseren**
- Status: Configuratie vereist
- Functie: AI-analyse van juridische verzoekschriften  
- Webhook: Moet nog worden ingesteld in N8N
- Zie: `CROONCO_WEBHOOK_SETUP.md` voor configuratie instructies

### 3. Real-time Analytics

Het dashboard toont live statistieken:

**Success Rate Pie Chart**
- Visuele verdeling van success vs failed executions
- Direct inzicht in betrouwbaarheid

**Execution Timeline** (wanneer data beschikbaar)
- Line chart met executions over tijd
- Laatste 7 dagen trend
- Success en error lines apart

### 4. Execution History

Voor elke automatisering zie je:
- Datum en tijd van uitvoering
- Status (success/error/running)
- Duration (hoe lang duurde het)
- Trigger source (dashboard/scheduled/webhook)

## 🚀 Gebruik

### Stap 1: Login

1. Ga naar het dashboard
2. Klik op "Inloggen" of gebruik direct button "CROONCO"
3. Je wordt ingelogd met CROONCO credentials

### Stap 2: Start een Automatisering

1. Klik op de **"Start [Workflow naam]"** knop
2. Wacht op bevestiging (groene success message)
3. De automatisering draait nu in N8N
4. Check de execution history voor resultaat

### Stap 3: Monitor Resultaten

1. Na triggeren zie je direct feedback
2. Binnen 2 seconden refresht de execution list
3. Check status: groen vinkje = success, rood kruis = error
4. Bekijk execution details in N8N voor meer info

### Stap 4: Analytics Bekijken

Scroll naar beneden voor:
- Success rate distribution
- Execution timeline trends
- Overall performance metrics

## 🔧 Configuratie

### Tweede Automatisering Activeren

Als "Verzoekschriften analyseren" nog setup nodig heeft:

1. Zie `CROONCO_WEBHOOK_SETUP.md` voor stap-voor-stap instructies
2. Configureer de webhook in N8N
3. Update de webhook URL in `src/lib/company-workflows.ts`
4. Herstart de applicatie
5. De automatisering is nu beschikbaar in het dashboard!

### N8N API Integratie (Optioneel)

Voor live execution history en detailed analytics:

1. Maak API key aan in N8N: `https://guidocroon.com/n8n/settings/api`
2. Voeg toe aan `.env.local`:
   ```
   N8N_API_KEY=n8n_api_your-key-here
   ```
3. Herstart de server
4. Dashboard haalt nu real-time data uit N8N

## 📱 Mobile Responsive

Het dashboard werkt op alle devices:
- Desktop: Volledige features en charts
- Tablet: Optimized layout
- Mobile: Touch-friendly buttons en compact view

## 🔔 Notificaties

Bij triggeren van automatisering:
- ✅ **Success**: Groene alert met bevestiging
- ❌ **Error**: Rode alert met error message
- ⏳ **Loading**: Knop toont "Wordt gestart..." tijdens execution

## 📈 Performance

### Auto-refresh

- Dashboard refresht automatisch elke 30 seconden
- Houdt execution data up-to-date
- Geen handmatige refresh nodig

### Real-time Updates

- Trigger feedback binnen seconden
- Execution status updates automatisch
- Charts updaten bij nieuwe data

## 🛠️ Troubleshooting

### Probleem: Automatisering start niet

**Check:**
1. Is de workflow actief in N8N?
2. Is de webhook URL correct?
3. Staat er een error message in het dashboard?
4. Check N8N logs voor details

### Probleem: Geen execution history

**Mogelijke oorzaken:**
1. N8N API key niet geconfigureerd
2. Workflow nog niet uitgevoerd
3. Workflow ID niet correct

**Oplossing:**
- Configureer N8N API key in .env.local
- Trigger de workflow enkele keren
- Wacht 30 seconden voor auto-refresh

### Probleem: Dashboard laadt niet

**Check:**
1. Ben je ingelogd met correcte credentials?
2. Is de dev server running? (`npm run dev`)
3. Check browser console voor errors
4. Clear browser cache en reload

## 🔐 Security

### Multi-tenant Isolatie

- CROONCO ziet alleen eigen workflows
- Andere klanten hebben geen toegang tot CROONCO data
- Elke company heeft eigen dashboard view

### Webhook Security

Best practices:
- Gebruik HTTPS webhooks
- Overweeg authentication headers
- Monitor for unusual activity
- Rate limiting in production

## 📞 Support

Bij vragen of problemen:
- **Email:** info@aisprintstudio.nl
- **Documentation:** Zie `CROONCO_WEBHOOK_SETUP.md`
- **N8N Issues:** Check N8N execution logs
- **Dashboard Issues:** Check browser console

## 🎓 Training Resources

### Video Tutorials (To Do)
- Dashboard walkthrough
- Triggering workflows
- Reading analytics
- Troubleshooting common issues

### Documentation
- `CROONCO_WEBHOOK_SETUP.md` - Webhook configuratie
- `TROUBLESHOOTING.md` - General troubleshooting
- `LOGIN_SYSTEM.md` - Authentication details

## 🚦 Status Indicators

**Badge Kleuren:**
- 🟢 **Groen (Success)**: Workflow completed successfully
- 🔴 **Rood (Failed)**: Error occurred, needs attention  
- 🟡 **Geel (Setup)**: Configuration required
- ⚪ **Grijs (Inactive)**: Workflow not active

## 💡 Pro Tips

1. **Batch Triggering**: Je kunt meerdere workflows snel na elkaar triggeren
2. **Bookmark Dashboard**: Sla de dashboard URL op voor quick access
3. **Monitor Success Rate**: Hou 90%+ aan voor optimale performance
4. **Check N8N Logs**: Voor detailed debugging ga naar N8N dashboard
5. **Use Demo First**: Test workflows eerst met demo data

## 📊 Metrics to Watch

**Key Performance Indicators:**
- Success Rate > 90%
- Average execution time < 30s
- Failed runs = 0 (ideaal)
- Daily execution count (volume)

## 🔄 Updates & Maintenance

### Weekly
- Check success rates
- Review failed executions
- Clean up old execution data

### Monthly
- Review workflow efficiency
- Optimize slow workflows
- Update documentation

### Quarterly
- Performance review meeting
- New automation opportunities
- Training refresher

## 🎯 Roadmap

Komende features:
- [ ] Email notifications voor failed runs
- [ ] Scheduled workflow triggers vanuit dashboard
- [ ] Custom date range voor analytics
- [ ] Export execution data to CSV
- [ ] Advanced filtering opties
- [ ] Workflow templates library
- [ ] Mobile app (future)

## ✅ Quick Checklist

- [ ] Login credentials werken
- [ ] "Zaken schikken" kan getriggerd worden
- [ ] Execution history is zichtbaar
- [ ] Analytics charts tonen data
- [ ] "Verzoekschriften analyseren" is geconfigureerd (of in setup)
- [ ] Notificaties werken bij triggering
- [ ] Dashboard is gebookmarked
- [ ] Team is getraind in gebruik

## 📝 Feedback

Help ons het dashboard te verbeteren:
- Wat werkt goed?
- Wat kan beter?
- Welke features mis je?
- Zijn er bugs?

Stuur feedback naar: info@aisprintstudio.nl

---

**Laatste update:** Oktober 2025
**Versie:** 1.0
**Contact:** AI Sprint Studio - Happy Sprint Machine 🚀









