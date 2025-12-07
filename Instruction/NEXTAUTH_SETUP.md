# NextAuth.js Setup - Google & Email Authentication

## ✅ Wat is Geïmplementeerd

### 1. **NextAuth.js v5** Integratie
- Google OAuth 2.0 provider
- Credentials provider (email/wachtwoord)
- JWT session strategy
- Multi-tenant support met company/role

### 2. **Dummy Accounts** (Behouden voor Development)
| Email | Wachtwoord | Rol | Company |
|-------|-----------|-----|---------|
| `admin@aisprintstudio.nl` | `admin123` | Admin | AI Sprint Studio |
| `info@croonco.nl` | `croonco123` | User | CROONCO |
| `klant1@bedrijf.nl` | `demo123` | User | Bedrijf A |
| `klant2@company.com` | `demo123` | User | Company B |

### 3. **Files Gewijzigd/Aangemaakt**
- ✅ `src/app/api/auth/[...nextauth]/route.ts` - NextAuth configuratie
- ✅ `src/components/providers.tsx` - SessionProvider toegevoegd
- ✅ `src/app/login/page.tsx` - Google Sign-In knop + demo accounts
- ✅ `src/components/protected-route.tsx` - NextAuth session checking
- ✅ `src/contexts/auth-context.tsx` - Backward compatible met NextAuth
- ✅ `.env.local` - Environment variables

## 🔧 Setup Stappen

### Stap 1: Google Cloud Project Aanmaken

1. Ga naar [Google Cloud Console](https://console.cloud.google.com)
2. Maak nieuw project aan
3. Enable Google+ API
4. Ga naar "Credentials" → "Create OAuth 2.0 Client ID"
5. Kies "Web application"
6. Voeg authorized redirect URIs toe:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Kopieer Client ID en Client Secret

### Stap 2: Environment Variables Configureren

Update `.env.local`:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**NEXTAUTH_SECRET genereren:**
```bash
openssl rand -base64 32
```

### Stap 3: Server Starten

```bash
npm run dev
```

## 🎯 User Flows

### Flow 1: Google Login
1. Klik "Inloggen met Google"
2. Autoriseer applicatie
3. Automatisch doorgestuurd naar dashboard

### Flow 2: Demo Account Login
1. Klik demo account button (Admin, CROONCO, etc)
2. Email/wachtwoord auto-filled
3. Klik "Inloggen"
4. Doorgestuurd naar dashboard

### Flow 3: Email/Wachtwoord Login
1. Voer email en wachtwoord in
2. Klik "Inloggen"
3. Doorgestuurd naar dashboard

## 📊 Architectuur

```
Login Page
├── Google Sign-In Button → Google OAuth
├── Email/Password Form → Credentials Provider
└── Demo Account Buttons → Auto-fill + Credentials

NextAuth API Route
├── Google Provider → OAuth callback
├── Credentials Provider → Demo users validation
└── JWT Callbacks → Add company/role to token

Session Management
├── JWT Token (secure)
├── Company & Role info
└── User data in context

Protected Routes
├── Check session status
├── Redirect to login if needed
└── Show loading state
```

## 🔐 Security Features

- ✅ JWT tokens (secure, stateless)
- ✅ NEXTAUTH_SECRET required
- ✅ Credentials hashed in memory (demo only)
- ✅ Google OAuth 2.0 (industry standard)
- ✅ Multi-tenant isolation via company field
- ✅ Role-based access control

## 🚀 Production Deployment

### Vercel
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXTAUTH_URL=https://yourdomain.com`
   - `NEXTAUTH_SECRET=your-secret`
   - `GOOGLE_CLIENT_ID=...`
   - `GOOGLE_CLIENT_SECRET=...`
4. Deploy

### Other Platforms
Zorg dat deze env vars zijn ingesteld:
- `NEXTAUTH_URL` (production URL)
- `NEXTAUTH_SECRET` (random string)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## 📝 API Routes

### GET/POST `/api/auth/[...nextauth]`
- Handles all NextAuth flows
- Google OAuth callback
- Credentials validation
- Session management

## 🔄 Session Data

```typescript
session.user = {
  email: string,
  name: string,
  image?: string,
  company: string,      // Multi-tenant
  role: 'admin' | 'user' // Role-based
}
```

## 🧪 Testing

### Test Google Login
1. Klik "Inloggen met Google"
2. Gebruik test Google account
3. Verify redirect naar dashboard

### Test Demo Accounts
1. Klik "Admin" button
2. Verify email/password auto-filled
3. Klik "Inloggen"
4. Verify redirect naar dashboard

### Test Protected Routes
1. Logout
2. Try direct access `/dashboard`
3. Verify redirect naar login

## 🐛 Troubleshooting

### "Invalid Client ID"
- Check GOOGLE_CLIENT_ID in .env.local
- Verify Google Cloud credentials
- Restart dev server

### "Redirect URI mismatch"
- Add `http://localhost:3000/api/auth/callback/google` in Google Cloud
- For production, add your domain

### Session not persisting
- Check NEXTAUTH_SECRET is set
- Verify SessionProvider in layout
- Check browser cookies enabled

### Demo accounts not working
- Verify email/password exact match
- Check credentials provider in route.ts
- Restart dev server

## 📚 Resources

- [NextAuth.js Docs](https://next-auth.js.org)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth Credentials Provider](https://next-auth.js.org/providers/credentials)

## ✨ Next Steps

1. **Database Integration**: Replace demo users with database
2. **Email Verification**: Add email confirmation flow
3. **2FA**: Implement two-factor authentication
4. **Social Providers**: Add GitHub, Microsoft, etc.
5. **Custom Branding**: Customize OAuth consent screen