import { NextResponse } from 'next/server';
import { subscribe } from '../../../../lib/sse';

export async function GET(){
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller){
      // send initial comment
      controller.enqueue(encoder.encode(`:ok\n\n`));

      const onMessage = (msg: string) => {
        controller.enqueue(encoder.encode(msg));
      };

      const unsubscribe = subscribe(onMessage);

      // ping every 20s to keep connection alive
      const ping = setInterval(() => controller.enqueue(encoder.encode(`event: ping\ndata: {}\n\n`)), 20000);

      // when canceled, clean up
      (controller as any).onCancel = () => {
        clearInterval(ping);
        unsubscribe();
      };
    },
    cancel(){ /* handled in start */ }
  });

  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' } });
}
