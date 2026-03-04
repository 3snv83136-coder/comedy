import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function deleteArtist(id: string) {
  "use server";
  const session = await auth();
  if (!session) redirect("/admin/login");
  await prisma.artist.delete({ where: { id } });
  revalidatePath("/admin/artists");
  revalidatePath("/artistes");
}

async function getArtists(search?: string) {
  return prisma.artist.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { bioShort: { contains: search, mode: "insensitive" } }
          ]
        }
      : {},
    orderBy: { name: "asc" }
  });
}

export default async function AdminArtistsPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const artists = await getArtists(searchParams.q);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold mb-1">Artistes</h1>
          <p className="text-xs text-muted">
            Gérer les fiches artistes, bios et liens.
          </p>
        </div>
        <Link href="/admin/artists/new" className="btn-primary text-xs">
          Nouvel artiste
        </Link>
      </div>
      <form className="mb-3">
        <input
          name="q"
          defaultValue={searchParams.q}
          placeholder="Rechercher par nom"
          className="w-full max-w-xs rounded-full bg-black/40 border border-zinc-700 px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        />
      </form>
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-card/70">
        <table className="min-w-full text-xs">
          <thead className="bg-black/40 text-muted">
            <tr>
              <th className="px-3 py-2 text-left font-normal">Nom</th>
              <th className="px-3 py-2 text-left font-normal">Bio courte</th>
              <th className="px-3 py-2 text-left font-normal">Tags</th>
              <th className="px-3 py-2 text-right font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
              <tr key={artist.id} className="border-t border-zinc-800">
                <td className="px-3 py-2 align-top">
                  <div className="font-medium">{artist.name}</div>
                  <div className="text-[11px] text-muted">{artist.slug}</div>
                </td>
                <td className="px-3 py-2 align-top text-xs text-muted line-clamp-3 max-w-xs">
                  {artist.bioShort}
                </td>
                <td className="px-3 py-2 align-top text-xs text-muted">
                  {artist.tags}
                </td>
                <td className="px-3 py-2 align-top text-right space-x-2">
                  <Link
                    href={`/artistes/${artist.slug}`}
                    className="text-[11px] text-muted hover:text-primary-500"
                  >
                    Voir
                  </Link>
                  <Link
                    href={`/admin/artists/${artist.id}/edit`}
                    className="text-[11px] text-muted hover:text-primary-500"
                  >
                    Modifier
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteArtist(artist.id);
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
            {artists.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-6 text-center text-xs text-muted"
                >
                  Aucun artiste pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

