Notes:
- This project uses Next.js 14 App Router.
- NextAuth is configured at app/api/auth/[...nextauth]/route.ts and uses @next-auth/supabase-adapter.
- Ensure the following env vars are set: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, SUPABASE_JWT_SECRET, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, NEXTAUTH_SECRET, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.
- To persist profiles, create a `profiles` table in Supabase with primary key `id` (text) and optional fields `full_name`, `country`, `notify`.
- For live updates streaming:
  - Create a `live_updates` table with columns: id (uuid), table (text), event (text), payload (jsonb), created_at (timestamp)
  - Configure a Postgres trigger or Supabase function to POST to `/api/webhooks/supabase` with header `x-webhook-secret` equal to SUPABASE_JWT_SECRET when relevant events occur.
- The app exposes a Server-Sent Event stream at `/api/live/stream` for real-time client updates.
- Run `npm install` then `npm run dev` to start the app.
