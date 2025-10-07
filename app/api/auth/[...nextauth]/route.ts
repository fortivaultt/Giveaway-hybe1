import NextAuth from 'next-auth/next';
import EmailProvider from 'next-auth/providers/email';
import { NextAuthOptions } from 'next-auth';

// Supabase adapter is optional — guard creation so dev server doesn't crash when envs missing
let adapter: any = undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createClient } = require('@supabase/supabase-js');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { SupabaseAdapter } = require('@next-auth/supabase-adapter');

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    adapter = SupabaseAdapter(supabase);
  } else {
    console.warn('Supabase environment variables missing; running NextAuth without Supabase adapter');
  }
} catch (err) {
  // adapter module not installed or other error — continue without adapter
  // console.warn('Supabase adapter not available', err);
}

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
  ...(adapter ? { adapter } : {}),
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: adapter ? 'database' : 'jwt'
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
