import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import supabaseService from '../../../lib/supabaseServer';

export async function POST(req: Request){
  const session = await getServerSession(authOptions as any);
  if(!session || !session.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const updates: any = {};
  if(body.name) updates.full_name = body.name;
  if(body.country) updates.country = body.country;
  if(body.notify === true || body.notify === false) updates.notify = body.notify;

  const { error } = await supabaseService.from('profiles').upsert({ id: session.user.id, ...updates });
  if(error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
