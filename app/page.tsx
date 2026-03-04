import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Soirées stand-up et plateaux d'humour",
  description:
    "Découvrez la programmation stand-up de Biiip Comedy Club : artistes émergents, plateaux, open mics et soirées spéciales."
};

async function getHomeData() {
  const [settings, events] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.event.findMany({
      where: { status: "PUBLISHED", startDate: { gte: new Date() } },
      orderBy: { startDate: "asc" },
      take: 4
    })
  ]);
  return { settings, events };
}

export default async function HomePage() {
  const { settings, events } = await getHomeData();

  return (
    <div className="bg-gradient-to-b from-black via-background to-black">
      <section className="border-b border-zinc-800">
        <div className="container py-16 md:py-24 grid gap-10 md:grid-cols-[3fr,2fr] items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary-500 mb-4">
              Association de stand-up
            </p>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Biiip Comedy Club
            </h1>
            <p className="text-lg text-muted mb-6 max-w-xl">
              {settings?.heroText ??
                "Plateaux d'humour, open mics et soirées spéciales dans une ambiance club intimiste."}
            </p>
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <Link href="/programmation" className="btn-primary">
                Voir la programmation
              </Link>
              <Link href="/demande-de-passage" className="btn-outline">
                Demander un passage
              </Link>
            </div>
            {settings?.address && (
              <p className="text-sm text-muted">
                <span className="font-medium text-foreground">Où ? </span>
                {settings.address}
              </p>
            )}
          </div>
          <div className="relative h-64 md:h-80">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary-500 via-black to-neonBlue opacity-60 blur-3xl" />
            <div className="relative h-full rounded-3xl border border-zinc-800 bg-card/80 backdrop-blur p-5 shadow-neon-blue flex flex-col justify-between">
              <div>
                <p className="text-xs text-muted mb-2">À venir</p>
                <h2 className="text-lg font-semibold mb-3">
                  Prochains plateaux
                </h2>
                <div className="space-y-3 text-sm">
                  {events.length === 0 && (
                    <p className="text-muted">
                      La prochaine programmation arrive bientôt. Suivez-nous sur
                      les réseaux !
                    </p>
                  )}
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between gap-3"
                    >
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-xs text-muted">
                          {new Date(event.startDate).toLocaleDateString(
                            "fr-FR",
                            {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit"
                            }
                          )}{" "}
                          · {event.venueName}
                        </p>
                      </div>
                      <a
                        href={event.bookingUrl}
                        className="text-xs rounded-full border border-primary-500 px-3 py-1 hover:bg-primary-500 hover:text-white"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Réserver
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-muted mt-3">
                La réservation se fait via un site externe.{" "}
                <span className="text-xs text-primary-500">
                  Vous quittez le site lors du paiement.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-card/70 p-6">
            <p className="badge mb-3">Ambiance club</p>
            <h3 className="font-semibold mb-2">Proche des artistes</h3>
            <p className="text-sm text-muted">
              Une jauge intimiste, un MC chaleureux, des artistes qui testent,
              cassent et improvisent.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-card/70 p-6">
            <p className="badge mb-3">Programmation</p>
            <h3 className="font-semibold mb-2">Plateaux & open mics</h3>
            <p className="text-sm text-muted">
              Des soirées régulières pour découvrir la nouvelle scène stand-up
              et venir jouer si vous êtes humoriste.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-card/70 p-6">
            <p className="badge mb-3">Association</p>
            <h3 className="font-semibold mb-2">Projet bénévole</h3>
            <p className="text-sm text-muted">
              Une association loi 1901 qui soutient la création humoristique et
              l&apos;émergence de nouveaux talents.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-16 border-t border-zinc-800">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative h-52 w-full md:w-1/2">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary-500 via-black to-accent opacity-50 blur-2xl" />
            <div className="relative h-full rounded-3xl border border-zinc-800 bg-card/80 flex items-center justify-center">
              <Image
                src="https://images.pexels.com/photos/1554287/pexels-photo-1554287.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Ambiance stand-up"
                fill
                className="object-cover rounded-3xl opacity-80"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold mb-3">Envie de jouer ?</h2>
            <p className="text-sm text-muted mb-4">
              Biiip Comedy Club accueille des humoristes débutant·es ou
              confirmé·es. Envoyez-nous une demande de passage avec quelques
              infos sur votre expérience et un lien vidéo si possible.
            </p>
            <Link href="/demande-de-passage" className="btn-primary">
              Faire une demande de passage
            </Link>
          </div>
        </div>
      </section>
      <section className="border-t border-zinc-800 bg-black/60">
        <div className="container py-10 md:py-12 grid gap-8 md:grid-cols-[2fr,1fr] items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Newsletter (optionnelle)
            </h2>
            <p className="text-sm text-muted mb-3 max-w-xl">
              Recevez, si vous le souhaitez, les infos sur les prochaines
              soirées stand-up du Biiip Comedy Club.
            </p>
            <p className="text-[11px] text-amber-400 mb-3">
              Le double opt-in (confirmation par email) est recommandé pour un
              usage réel mais n&apos;est pas implémenté dans ce template.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md"
              method="post"
              action="/newsletter/subscribe"
            >
              <label className="sr-only" htmlFor="newsletter-email">
                Email
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="votre@email"
                className="flex-1 rounded-full bg-black/40 border border-zinc-700 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              />
              <button type="submit" className="btn-primary text-sm">
                S&apos;inscrire
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

