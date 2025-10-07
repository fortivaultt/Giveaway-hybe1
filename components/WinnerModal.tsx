'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { modalVariant } from '../lib/animations';
import Confetti from 'react-confetti';

export default function WinnerModal({ open }: { open: boolean }){
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial="hidden" animate="show" exit="exit">
          <div className="absolute inset-0 bg-black/60" />
          <motion.div variants={modalVariant} className="relative glass p-8 rounded-2xl z-10 max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold">Winner Announcement</h2>
            <p className="mt-2 text-gray-300">Congratulations! You are a winner. We will contact you via email with next steps.</p>
          </motion.div>
          <Confetti recycle={false} numberOfPieces={400} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
