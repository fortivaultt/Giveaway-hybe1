import NextAuth from 'next-auth/next';
import EmailProvider from 'next-auth/providers/email';
import { NextAuthOptions } from 'next-auth';
import { createClient } from '@supabase/supabase-js';
import { SupabaseAdapter } from '@next-auth/supabase-adapter';

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

export const authOptions: NextAuthOptions = {
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
  adapter: SupabaseAdapter(supabase),
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'database'
  },
  callbacks: {
    async session({ session, user }) {
      if (user) {
        (session as any).user.id = (user as any).id;
        (session as any).user.giveawayId = (user as any).giveaway_id || null;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
