'use client';
import { motion } from 'framer-motion';

const steps = ['Entered', 'Verified', 'Pending Draw', 'Winner Announcement'];

export default function StatusTimeline({ status }: { status: string }){
  const currentIndex = steps.indexOf(status) >= 0 ? steps.indexOf(status) : 0;
  return (
    <div className="mt-4">
      {steps.map((s, i) => (
        <motion.div key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className={`flex items-center gap-3 py-3 ${i <= currentIndex ? 'text-white' : 'text-gray-400'}`}>
          <div className={`w-3 h-3 rounded-full ${i <= currentIndex ? 'bg-indigo-500' : 'bg-white/6'}`} />
          <div className="flex-1">
            <div className="font-medium">{s}</div>
            <div className="text-xs text-gray-400">{i === currentIndex ? 'Current' : i < currentIndex ? 'Completed' : 'Pending'}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
