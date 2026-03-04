import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Programmation stand-up",
  description:
    "Tous les événements Biiip Comedy Club : plateaux, open mics et soirées spéciales."
};

async function getEvents() {
  const now = new Date();
  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({
      where: { status: "PUBLISHED", startDate: { gte: now } },
      orderBy: { startDate: "asc" }
    }),
    prisma.event.findMany({
      where: { status: "PUBLISHED", startDate: { lt: now } },
      orderBy: { startDate: "desc" },
      take: 20
    })
  ]);
  return { upcoming, past };
}

export default async function ProgrammationPage({
  searchParams
}: {
  searchParams: { mois?: string };
}) {
  const { upcoming, past } = await getEvents();

  const monthFilter = searchParams.mois;
  const filteredUpcoming = monthFilter
    ? upcoming.filter((e) => {
        const month = (e.startDate.getMonth() + 1).toString().padStart(2, "0");
        const year = e.startDate.getFullYear();
        return `${year}-${month}` === monthFilter;
      })
    : upcoming;

  const allMonths = Array.from(
    new Set(
      upcoming.map((e) => {
        const month = (e.startDate.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        const year = e.startDate.getFullYear();
        return `${year}-${month}`;
      })
    )
  ).sort();

  return (
    <div className="container py-10 md:py-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">
            Programmation
          </h1>
          <p className="text-sm text-muted">
            Plateaux à venir, soirées passées et liens de réservation externes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-muted">Filtrer par mois :</span>
          <Link
            href="/programmation"
            className={`rounded-full border px-3 py-1 ${
              !monthFilter
                ? "border-primary-500 text-primary-500"
                : "border-zinc-700 text-muted hover:border-primary-500 hover:text-primary-500"
            }`}
          >
            Tous
          </Link>
          {allMonths.map((m) => {
            const [year, month] = m.split("-");
            const label = new Date(
              Number(year),
              Number(month) - 1,
              1
            ).toLocaleDateString("fr-FR", {
              month: "short",
              year: "numeric"
            });
            const active = monthFilter === m;
            return (
              <Link
                key={m}
                href={`/programmation?mois=${m}`}
                className={`rounded-full border px-3 py-1 ${
                  active
                    ? "border-primary-500 text-primary-500"
                    : "border-zinc-700 text-muted hover:border-primary-500 hover:text-primary-500"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">À venir</h2>
        {filteredUpcoming.length === 0 && (
          <p className="text-sm text-muted">
            Aucun événement à venir pour le moment.
          </p>
        )}
        <div className="grid gap-4">
          {filteredUpcoming.map((event) => (
            <article
              key={event.id}
              className="rounded-2xl border border-zinc-800 bg-card/70 p-4 md:p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between"
            >
              <div>
                <p className="text-xs text-muted mb-1">
                  {new Date(event.startDate).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
                <h3 className="font-semibold mb-1">{event.title}</h3>
                <p className="text-xs text-muted mb-1">
                  {event.venueName} {event.city && `· ${event.city}`}
                </p>
                <p className="text-sm text-muted line-clamp-2">
                  {event.description}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Link
                  href={event.bookingUrl}
                  className="btn-primary text-xs"
                  target="_blank"
                >
                  Réserver
                </Link>
                <p className="text-[10px] text-muted max-w-[180px] text-right">
                  La billetterie s&apos;ouvre dans un nouvel onglet. Vous
                  quittez le site de l&apos;association.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Événements passés</h2>
        {past.length === 0 && (
          <p className="text-sm text-muted">
            Les archives des événements passés arriveront bientôt.
          </p>
        )}
        <div className="space-y-3 text-sm text-muted">
          {past.map((event) => (
            <div key={event.id} className="flex justify-between gap-4">
              <span className="truncate">
                <Link
                  href={`/programmation/${event.slug}`}
                  className="hover:text-primary-400"
                >
                  {event.title}
                </Link>
              </span>
              <span className="text-xs">
                {new Date(event.startDate).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

