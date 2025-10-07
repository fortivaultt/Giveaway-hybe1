import { NextResponse } from 'next/server';
import supabaseService from '../../../../lib/supabaseServer';
import { broadcastEvent } from '../../../../lib/sse';

export async function POST(req: Request){
  // basic secret validation
  const secret = req.headers.get('x-webhook-secret') || '';
  if(!process.env.SUPABASE_JWT_SECRET || secret !== process.env.SUPABASE_JWT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  // expected payload: { table, event, record }
  const payload = body || {};
  // broadcast to connected SSE clients
  try{
    broadcastEvent('supabase_update', payload);
  }catch(e){/* ignore */}

  // persist into live_updates table when present
  try{
    if(payload.record && payload.table) {
      await supabaseService.from('live_updates').insert({ table: payload.table, event: payload.event || 'update', payload: payload.record });
    }
  }catch(e){ /* ignore DB errors */ }

  return NextResponse.json({ ok: true });
}
