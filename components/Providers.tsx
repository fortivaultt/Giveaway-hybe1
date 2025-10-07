'use client';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children, session }: { children: React.ReactNode; session?: any }){
  return (
    <SessionProvider session={session} refetchInterval={60}>
      {children}
      <Toaster position="top-right" toastOptions={{
        style: { background: 'rgba(18,18,24,0.9)', color: '#E6EEF8', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.06)' }
      }} />
    </SessionProvider>
  );
}
