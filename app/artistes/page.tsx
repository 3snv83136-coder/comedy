import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artistes",
  description:
    "Artistes et humoristes passé·es par Biiip Comedy Club : bios, réseaux et vidéos."
};

async function getArtists() {
  return prisma.artist.findMany({
    orderBy: { name: "asc" }
  });
}

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <div className="container py-10 md:py-14">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">Artistes</h1>
        <p className="text-sm text-muted max-w-xl">
          Une sélection d&apos;humoristes émergent·es et confirmé·es qui ont
          foulé la scène du Biiip Comedy Club.
        </p>
      </div>
      {artists.length === 0 && (
        <p className="text-sm text-muted">
          La galerie d&apos;artistes sera bientôt en ligne.
        </p>
      )}
      <div className="grid gap-6 md:grid-cols-3">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/artistes/${artist.slug}`}
            className="group rounded-2xl border border-zinc-800 bg-card/70 hover:border-primary-500 transition-colors overflow-hidden flex flex-col"
          >
            <div className="relative h-40 w-full bg-zinc-900">
              {artist.photoUrl && (
                <Image
                  src={artist.photoUrl}
                  alt={artist.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h2 className="font-semibold mb-1">{artist.name}</h2>
              <p className="text-xs text-muted line-clamp-3 mb-3">
                {artist.bioShort}
              </p>
              {artist.tags && (
                <div className="mt-auto flex flex-wrap gap-1">
                  {artist.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                    .slice(0, 3)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-zinc-900 px-2 py-0.5 text-[11px] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

