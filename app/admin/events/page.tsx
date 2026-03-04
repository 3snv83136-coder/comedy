import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function deleteEvent(id: string) {
  "use server";
  const session = await auth();
  if (!session) redirect("/admin/login");
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/programmation");
}

async function getEvents(search?: string) {
  return prisma.event.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search } },
            { venueName: { contains: search } }
          ]
        }
      : {},
    orderBy: { startDate: "desc" }
  });
}

export default async function AdminEventsPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const events = await getEvents(searchParams.q);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold mb-1">Événements</h1>
          <p className="text-xs text-muted">
            Gérer la programmation (brouillons et publié).
          </p>
        </div>
        <Link href="/admin/events/new" className="btn-primary text-xs">
          Nouveau
        </Link>
      </div>
      <form className="mb-3">
        <input
          name="q"
          defaultValue={searchParams.q}
          placeholder="Rechercher par titre ou lieu"
          className="w-full max-w-xs rounded-full bg-black/40 border border-zinc-700 px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        />
      </form>
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-card/70">
        <table className="min-w-full text-xs">
          <thead className="bg-black/40 text-muted">
            <tr>
              <th className="px-3 py-2 text-left font-normal">Titre</th>
              <th className="px-3 py-2 text-left font-normal">Date</th>
              <th className="px-3 py-2 text-left font-normal">Lieu</th>
              <th className="px-3 py-2 text-left font-normal">Statut</th>
              <th className="px-3 py-2 text-right font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t border-zinc-800">
                <td className="px-3 py-2 align-top">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-[11px] text-muted">{event.slug}</div>
                </td>
                <td className="px-3 py-2 align-top text-xs text-muted">
                  {new Date(event.startDate).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </td>
                <td className="px-3 py-2 align-top text-xs text-muted">
                  {event.venueName}
                </td>
                <td className="px-3 py-2 align-top">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ${
                      event.status === "PUBLISHED"
                        ? "bg-emerald-900/50 text-emerald-300 border border-emerald-700"
                        : "bg-zinc-900 text-zinc-300 border border-zinc-700"
                    }`}
                  >
                    {event.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td className="px-3 py-2 align-top text-right space-x-2">
                  <Link
                    href={`/admin/events/${event.id}/preview`}
                    className="text-[11px] text-muted hover:text-primary-500"
                  >
                    Prévisualiser
                  </Link>
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="text-[11px] text-muted hover:text-primary-500"
                  >
                    Modifier
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteEvent(event.id);
                    }}
                    className="inline"
                  >
                    <button
                      type="submit"
                      className="text-[11px] text-red-400 hover:text-red-300"
                    >
                      Supprimer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 text-center text-xs text-muted"
                >
                  Aucun événement pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

