import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";
import { slugify } from "@/lib/slugify";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function createEvent(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session) redirect("/admin/login");

  const data = {
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    startDate: String(formData.get("startDate") || ""),
    endDate: String(formData.get("endDate") || ""),
    venueName: String(formData.get("venueName") || ""),
    venueAddress: String(formData.get("venueAddress") || ""),
    city: String(formData.get("city") || ""),
    bookingUrl: String(formData.get("bookingUrl") || ""),
    status: String(formData.get("status") || "DRAFT") as "DRAFT" | "PUBLISHED",
    posterUrl: String(formData.get("posterUrl") || "")
  };

  const parsed = eventSchema.safeParse(data);
  if (!parsed.success) {
    redirect("/admin/events/new?error=1");
  }

  const baseSlug = slugify(parsed.data.title);
  let slug = baseSlug;
  let i = 1;
  // Ensure uniqueness
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.event.findUnique({ where: { slug } });
    if (!existing) break;
    slug = `${baseSlug}-${i++}`;
  }

  await prisma.event.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate
        ? new Date(parsed.data.endDate)
        : null,
      venueName: parsed.data.venueName,
      venueAddress: parsed.data.venueAddress || null,
      city: parsed.data.city,
      bookingUrl: parsed.data.bookingUrl,
      status: parsed.data.status,
      posterUrl: parsed.data.posterUrl || null,
      slug
    }
  });

  revalidatePath("/programmation");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export default function NewEventPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Nouvel évènement</h1>
      <form action={createEvent} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="title">
            Titre
          </label>
          <input
            id="title"
            name="title"
            required
            className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="startDate">
              Date & heure de début
            </label>
            <input
              id="startDate"
              name="startDate"
              type="datetime-local"
              required
              className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="endDate">
              Date & heure de fin
            </label>
            <input
              id="endDate"
              name="endDate"
              type="datetime-local"
              className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="venueName">
              Lieu
            </label>
            <input
              id="venueName"
              name="venueName"
              required
              className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="city">
              Ville
            </label>
            <input
              id="city"
              name="city"
              required
              className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="venueAddress">
            Adresse complète
          </label>
          <input
            id="venueAddress"
            name="venueAddress"
            className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="bookingUrl">
            Lien de réservation (URL externe)
          </label>
          <input
            id="bookingUrl"
            name="bookingUrl"
            type="url"
            required
            className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
          />
          <p className="text-[11px] text-muted mt-1">
            Un message indique aux spectateurs qu&apos;ils quittent le site
            lors de la réservation.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="status">
              Statut
            </label>
            <select
              id="status"
              name="status"
              className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
            >
              <option value="DRAFT">Brouillon</option>
              <option value="PUBLISHED">Publié</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="posterUrl">
              URL de l&apos;affiche (image)
            </label>
            <input
              id="posterUrl"
              name="posterUrl"
              type="url"
              className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button type="submit" className="btn-primary text-sm">
          Enregistrer
        </button>
      </form>
    </div>
  );
}

