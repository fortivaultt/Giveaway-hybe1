'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const panel = {
  hidden: { x: '100%' },
  show: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { x: '100%', transition: { duration: 0.2 } }
};

export default function ProfileDrawer({ open, onClose }: { open: boolean; onClose: () => void }){
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || '');
  const [country, setCountry] = useState('');
  const [saving, setSaving] = useState(false);

  async function save(){
    setSaving(true);
    try{
      const res = await fetch('/api/profile', { method: 'POST', body: JSON.stringify({ name, country }), headers: { 'Content-Type': 'application/json' } });
      const j = await res.json();
      if(res.ok) {
        toast.success('Profile updated');
        onClose();
      } else {
        toast.error(j.error || 'Failed to update');
      }
    }catch(e){
      toast.error('Network error');
    }finally{setSaving(false)}
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.aside variants={panel} initial="hidden" animate="show" exit="exit" className="ml-auto w-full max-w-md bg-gradient-to-b from-[#0b0b0f]/80 to-[#0b0b0f] glass p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Profile & Settings</h3>
              <button onClick={onClose} className="text-sm text-gray-400">Close</button>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs text-gray-400">Display name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-2 p-2 bg-transparent border border-white/6 rounded-md" />
              </div>
              <div>
                <label className="text-xs text-gray-400">Country</label>
                <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full mt-2 p-2 bg-transparent border border-white/6 rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <button disabled={saving} onClick={save} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md text-white">Save</button>
                <button onClick={onClose} className="px-4 py-2 bg-white/6 rounded-md text-sm">Cancel</button>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
