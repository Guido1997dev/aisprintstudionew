# 📚 Versie Beheer Uitgelegd voor AI Sprint Studio

## 🤔 Wat is Versie Beheer?

Versie beheer (Git) is zoals **"Ongedaan maken" voor je hele project**, maar dan veel krachtiger!

### Simpele Analogie

Stel je voor dat je aan een Word document werkt:
- Word heeft "Ongedaan maken" (Ctrl+Z)
- Maar je kunt maar een paar stappen terug
- Als je Word sluit, is de geschiedenis weg

**Git is als:**
- Oneindig "Ongedaan maken"
- Voor je HELE project
- Geschiedenis blijft voor altijd
- Je kunt naar ELKE versie terug
- Plus: automatische backup naar internet (GitHub)

## 📖 Het Verhaal van Git

```
Dag 1: Je begint met code
│
├─ Commit: "Initial project"
│  └─ 10 bestanden
│
Dag 2: Je voegt een feature toe
│
├─ Commit: "Dashboard toegevoegd"
│  └─ 5 nieuwe bestanden, 3 aangepast
│
Dag 3: Je past styling aan
│
├─ Commit: "Kleuren aangepast naar oranje"
│  └─ 2 bestanden aangepast
│
Dag 4: Oh nee, bug!
│
├─ Commit: "Bug fix in dashboard"
│  └─ 1 bestand aangepast
│
Nu kun je terug naar ELKE van deze punten!
```

## 🎯 Waarom is Dit Handig?

### 1. **Veiligheidsnet** 🛡️

**Zonder Git:**
```
Je: *Past code aan*
Code: *Gaat stuk*
Je: "Hoe was het ook alweer??"
Je: *Paniek* 😱
```

**Met Git:**
```
Je: *Past code aan*
Code: *Gaat stuk*
Je: git checkout HEAD~1
Code: *Werkt weer!*
Je: *Opgelucht* 😌
```

### 2. **Experiment Vrijheid** 🧪

```
Huidige Versie (WERKT!)
│
├─ Branch: experiment
│  └─ Probeer nieuwe feature
│     ├─ Werkt niet? → Gooi weg
│     └─ Werkt wel? → Merge naar main
│
Nog steeds werkende versie!
```

### 3. **Samenwerking** 👥

```
Jij:                    GitHub:                 Collega:
│                          │                        │
├─ Commit: Feature A ──────►                       │
│                          │                        │
│                          │  ◄──── Commit: Feature B
│                          │                        │
├─ Pull ◄──── Sync ───────►                       │
│                          │                        │
Jij hebt nu beide features!
```

## 🏃 Snelle Start voor Beginners

### De 3 Basis Commando's

```bash
# 1. OPSLAAN (lokaal)
git add .
git commit -m "Wat je deed"

# 2. UPLOADEN (naar GitHub)
git push

# 3. DOWNLOADEN (van GitHub)
git pull
```

Dat is eigenlijk alles wat je nodig hebt! 🎉

## 🗺️ Git Workflow Visueel

```
JOUW COMPUTER                    GITHUB
┌─────────────────┐             ┌─────────────────┐
│  Working Dir    │             │   Repository    │
│  (je bestanden) │             │   (online)      │
├─────────────────┤             ├─────────────────┤
│                 │             │                 │
│  [wijzig code]  │             │                 │
│       │         │             │                 │
│       ▼         │             │                 │
│   git add .     │             │                 │
│       │         │             │                 │
│       ▼         │             │                 │
│ git commit -m   │             │                 │
│       │         │             │                 │
│       ▼         │             │                 │
│   git push ─────┼────────────►│   Opgeslagen!   │
│                 │             │                 │
│                 │             │   [collega pushed]
│                 │             │        │        │
│                 │             │        ▼        │
│   git pull ◄────┼─────────────┤   Sync          │
│       │         │             │                 │
│       ▼         │             │                 │
│  [nieuwe code]  │             │                 │
└─────────────────┘             └─────────────────┘
```

## 💭 Wanneer Commit Je?

### ✅ GOED

```
git commit -m "Team foto's toegevoegd"        // 1 feature
git commit -m "Homepage tekst vertaald"       // 1 wijziging
git commit -m "Bug in dashboard opgelost"     // 1 fix
```

### ❌ SLECHT

```
git commit -m "Stuff"                         // Onduidelijk
git commit -m "update"                        // Te vaag
git commit -m "Foto's, tekst, bug, css, en meer..."  // Te veel
```

### 📏 Vuistregel

**1 Commit = 1 Logische Wijziging**

- Toegevoegd: 1 feature → 1 commit
- Gefixt: 1 bug → 1 commit
- Aangepast: 1 pagina → 1 commit

## 🌿 Branches Uitgelegd

Een branch is een **parallel universum** voor je code:

