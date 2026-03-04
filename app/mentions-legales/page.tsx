import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales de l'association Biiip Comedy Club, organisatrice de plateaux de stand-up."
};

export default function MentionsLegalesPage() {
  return (
    <div className="container py-10 md:py-14 text-sm">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">
        Mentions légales
      </h1>
      <div className="space-y-4 text-muted max-w-3xl">
        <section>
          <h2 className="font-semibold text-foreground mb-1">
            Éditeur du site
          </h2>
          <p>
            Le site Biiip Comedy Club est édité par une association loi 1901
            (dénomination, adresse et numéro RNA à compléter dans le
            back-office).
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-foreground mb-1">
            Responsable de la publication
          </h2>
          <p>
            Le ou la président·e de l&apos;association est responsable de la
            publication des contenus.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-foreground mb-1">
            Hébergement
          </h2>
          <p>
            Le site peut être hébergé chez Vercel Inc. ou un autre prestataire
            d&apos;hébergement. Les informations précises peuvent être ajoutées
            ici.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-foreground mb-1">
            Propriété intellectuelle
          </h2>
          <p>
            Les contenus (textes, visuels hors logos tiers, etc.) sont la
            propriété de l&apos;association ou de leurs auteur·rices et ne
            peuvent être reproduits sans autorisation.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-foreground mb-1">
            Limitation de responsabilité
          </h2>
          <p>
            Les informations présentes sur ce site sont fournies à titre
            indicatif et peuvent évoluer. L&apos;association ne saurait être
            tenue responsable d&apos;un mauvais usage du site ou des liens
            externes de billetterie.
          </p>
        </section>
      </div>
    </div>
  );
}

