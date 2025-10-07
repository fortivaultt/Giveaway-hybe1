'use client';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function NotificationFeed(){
  const { data } = useSWR('/api/updates', fetcher, { refreshInterval: 5000 });
  const items = data?.items || [{ id: '1', text: 'Entries Verified — Winners announcing soon', time: 'Just now' }];
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
