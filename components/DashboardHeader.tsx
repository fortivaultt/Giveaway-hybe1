'use client';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../lib/animations';

export default function DashboardHeader({ user }: { user: any }){
  return (
    <motion.header variants={fadeInUp} initial="hidden" animate="show" className="sticky top-4 glass p-4 rounded-2xl neon-border backdrop-blur-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/hybe-logo.svg" alt="HYBE" width={48} height={48} />
          <div>
            <div className="text-sm text-gray-300">Hi, <span className="font-semibold text-white">{user.name}</span></div>
            <div className="text-xs text-gray-400">Welcome to your official giveaway dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => signOut()} className="text-sm py-2 px-3 rounded-md bg-white/6 hover:bg-white/8">Sign out</button>
        </div>
      </div>
    </motion.header>
  );
}