```
main branch (PRODUCTIE - altijd werkend!)
│
├─ v1.0.0: Website live
│
├─────► [nieuwe branch: feature/team-page]
│       │
│       ├─ Experiment 1
│       ├─ Experiment 2
│       └─ Tests
│              │
│              ▼
│       ✅ Het werkt!
│              │
├─◄────┘ MERGE
│
├─ v1.1.0: Team page nu live!
```

### Waarom Branches?

**Zonder branch:**
```
main: Werkende website
     ↓
     [Wijzig veel code]
     ↓
main: ALLES STUK! 😱
     Bezoekers zien kapotte site!
```

**Met branch:**
```
main: Werkende website ✅
     ↓
feature: [Wijzig veel code]
     ↓
feature: Test alles ✅
     ↓
main: Merge feature → Werkende website met nieuwe functie! 🎉
```

## 📊 Praktijk Scenario's

### Scenario 1: Je Werkt Alleen

```bash
# Maandag ochtend
git pull              # Haal laatste versie

# Werk aan code...
# ...

# Maandag avond
git add .
git commit -m "Dashboard styling aangepast"
git push              # Sla op naar GitHub
```

### Scenario 2: Samenwerken

```bash
# Jij werkt aan feature A
git checkout -b feature/a
# Werk...
git commit -m "Feature A done"
git push

# Collega werkt aan feature B
# (op zijn computer)
git checkout -b feature/b
git commit -m "Feature B done"
git push

# Later: merge beide
git checkout main
git pull              # Haal feature B op
git merge feature/a   # Voeg jouw feature toe
git push              # Beide features nu live!
```

### Scenario 3: Oeps, Bug!

```bash
# Je merkt een bug
git status            # Wat is er veranderd?
git log --oneline     # Wanneer ging het mis?

# Terug naar werkende versie
git checkout abc123   # Gebruik hash van werkende versie

# Of: fix de bug
git checkout main
# Fix bug...
git add .
git commit -m "HOTFIX: Dashboard bug opgelost"
git push
```

## 🎓 Leer Curve

### Week 1: Basis
```bash
git add .
git commit -m "..."
git push
git pull
```
→ 80% van je dagelijks werk!

### Week 2-4: Branches
```bash
git branch
git checkout -b naam
git merge
```
→ Voor grotere features

### Maand 2+: Geavanceerd
```bash
git rebase
git cherry-pick
git stash
```
→ Als je écht de pro wilt worden

## 🚀 Voor AI Sprint Studio

### Aanbevolen Workflow

**Dagelijks:**
```bash
# Start
git pull

# Werk...
# Werk...

# Einde
git add .
git commit -m "Beschrijf je werk"
git push
```

**Voor Grote Features:**
```bash
# Nieuwe feature
git checkout -b feature/nieuwe-dashboard-widget

# Werk...
git commit -m "Widget basis"
git commit -m "Widget styling"
git commit -m "Widget data binding"

# Test alles
# Als het werkt:
git checkout main
git merge feature/nieuwe-dashboard-widget
git push
```

## 💡 Pro Tips

### 1. **Commit Messages Template**

```
[TYPE]: Korte beschrijving

Types:
- FEATURE: Nieuwe functionaliteit
- FIX: Bug fix
- STYLE: Styling aanpassingen
- DOCS: Documentatie
- REFACTOR: Code verbetering

Voorbeelden:
- FEATURE: Team foto's toegevoegd aan About pagina
- FIX: Dashboard laadt nu correct op mobile
- STYLE: Oranje kleur aangepast naar brand colors
```

### 2. **Commit Vaak!**

Beter 10 kleine commits dan 1 grote:
```bash
git commit -m "Header toegevoegd"
git commit -m "Header styling"
git commit -m "Header responsive gemaakt"
```

vs.

```bash
git commit -m "Hele homepage gemaakt"  # Moeilijk terug te draaien!
```

### 3. **Pull Voor Push**

```bash
# ALTIJD eerst:
git pull

# DAN pas:
git push
```

Dit voorkomt conflicts!

## 🎯 Samenvatting

### Waarom Git?
- ✅ Veiligheidsnet voor je code
- ✅ Automatische backup
- ✅ Geschiedenis van alles
- ✅ Samenwerken zonder chaos
- ✅ Experiment zonder angst

### Basis Workflow
```bash
git pull              # Haal laatste op
# ... werk ...
git add .             # Selecteer wijzigingen
git commit -m "..."   # Sla op
git push              # Upload
```

### Is Het De Moeite?

**100% JA!** 🎉

Na een week gebruik is het net zo natuurlijk als "Opslaan" in Word.
En je vraagt je af hoe je ooit zonder werkte!

---

## 🚀 Start Nu!

1. Bekijk `GIT_COMMANDS.md` voor exacte commando's
2. Of run `QUICK_DEPLOY.sh` voor automatische push
3. Begin met de basis 3 commando's
4. De rest komt vanzelf!

**Happy Coding!** 🎨

