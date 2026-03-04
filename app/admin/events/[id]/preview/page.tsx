import { prisma } from "@/lib/prisma";

type Props = { params: { id: string } };

export default async function PreviewEventPage({ params }: Props) {
  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) {
    return (
      <div>
        <p className="text-sm text-muted">Événement introuvable.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold mb-2">Prévisualisation</h1>
      <div className="rounded-2xl border border-zinc-800 bg-card/70 p-5">
        <p className="text-xs text-muted mb-1">
          {new Date(event.startDate).toLocaleString("fr-FR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </p>
        <h2 className="text-lg font-semibold mb-1">{event.title}</h2>
        <p className="text-xs text-muted mb-2">
          {event.venueName} {event.city && `· ${event.city}`}
        </p>
        <p className="text-sm text-muted mb-3 whitespace-pre-line">
          {event.description}
        </p>
        <p className="text-[11px] text-muted">
          Ce rendu correspond approximativement à la carte visible côté public
          dans la page programmation.
        </p>
      </div>
    </div>
  );
}

