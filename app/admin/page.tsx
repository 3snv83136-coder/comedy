import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard"
};

async function getStats() {
  const now = new Date();
  const [upcomingEvents, artists, submissions] = await Promise.all([
    prisma.event.count({
      where: { status: "PUBLISHED", startDate: { gte: now } }
    }),
    prisma.artist.count(),
    prisma.submission.count()
  ]);

  return { upcomingEvents, artists, submissions };
}

export default async function AdminDashboardPage() {
  const { upcomingEvents, artists, submissions } = await getStats();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-card/80 p-4">
          <p className="text-xs text-muted mb-1">Événements à venir</p>
          <p className="text-2xl font-semibold">{upcomingEvents}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-card/80 p-4">
          <p className="text-xs text-muted mb-1">Artistes</p>
          <p className="text-2xl font-semibold">{artists}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-card/80 p-4">
          <p className="text-xs text-muted mb-1">Demandes reçues</p>
          <p className="text-2xl font-semibold">{submissions}</p>
        </div>
      </div>
    </div>
  );
}

