import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artist = await prisma.artist.findUnique({
    where: { slug: params.slug }
  });
  if (!artist) {
    return {
      title: "Artiste introuvable"
    };
  }
  return {
    title: artist.name,
    description: artist.bioShort
  };
}

export default async function ArtistPage({ params }: Props) {
  const artist = await prisma.artist.findUnique({
    where: { slug: params.slug }
  });

  if (!artist) {
    return (
      <div className="container py-10">
        <p className="text-sm text-muted">Artiste introuvable.</p>
      </div>
    );
  }

  return (
    <div className="container py-10 md:py-14 grid gap-10 md:grid-cols-[2fr,1fr]">
      <section>
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
          {artist.name}
        </h1>
        <p className="text-sm text-muted mb-6">{artist.bioShort}</p>
        {artist.bioLong && (
          <div className="prose prose-invert max-w-none text-sm">
            {artist.bioLong.split("\n").map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        )}
      </section>
      <aside className="space-y-4 text-sm">
        <div className="rounded-2xl border border-zinc-800 bg-card/70 p-4">
          <h2 className="font-semibold mb-2">Réseaux</h2>
          <div className="space-y-1">
            {artist.instagram && (
              <a
                href={artist.instagram}
                target="_blank"
                rel="noreferrer"
                className="block text-sm"
              >
                Instagram
              </a>
            )}
            {artist.tiktok && (
              <a
                href={artist.tiktok}
                target="_blank"
                rel="noreferrer"
                className="block text-sm"
              >
                TikTok
              </a>
            )}
            {artist.youtube && (
              <a
                href={artist.youtube}
                target="_blank"
                rel="noreferrer"
                className="block text-sm"
              >
                YouTube
              </a>
            )}
            {artist.website && (
              <a
                href={artist.website}
                target="_blank"
                rel="noreferrer"
                className="block text-sm"
              >
                Site web
              </a>
            )}
            {!artist.instagram &&
              !artist.tiktok &&
              !artist.youtube &&
              !artist.website && (
                <p className="text-xs text-muted">
                  Les liens de l&apos;artiste seront ajoutés bientôt.
                </p>
              )}
          </div>
        </div>
        {artist.videoEmbedUrl && (
          <div className="rounded-2xl border border-zinc-800 bg-card/70 p-3">
            <h2 className="font-semibold mb-2 text-sm">Vidéo</h2>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe
                src={artist.videoEmbedUrl}
                title={`Vidéo de ${artist.name}`}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        )}
        {artist.tags?.length > 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-card/70 p-3">
            <h2 className="font-semibold mb-2 text-sm">Styles</h2>
            <div className="flex flex-wrap gap-1">
              {artist.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-900 px-2 py-0.5 text-[11px] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

