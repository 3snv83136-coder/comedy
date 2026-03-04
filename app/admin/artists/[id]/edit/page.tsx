import { prisma } from "@/lib/prisma";
import { artistSchema } from "@/lib/validators";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type Props = { params: { id: string } };

async function updateArtist(id: string, formData: FormData) {
  "use server";
  const session = await auth();
  if (!session) redirect("/admin/login");

  const tagsArray = String(formData.get("tags") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const data = {
    name: String(formData.get("name") || ""),
    bioShort: String(formData.get("bioShort") || ""),
    bioLong: String(formData.get("bioLong") || ""),
    instagram: String(formData.get("instagram") || ""),
    tiktok: String(formData.get("tiktok") || ""),
    youtube: String(formData.get("youtube") || ""),
    website: String(formData.get("website") || ""),
    videoEmbedUrl: String(formData.get("videoEmbedUrl") || ""),
    tags: tagsArray
  };

  const parsed = artistSchema.safeParse(data);
  if (!parsed.success) {
    redirect(`/admin/artists/${id}/edit?error=1`);
  }

  await prisma.artist.update({
    where: { id },
    data: {
      name: parsed.data.name,
      bioShort: parsed.data.bioShort,
      bioLong: parsed.data.bioLong || null,
      instagram: parsed.data.instagram || null,
      tiktok: parsed.data.tiktok || null,
      youtube: parsed.data.youtube || null,
      website: parsed.data.website || null,
      videoEmbedUrl: parsed.data.videoEmbedUrl || null,
      tags: tagsArray.join(",")
    }
  });

  revalidatePath("/admin/artists");
  revalidatePath("/artistes");
  redirect("/admin/artists");
}

export default async function EditArtistPage({ params }: Props) {
  const artist = await prisma.artist.findUnique({ where: { id: params.id } });
  if (!artist) {
    return (
      <div>
        <p className="text-sm text-muted">Artiste introuvable.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">
        Modifier l&apos;artiste
      </h1>
      <form
        action={async (formData) => {
          "use server";
          await updateArtist(artist.id, formData);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm mb-1" htmlFor="name">
            Nom de scène
          </label>
          <input
            id="name"
            name="name"
            defaultValue={artist.name}
            required
            className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="bioShort">
            Bio courte
          </label>
          <textarea
            id="bioShort"
            name="bioShort"
            rows={3}
            defaultValue={artist.bioShort}
            required
            className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="bioLong">
            Bio longue
          </label>
          <textarea
            id="bioLong"
            name="bioLong"
            rows={4}
            defaultValue={artist.bioLong || ""}
            className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="instagram">
              Instagram
            </label>
            <input
              id="instagram"
              name="instagram"
              type="url"
              defaultValue={artist.instagram || ""}
              className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="tiktok">
              TikTok
            </label>
            <input
              id="tiktok"
              name="tiktok"
              type="url"
              defaultValue={artist.tiktok || ""}
              className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="youtube">
              YouTube
            </label>
            <input
              id="youtube"
              name="youtube"
              type="url"
              defaultValue={artist.youtube || ""}
              className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="website">
              Site web
            </label>
            <input
              id="website"
              name="website"
              type="url"
              defaultValue={artist.website || ""}
              className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="videoEmbedUrl">
            URL embarquée (YouTube/Vimeo)
          </label>
          <input
            id="videoEmbedUrl"
            name="videoEmbedUrl"
            type="url"
            defaultValue={artist.videoEmbedUrl || ""}
            className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="tags">
            Tags (séparés par des virgules)
          </label>
          <input
            id="tags"
            name="tags"
            defaultValue={artist.tags || ""}
            className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="btn-primary text-sm">
          Mettre à jour
        </button>
      </form>
    </div>
  );
}

