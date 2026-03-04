import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le Club",
  description:
    "Histoire, valeurs et infos pratiques du Biiip Comedy Club, association de stand-up."
};

export default async function LeClubPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="container py-10 md:py-14">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">Le Club</h1>
      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        <section className="prose prose-invert max-w-none text-sm">
          <p>
            Biiip Comedy Club est une association qui organise des plateaux de
            stand-up, open mics et soirées spéciales à Paris et en Île-de-France.
          </p>
          <p>
            Notre objectif : proposer un espace bienveillant pour les humoristes
            débutant·es ou confirmé·es, où l&apos;on peut tester, rater,
            recommencer, et surtout faire rire.
          </p>
          <h2>Valeurs</h2>
          <ul>
            <li>Respect du public et des artistes</li>
            <li>Ambiance club intimiste et chaleureuse</li>
            <li>Ouverture aux nouvelles voix et scènes émergentes</li>
          </ul>
          <h2>Accessibilité</h2>
          <p>
            Nous faisons notre possible pour accueillir tous les publics. Si
            vous avez des besoins spécifiques (mobilité, audition, etc.),
            contactez-nous en amont pour préparer au mieux votre venue.
          </p>
        </section>
        <aside className="space-y-4 text-sm">
          <div className="rounded-2xl border border-zinc-800 bg-card/70 p-4">
            <h2 className="font-semibold mb-2">Infos pratiques</h2>
            <div className="space-y-1 text-sm text-muted">
              {settings?.address && (
                <p>
                  <span className="text-foreground">Adresse :</span>{" "}
                  {settings.address}
                </p>
              )}
              {settings?.email && (
                <p>
                  <span className="text-foreground">Email :</span>{" "}
                  {settings.email}
                </p>
              )}
              {settings?.phone && (
                <p>
                  <span className="text-foreground">Téléphone :</span>{" "}
                  {settings.phone}
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

