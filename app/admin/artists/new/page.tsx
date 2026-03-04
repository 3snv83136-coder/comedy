import { prisma } from "@/lib/prisma";
import { artistSchema } from "@/lib/validators";
import { slugify } from "@/lib/slugify";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function createArtist(formData: FormData) {
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
    redirect("/admin/artists/new?error=1");
  }

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.artist.findUnique({ where: { slug } });
    if (!existing) break;
    slug = `${baseSlug}-${i++}`;
  }

  await prisma.artist.create({
    data: {
      name: parsed.data.name,
      bioShort: parsed.data.bioShort,
      bioLong: parsed.data.bioLong || null,
      instagram: parsed.data.instagram || null,
      tiktok: parsed.data.tiktok || null,
      youtube: parsed.data.youtube || null,
      website: parsed.data.website || null,
      videoEmbedUrl: parsed.data.videoEmbedUrl || null,
      tags: tagsArray.join(","),
      slug
    }
  });

  revalidatePath("/admin/artists");
  revalidatePath("/artistes");
  redirect("/admin/artists");
}

export default function NewArtistPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Nouvel artiste</h1>
      <form action={createArtist} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="name">
            Nom de scène
          </label>
          <input
            id="name"
            name="name"
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
            className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="btn-primary text-sm">
          Enregistrer
        </button>
      </form>
    </div>
  );
}

