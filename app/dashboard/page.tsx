import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import DashboardHeader from '../../components/DashboardHeader';
import StatusTimeline from '../../components/StatusTimeline';
import NotificationFeed from '../../components/NotificationFeed';
import WinnerModal from '../../components/WinnerModal';

export default async function DashboardPage(){
  const session = await getServerSession(authOptions as any);
  if(!session) redirect('/login');

  // mock user entry data
  const user = { name: session.user?.name || session.user?.email, giveawayId: 'HYBE-1234', status: 'Pending Draw' };

  const isWinner = false; // server-driven flag

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <DashboardHeader user={user} />
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass p-6 rounded-2xl">
          <h2 className="text-lg font-semibold">Event Status</h2>
          <StatusTimeline status={user.status} />
          <NotificationFeed />
        </div>
        <aside className="glass p-6 rounded-2xl">
          <h3 className="font-semibold">Your Entry</h3>
          <div className="mt-4 text-sm text-gray-300">ID: {user.giveawayId}</div>
          <div className="mt-2 text-sm text-gray-400">Status: {user.status}</div>
        </aside>
      </section>
      <WinnerModal open={isWinner} />
    </main>
  );
}
