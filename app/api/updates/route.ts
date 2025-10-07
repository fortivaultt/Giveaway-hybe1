import { NextResponse } from 'next/server';

const items = [
  { id: '1', text: 'LIVE ENTRIES 120,029', time: 'Now' },
  { id: '2', text: 'Elise Lee just entered from Chicago 🎉', time: '1 minute ago' },
  { id: '3', text: 'Entries Verified — Winners announcing soon', time: '5 minutes ago' }
];

export async function GET(){
  return NextResponse.json({ items });
}
