# Troubleshooting Guide

## ✅ Opgelost: Internal Server Error

### Probleem
Internal Server Error bij het starten van de applicatie op poort 3333.

### Oorzaak
`localStorage` werd aangeroepen tijdens server-side rendering, wat niet beschikbaar is in Node.js.

### Oplossing
Alle `localStorage` calls zijn nu beveiligd met `typeof window !== 'undefined'` checks in `/src/contexts/auth-context.tsx`.

## 🚀 Server Starten op Poort 3333

### Normale start
```bash
npm run dev
```

De server start automatisch op: **http://localhost:3333**

### Als poort 3333 al in gebruik is

**Stap 1: Vind het proces**
```bash
lsof -ti:3333
```

**Stap 2: Stop het proces**
```bash
kill -9 $(lsof -ti:3333)
```

**Stap 3: Start opnieuw**
```bash
npm run dev
```

### Alternatief: Gebruik een andere poort
```bash
# In package.json verander:
"dev": "next dev -p 3334"

# Of direct:
npm run dev -- -p 3334
```

## 🔍 Veelvoorkomende Errors

### 1. EADDRINUSE Error
**Error:** `listen EADDRINUSE: address already in use :::3333`

**Oplossing:**
```bash
# Stop de oude server
kill -9 $(lsof -ti:3333)

# Start opnieuw
npm run dev
```

### 2. localStorage is not defined
**Error:** `ReferenceError: localStorage is not defined`

**Oorzaak:** Server-side rendering probeert localStorage te gebruiken

**Oplossing:** ✅ Al opgelost! Gebruik altijd:
```typescript
if (typeof window !== 'undefined') {
  localStorage.getItem('key');
}
```

### 3. Hydration Errors
**Error:** `Hydration failed because the initial UI does not match...`

**Oplossing:** Zorg dat server en client dezelfde output genereren. Gebruik `useEffect` voor browser-only code.

### 4. Module not found
**Error:** `Module not found: Can't resolve '@/components/...'`

**Oplossing:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🔐 Login Problemen

### Kan niet inloggen
1. **Check credentials:**
   - Admin: `admin@aisprintstudio.nl` / `admin123`
   - Klant 1: `klant1@bedrijf.nl` / `demo123`
   - Klant 2: `klant2@company.com` / `demo123`

2. **Check browser console:**
   - Open DevTools (F12)
   - Kijk naar Console tab voor errors

3. **Clear localStorage:**
   ```javascript
   // In browser console:
   localStorage.clear()
   location.reload()
   ```

### Automatisch uitgelogd
Check of `localStorage` cookies enabled zijn in je browser.

## 🎨 Styling Problemen

### Tailwind classes werken niet
```bash
# Rebuild
npm run build
npm run dev
```

### Dark mode werkt niet
Check of ThemeProvider correct is geïmplementeerd in `app/layout.tsx`.

## 📦 Build Problemen

### Build failed
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### TypeScript errors
```bash
# Check types
npx tsc --noEmit

# Fix auto-fixable issues
npm run lint -- --fix
```

## 🌐 Deployment Problemen

### Vercel Deployment
1. **Environment Variables:** Zorg dat alle env vars zijn ingesteld
2. **Build Command:** `npm run build`
3. **Output Directory:** `.next`

### Port Configuration
Voor productie gebruikt Next.js standaard poort 3000:
```bash
npm run build
npm run start
```

Voor custom poort:
```json
// package.json
{
  "scripts": {
    "start": "next start -p 3333"
  }
}
```

## 📝 Logs Bekijken

### Development Logs
Server logs verschijnen direct in je terminal waar je `npm run dev` hebt gedraaid.

### Browser Console
Open DevTools (F12) → Console tab

### Clear Cache
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install
```

## ✅ Quick Checklist

Wanneer je een error krijgt:

- [ ] Check terminal logs voor server errors
- [ ] Check browser console (F12) voor client errors
- [ ] Herstart dev server (`Ctrl+C` en `npm run dev`)
- [ ] Clear Next.js cache (`rm -rf .next`)
- [ ] Reinstall dependencies als laatste redmiddel
- [ ] Check of je op http://localhost:3333 bent (niet 3000!)

## 🆘 Hulp Nodig?

1. **Check de logs** - Meestal staat daar het probleem
2. **Google de error** - Next.js errors zijn goed gedocumenteerd
3. **Check Next.js docs** - https://nextjs.org/docs

## 🎯 Huidige Status

✅ Server draait op: **http://localhost:3333**
✅ Login werkt met demo accounts
✅ localStorage SSR probleem opgelost
✅ Multi-tenant systeem actief
✅ Dashboard beschermd met authentication

Je applicatie zou nu zonder errors moeten draaien! 🎉

