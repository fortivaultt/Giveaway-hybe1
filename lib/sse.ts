type MessageCallback = (payload: string) => void;

const subscribers = new Set<MessageCallback>();

export function subscribe(cb: MessageCallback) {
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}

export function broadcastEvent(event: string, data: any) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const cb of subscribers) {
    try {
      cb(payload);
    } catch (e) {
      // ignore individual subscriber errors
    }
  }
}

export function subscriberCount() {
  return subscribers.size;
}
