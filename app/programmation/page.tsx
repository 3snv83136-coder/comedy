import { Metadata } from "next";
import { shows } from "@/data/shows";

export const metadata: Metadata = {
  title: "Programmation stand-up",
  description:
    "Tous les événements Biiip Comedy Club : plateaux, open mics et soirées spéciales."
};

export default function ProgrammationPage() {
  const sorted = [...shows].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="container py-10 md:py-14">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
          Programmation
        </h1>
        <p className="text-sm text-muted">
          Prochaines dates du Biiip Comedy Club. Modifie simplement{" "}
          <code className="text-xs">data/shows.ts</code> pour mettre à jour.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">À venir</h2>
        {sorted.length === 0 && (
          <p className="text-sm text-muted">
            Aucun événement à venir pour le moment.
          </p>
        )}
        <div className="grid gap-4">
          {sorted.map((event) => (
            <article
              key={`${event.title}-${event.date}`}
              className="rounded-2xl border border-zinc-800 bg-card/70 p-4 md:p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between"
            >
              <div>
                <p className="text-xs text-muted mb-1">
                  {new Date(event.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
                <h3 className="font-semibold mb-1">{event.title}</h3>
                <p className="text-xs text-muted mb-1">
                  {event.venue} {event.city && `· ${event.city}`}
                </p>
                <p className="text-sm text-muted line-clamp-2">
                  {event.description}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {event.bookingUrl && (
                  <a
                    href={event.bookingUrl}
                    className="btn-primary text-xs"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Réserver
                  </a>
                )}
                <p className="text-[10px] text-muted max-w-[180px] text-right">
                  La billetterie s&apos;ouvre dans un nouvel onglet. Vous
                  quittez le site de l&apos;association.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section archives : à remplir plus tard si besoin */}
    </div>
  );
}

