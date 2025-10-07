import NextAuth from 'next-auth/next';
import EmailProvider from 'next-auth/providers/email';
import { NextAuthOptions } from 'next-auth';

// Supabase adapter is optional — guard creation so dev server doesn't crash when envs missing
let adapter: any = undefined;
try {
  // Use server-side supabaseService (created with service role key) when available
  // Importing the server client ensures we don't leak service keys to the client bundle
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { SupabaseAdapter } = require('@next-auth/supabase-adapter');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const supabaseService = require('../../../lib/supabaseServer').default;

  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (supabaseUrl && supabaseKey) {
    adapter = SupabaseAdapter(supabaseService);
    console.info('NextAuth: SupabaseAdapter configured using service role key');
  } else {
    console.warn('Supabase SERVICE role key or URL missing; NextAuth will run without DB adapter');
  }
} catch (err) {
  // adapter module not installed or other error — continue without adapter
  console.warn('Supabase adapter not available or failed to initialize', err?.message || err);
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

// Create NextAuth handler lazily to avoid initialization-time crashes
let _handler: any = null;
function getHandler() {
  if (!_handler) {
    const NextAuth = require('next-auth/next').default;
    _handler = NextAuth(authOptions);
  }
  return _handler;
}

export async function GET(req: Request) {
  try {
    const h = getHandler();
    return await h(req);
  } catch (err: any) {
    console.error('NextAuth GET error:', err);
    return new Response(JSON.stringify({ error: 'Auth server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST(req: Request) {
  try {
    const h = getHandler();
    return await h(req);
  } catch (err: any) {
    console.error('NextAuth POST error:', err);
    return new Response(JSON.stringify({ error: 'Auth server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
