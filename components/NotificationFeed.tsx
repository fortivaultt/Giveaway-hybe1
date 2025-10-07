'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function NotificationFeed(){
  const [items, setItems] = useState<any[]>([]);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let mounted = true;
    // initial fetch
    fetch('/api/updates').then(r => r.json()).then(j => { if(!mounted) return; setItems(j.items || []); });

    const es = new EventSource('/api/live/stream');
    es.onmessage = (e) => {
      // default message
      try{
        const data = JSON.parse(e.data);
        setItems(prev => [data, ...prev].slice(0, 20));
        if(data && data.text) toast((t) => (<div className="text-sm">{data.text}</div>));
      }catch(e){ /* ignore */ }
    };
    es.addEventListener('supabase_update', (ev: any) => {
      try{
        const payload = JSON.parse(ev.data || '{}');
        const text = payload.record?.text || payload.record?.message || JSON.stringify(payload);
        const item = { id: Date.now().toString(), text, time: 'Now' };
        setItems(prev => [item, ...prev].slice(0, 20));
        toast.success('Live update');
      }catch(e){}
    });
    es.onerror = () => {
      es.close();
    };
    esRef.current = es;

    return () => { mounted = false; es.close(); };
  }, []);

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3">Live Updates</h3>
      <div className="space-y-3">
        <AnimatePresence>
          {items.map((it: any) => (
            <motion.div key={it.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass p-3 rounded-md">
              <div className="text-sm">{it.text}</div>
              <div className="text-xs text-gray-400">{it.time}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
