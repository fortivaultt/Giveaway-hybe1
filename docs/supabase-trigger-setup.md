1) Create the live_updates table and trigger
- Run the SQL file at `sql/create_live_updates_and_trigger.sql` in the Supabase SQL editor.

2) Use the provided Node listener to forward events to your Next.js webhook
- Copy `scripts/supabase-realtime-listener.js` to a server you can run continuously (Heroku, Fly, a VPS, or locally for testing).
- Set environment variables:
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - WEBHOOK_URL (e.g. https://your-app.com/api/webhooks/supabase)
  - SUPABASE_JWT_SECRET (must match the header your Next.js webhook expects)
- Run: `node scripts/supabase-realtime-listener.js`

3) Alternative: Use Supabase Realtime client from a serverless or edge worker
- The Node script uses supabase-js realtime subscription to forward DB events to your webhook. This approach avoids Postgres HTTP outbound requirements.

4) Security notes
- Never expose your SERVICE_ROLE key in the browser. Use it only for server-side listeners.
- Ensure your webhook endpoint validates x-webhook-secret against SUPABASE_JWT_SECRET.

5) Optional: If you prefer Postgres-based publishes (pg_notify)
- The trigger function included in the SQL uses pg_notify('live_updates', <payload>) so any listener subscribed to Postgres NOTIFY can receive payloads.
- Supabase Realtime can also be configured to pick up these notifications automatically.
