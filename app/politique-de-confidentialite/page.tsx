import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité et informations RGPD concernant les données collectées par Biiip Comedy Club."
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="container py-10 md:py-14 text-sm">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">
        Politique de confidentialité
      </h1>
      <div className="space-y-4 text-muted max-w-3xl">
        <section>
          <h2 className="font-semibold text-foreground mb-1">
            Données collectées
          </h2>
          <p>
            Le site peut collecter les données que vous fournissez via les
            formulaires (contact, demande de passage, inscription newsletter) :
            nom, email, message, et éventuellement un numéro de téléphone ou un
            lien vidéo.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-foreground mb-1">
            Finalités du traitement
          </h2>
          <p>
            Ces informations sont utilisées uniquement pour répondre à vos
            messages, traiter les demandes de passage ou vous envoyer des
            informations si vous vous inscrivez à la newsletter.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-foreground mb-1">
            Base légale et durée de conservation
          </h2>
          <p>
            Le traitement est fondé sur votre consentement et/ou l&apos;intérêt
            légitime de l&apos;association à organiser ses activités. Les
            messages et demandes peuvent être conservés le temps nécessaire à
            leur traitement et à la gestion de la programmation.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-foreground mb-1">
            Destinataires
          </h2>
          <p>
            Les données sont destinées uniquement à l&apos;équipe
            organisatrice. Elles ne sont pas cédées ni revendues à des tiers.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-foreground mb-1">
            Vos droits
          </h2>
          <p>
            Vous pouvez demander l&apos;accès, la rectification ou la
            suppression de vos données en nous contactant par email. Sous
            réserve de justifier de votre identité, nous traiterons votre
            demande dans les meilleurs délais.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-foreground mb-1">
            Cookies et services externes
          </h2>
          <p>
            Le site évite l&apos;usage de cookies non essentiels par défaut.
            Certains services externes (cartes, vidéos, billetteries) peuvent
            toutefois déposer des cookies propres. Un bandeau d&apos;information
            et/ou de consentement peut être ajouté si de tels outils sont
            intégrés.
          </p>
        </section>
      </div>
    </div>
  );
}

