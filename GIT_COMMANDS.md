# 🚀 Git Commands voor AI Sprint Studio

## Quick Push naar GitHub

```bash
cd "/Users/guidocroon/AI sprint studio shadcn"

# Voeg je GitHub repository toe als remote
git remote add origin https://github.com/Guido1997dev/aisprintstudionew.git

# Push naar GitHub
git branch -M main
git push -u origin main
```

## ✅ Na Eerste Push

Als je voor de eerste keer pusht, kan GitHub om authenticatie vragen:
- **Username**: Guido1997dev
- **Password**: Gebruik een Personal Access Token (zie hieronder)

## 🔐 Personal Access Token Aanmaken

1. Ga naar: https://github.com/settings/tokens
2. Klik "Generate new token" → "Classic"
3. Geef een naam: "AI Sprint Studio Deploy"
4. Selecteer scope: **repo** (alle repo rechten)
5. Klik "Generate token"
6. **Kopieer de token** (je ziet hem maar 1 keer!)
7. Gebruik deze als wachtwoord bij git push

## 📝 Versie Beheer - Dagelijkse Workflow

### Wanneer Je Wijzigingen Hebt Gemaakt

```bash
# Stap 1: Bekijk wat er veranderd is
git status

# Stap 2: Voeg alle wijzigingen toe
git add .

# Stap 3: Maak een commit met beschrijving
git commit -m "Beschrijf hier je wijzigingen"

# Stap 4: Push naar GitHub
git push
```

### Voorbeeld Commits

```bash
# Na team foto's toevoegen
git add .
git commit -m "Team foto's toegevoegd aan About pagina"
git push

# Na content wijziging
git add .
git commit -m "Homepage tekst aangepast"
git push

# Na nieuwe feature
git add .
git commit -m "Nieuwe workflow trigger functie toegevoegd"
git push
```

## 🔄 Waarom Versie Beheer?

### ✅ Voordelen

1. **Geschiedenis Bewaren**
   - Zie alle veranderingen die je ooit gemaakt hebt
   - Terug naar een eerdere versie als iets stuk gaat

2. **Backup**
   - Code staat veilig op GitHub
   - Zelfs als je laptop crasht, is alles veilig

3. **Samenwerken**
   - Jullie kunnen allebei aan de code werken
   - Git merged automatisch jullie wijzigingen

4. **Experiment Vrijheid**
   - Probeer nieuwe dingen zonder angst
   - Kan altijd terug naar werkende versie

### 📊 Hoe Het Werkt

```
Lokale Computer              GitHub (Remote)
     main ────────push──────►  main
       │                         │
       │◄────────pull──────────  │
     
commit history:              commit history:
├─ Update 3 ───────sync──────► Update 3
├─ Update 2 ───────sync──────► Update 2
└─ Initial ────────sync──────► Initial
```

## 🌿 Branches (Gevorderd)

Voor grotere features kun je branches gebruiken:

```bash
# Maak nieuwe branch voor feature
git checkout -b feature/nieuwe-dashboard-widget

# Werk aan je feature...
git add .
git commit -m "Dashboard widget toegevoegd"

# Push branch naar GitHub
git push -u origin feature/nieuwe-dashboard-widget

# Als feature klaar is, merge naar main
git checkout main
git merge feature/nieuwe-dashboard-widget
git push
```

## 🚨 Veelvoorkomende Situaties

### Iemand Anders Heeft Gepushed

```bash
# Haal eerst de laatste wijzigingen op
git pull

# Los eventuele conflicts op
# Dan kun je weer pushen
git push
```

### Je Wilt Lokale Wijzigingen Ongedaan Maken

```bash
# Zie wat er veranderd is
git status

# Gooi ALLE lokale wijzigingen weg (NIET PUSHEN!)
git reset --hard

# Of gooi 1 bestand weg
git checkout -- src/app/page.tsx
```

### Je Wilt Terug naar Eerdere Versie

```bash
# Bekijk geschiedenis
git log --oneline

# Ga terug naar specifieke commit
git checkout abc123  # gebruik de commit hash

# Ga terug naar laatste versie
git checkout main
```

## 📅 Aanbevolen Workflow

### Dagelijks

```bash
# Start van de dag: haal laatste versie op
git pull

# Werk aan code...

# Einde van de dag: sla op
git add .
git commit -m "Dag werk: omschrijving"
git push
```

### Voor Belangrijke Wijzigingen

```bash
# Voor grote update: maak branch
git checkout -b update/nieuwe-feature

# Werk aan feature
git add .
git commit -m "Feature deel 1"
git push

# Als feature klaar en getest is
git checkout main
git merge update/nieuwe-feature
git push
```

## 🏷️ Tags voor Versies

Handig voor releases:

```bash
# Tag een versie
git tag -a v1.0.0 -m "Eerste publieke release"
git push --tags

# Lijst van tags
git tag

# Terug naar een tag
git checkout v1.0.0
```

## 📋 Nuttige Commands Overzicht

```bash
# Status checken
git status

# Geschiedenis zien
git log --oneline --graph

# Verschillen zien
git diff

# Wijzigingen toevoegen
git add .                    # Alles
git add src/app/page.tsx     # Specifiek bestand

# Commit maken
git commit -m "Beschrijving"

# Pushen
git push

# Pullen (ophalen)
git pull

# Branch maken
git checkout -b naam

# Branch wisselen
git checkout main
git checkout feature-naam

# Branches zien
git branch -a

# Remote info
git remote -v
```

## 🎯 Best Practices

### ✅ DO

- **Commit vaak**: kleine, logische wijzigingen
- **Duidelijke messages**: "Wat" en "Waarom"
- **Pull voor push**: haal eerst laatste versie op
- **Test voor push**: controleer of alles werkt

### ❌ DON'T

- **Grote commits**: niet alles tegelijk
- **Vage messages**: niet "update" of "fix"
- **Force push**: vermijd `git push --force`
- **Secrets committen**: geen API keys in code

## 🔒 Belangrijk: .gitignore

Al ingesteld! Deze bestanden worden NIET gecommit:
- ✅ `.env.local` - API keys blijven lokaal
- ✅ `node_modules/` - niet nodig op GitHub
- ✅ `.next/` - build output

## 📱 GitHub Desktop (Alternatief)

Als je liever een visuele tool wilt:

1. Download: https://desktop.github.com
2. Log in met je GitHub account
3. Clone je repository
4. Gebruik de GUI voor commit/push/pull

## 🎓 Leren Meer

- **GitHub Guides**: https://guides.github.com
- **Git Basics**: https://git-scm.com/book/en/v2
- **Interactive Tutorial**: https://learngitbranching.js.org

## 🚀 Start Nu!

1. **Kopieer de commands** van bovenaan dit bestand
2. **Plak in terminal** en voer uit
3. **Push naar GitHub** en zie je code online!

```bash
# Copy-paste ready:
cd "/Users/guidocroon/AI sprint studio shadcn"
git remote add origin https://github.com/Guido1997dev/aisprintstudionew.git
git branch -M main
git push -u origin main
```

**Done!** Je code staat nu op GitHub! 🎉

---

## 💡 Tip: VS Code Git Integratie

VS Code heeft ingebouwde Git support:
- Sidebar: Source Control icoon
- Zie alle wijzigingen visueel
- Commit met 1 klik
- Makkelijker dan terminal commands

