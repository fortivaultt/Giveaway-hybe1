import './globals.css';
import { Inter } from 'next/font/google';
import Providers from '../components/Providers';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HYBE Giveaway Dashboard',
  description: 'Official HYBE x BigHit Giveaway Dashboard'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-[#0b0b0f] to-[#111827] text-gray-200`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
