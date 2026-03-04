import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demande de passage",
  description:
    "Envoyer une demande de passage au Biiip Comedy Club : infos, expérience et lien vidéo."
};

export default function DemandeDePassagePage() {
  return (
    <div className="container py-10 md:py-14">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
          Demande de passage
        </h1>
        <p className="text-sm text-muted">
          Vous souhaitez jouer au Biiip Comedy Club ? Remplissez le formulaire
          ci-dessous. Si vous avez déjà un dossier de candidature, vous pouvez
          aussi le joindre en PDF.
        </p>
      </div>
      <div className="grid gap-10 md:grid-cols-[2fr,1fr]">
        <section>
          <form
            className="space-y-4 rounded-2xl border border-zinc-800 bg-card/70 p-6"
            action="/api/public/submission"
            method="post"
            encType="multipart/form-data"
          >
            <input
              type="text"
              name="website"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />
            <div>
              <label className="block text-sm mb-1" htmlFor="fullName">
                Nom complet *
              </label>
              <input
                id="fullName"
                name="fullName"
                required
                className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="stageName">
                Nom de scène
              </label>
              <input
                id="stageName"
                name="stageName"
                className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1" htmlFor="email">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="phone">
                  Téléphone
                </label>
                <input
                  id="phone"
                  name="phone"
                  className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="message">
                Message / Présentation *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              />
              <p className="mt-1 text-[11px] text-muted">
                Parlez-nous de votre expérience, du type de plateau recherché,
                liens vidéos, etc.
              </p>
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="file">
                Joindre un dossier (PDF)
              </label>
              <input
                id="file"
                name="file"
                type="file"
                accept="application/pdf"
                className="text-xs text-muted file:mr-2 file:rounded-full file:border-0 file:bg-primary-500 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-primary-600"
              />
            </div>
            <button type="submit" className="btn-primary text-sm">
              Envoyer la demande
            </button>
            <p className="text-[11px] text-muted">
              Vos informations sont utilisées uniquement pour répondre à votre
              demande de passage. Elles ne sont pas revendues.
            </p>
          </form>
        </section>
        <aside className="space-y-4 text-sm">
          <div className="rounded-2xl border border-zinc-800 bg-card/70 p-4">
            <h2 className="font-semibold mb-2 text-sm">
              Dossier de candidature (PDF)
            </h2>
            <p className="text-xs text-muted mb-3">
              Si vous préférez, vous pouvez télécharger un modèle de dossier de
              candidature à remplir.
            </p>
            <Link
              href="/docs/dossier-candidature.pdf"
              className="btn-outline text-xs"
            >
              Télécharger le modèle PDF
            </Link>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-card/70 p-4">
            <h2 className="font-semibold mb-2 text-sm">
              Anti-spam et confidentialité
            </h2>
            <p className="text-xs text-muted">
              Un système anti-spam et une limitation de fréquence sont appliqués
              côté serveur. Les pièces jointes sont stockées de manière
              sécurisée (stockage local en développement, S3/Cloudinary en
              production).
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

