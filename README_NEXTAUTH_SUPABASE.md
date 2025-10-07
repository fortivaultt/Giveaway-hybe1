Notes:
- This project uses Next.js 14 App Router.
- NextAuth is configured at app/api/auth/[...nextauth]/route.ts and uses @next-auth/supabase-adapter.
- Ensure the following env vars are set: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, SUPABASE_JWT_SECRET, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, NEXTAUTH_SECRET.
- To persist profiles, create a `profiles` table in Supabase with primary key `id` (text) and optional fields `full_name`, `country`, `notify`.
- Run `npm install` then `npm run dev` to start the app.
