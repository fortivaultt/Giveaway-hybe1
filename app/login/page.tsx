'use client';

import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../lib/animations';

export default function LoginPage(){
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div variants={fadeInUp} initial="hidden" animate="show" className="max-w-md w-full glass p-8 rounded-2xl neon-border">
        <div className="flex items-center gap-4 mb-6">
          <img src="/hybe-logo.svg" alt="HYBE" width={56} height={56} />
          <h1 className="text-2xl font-semibold">HYBE Giveaway Dashboard</h1>
        </div>
        <p className="text-sm text-gray-300 mb-6">Sign in to view your entry, live updates, and notifications.</p>
        <button onClick={() => signIn('email')} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-3 rounded-md text-white font-medium">Sign in with Email</button>
        <div className="mt-4 text-center text-xs text-gray-400">Or use social login (coming soon)</div>
      </motion.div>
    </div>
  );
}
