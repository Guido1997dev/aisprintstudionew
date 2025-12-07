import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

const DEMO_USERS = [
  { id: '1', email: 'admin@aisprintstudio.nl', password: 'admin123', name: 'Admin User', company: 'AI Sprint Studio', role: 'admin' },
  { id: '2', email: 'klant1@bedrijf.nl', password: 'demo123', name: 'Jan Jansen', company: 'Bedrijf A', role: 'user' },
  { id: '3', email: 'klant2@company.com', password: 'demo123', name: 'Sarah Smith', company: 'Company B', role: 'user' },
  { id: '4', email: 'info@croonco.nl', password: 'croonco123', name: 'CROONCO Admin', company: 'CROONCO', role: 'user' },
];

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = DEMO_USERS.find(u => u.email === credentials.email && u.password === credentials.password);
        return user ? { id: user.id, email: user.email, name: user.name, company: user.company, role: user.role } : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.company = (user as any).company || 'Default Company';
        token.role = (user as any).role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).company = token.company;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
});

export { handler as GET, handler as POST };