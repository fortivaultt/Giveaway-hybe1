-- NextAuth / Supabase PostgreSQL schema
-- Run this in Supabase SQL editor (SQL) or via psql using your Supabase DB connection string.

-- Enable pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text UNIQUE,
  email_verified timestamptz,
  image text,
  created_at timestamptz DEFAULT now()
);

-- Accounts (OAuth)
CREATE TABLE IF NOT EXISTS public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  provider text NOT NULL,
  provider_account_id text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at integer,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  oauth_token_secret text,
  oauth_token text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(provider, provider_account_id)
);

-- Sessions
CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires timestamptz NOT NULL,
  session_token text UNIQUE NOT NULL,
  access_token text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Verification tokens (email sign-in)
CREATE TABLE IF NOT EXISTS public.verification_tokens (
  identifier text NOT NULL,
  token text NOT NULL UNIQUE,
  expires timestamptz NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Optional: profiles table for app-specific user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  country text,
  notify boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Optional: live updates audit table (recommended earlier)
CREATE TABLE IF NOT EXISTS public.live_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  event text NOT NULL,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes to speed lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts (user_id);

-- Notes:
-- 1) Run this in the Supabase SQL editor (Project -> SQL) and execute.
-- 2) If you prefer psql, grab your database connection string from Supabase (Settings > Database > Connection string) and run:
--    psql "postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE" -f sql/nextauth_schema.sql
-- 3) After creating the schema, the NextAuth Supabase adapter will be able to persist users, accounts, and sessions.
