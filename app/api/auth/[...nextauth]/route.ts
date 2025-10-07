import NextAuth from 'next-auth/next';
import EmailProvider from 'next-auth/providers/email';
import { NextAuthOptions } from 'next-auth';

const options: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      },
      from: process.env.SMTP_FROM || process.env.SMTP_USER
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async session({ session, user }) {
      // attach giveaway metadata if available
      if (user && 'id' in user) {
        (session as any).user.id = (user as any).id;
        (session as any).user.giveawayId = (user as any).giveawayId || null;
      }
      return session;
    }
  }
};

const handler = NextAuth(options);
export { handler as GET, handler as POST };
