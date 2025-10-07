#!/usr/bin/env node
// Simple Supabase Realtime listener that forwards DB changes to your Next.js webhook endpoint
// Usage: set env vars SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, WEBHOOK_URL, SUPABASE_JWT_SECRET and run `node scripts/supabase-realtime-listener.js`

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://your-app.example.com/api/webhooks/supabase';
const WEBHOOK_SECRET = process.env.SUPABASE_JWT_SECRET || '';

if(!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { params: { eventsPerSecond: 10 } }
});

// Subscribe to the `entries` table. Duplicate this block for other tables or make it configurable.
const channel = supabase.channel('public:entries')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'entries' }, async (payload) => {
    try{
      const body = { table: payload.table, event: payload.eventType || payload.event, record: payload.new || payload.old };
      await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-webhook-secret': WEBHOOK_SECRET }, body: JSON.stringify(body) });
      console.log('Forwarded payload for entries:', body.event || body);
    }catch(e){ console.error('Forward error', e); }
  })
  .subscribe(async (status) => {
    console.log('Realtime channel status:', status);
  });

// Also subscribe to the generic live_updates notifications channel (if you use pg_notify)
const liveChannel = supabase.channel('public:live_updates')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'live_updates' }, async (payload) => {
    try{
      const body = { table: payload.table, event: payload.eventType || payload.event, record: payload.new || payload.old };
      await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-webhook-secret': WEBHOOK_SECRET }, body: JSON.stringify(body) });
      console.log('Forwarded live_updates payload');
    }catch(e){ console.error('Forward error', e); }
  })
  .subscribe();

console.log('Supabase realtime listener started. Listening for changes...');

// keep process alive
process.stdin.resume();
