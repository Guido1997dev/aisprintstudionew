# Team Foto's Toevoegen

## 📸 Instructies

Je hebt 2 team foto's die toegevoegd moeten worden aan de website.

### Stap 1: Foto's Opslaan

Sla de twee team foto's op in de volgende locatie:

```
/Users/guidocroon/AI sprint studio shadcn/public/team/
```

### Aanbevolen bestandsnamen:
- `team-member-1.jpg` (de foto met de donkerblauwe trui)
- `team-member-2.jpg` (de foto met de beige/tan trui)

### Stap 2: Optimale Afmetingen

Voor de beste kwaliteit:
- **Breedte**: 800px
- **Hoogte**: 1000px  
- **Format**: JPG of WebP
- **Kwaliteit**: 80-90%

### Stap 3: Namen Toevoegen

Bewerk het bestand: `/Users/guidocroon/AI sprint studio shadcn/src/app/about/page.tsx`

Zoek naar de `teamMembers` array en pas de namen aan:

```typescript
const teamMembers = [
  {
    name: 'Jouw Naam Hier',  // ← Pas aan
    role: 'Co-Founder & AI Sprint Lead',
    image: '/team/team-member-1.jpg',
    description: 'Expert in...'  // ← Pas aan
  },
  {
    name: 'Jouw Naam Hier',  // ← Pas aan
    role: 'Co-Founder & Automation Specialist',
    image: '/team/team-member-2.jpg',
    description: 'Specialist in...'  // ← Pas aan
  },
];
```

## ✅ Checklist

- [ ] Foto 1 opgeslagen als `/public/team/team-member-1.jpg`
- [ ] Foto 2 opgeslagen als `/public/team/team-member-2.jpg`
- [ ] Namen aangepast in `about/page.tsx`
- [ ] Beschrijvingen aangepast in `about/page.tsx`
- [ ] Website gerefreshed in browser

## 🎨 De Over Ons pagina bevat:

- Hero sectie met team intro
- Team member cards met foto's
- Happy Sprint Machine uitleg
- Waarom AI Sprint Studio
- Call-to-action

De pagina is live op: **http://localhost:3333/about**

