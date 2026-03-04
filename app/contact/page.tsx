import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contacter l'équipe du Biiip Comedy Club pour une question, une collaboration ou une demande de passage."
};

export default function ContactPage() {
  return (
    <div className="container py-10 md:py-14">
      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        <section>
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">Contact</h1>
          <p className="text-sm text-muted mb-6 max-w-xl">
            Une question sur la programmation, la billetterie, ou l&apos;envie
            de collaborer avec Biiip Comedy Club ? Écrivez-nous.
          </p>
          <form
            className="space-y-4 rounded-2xl border border-zinc-800 bg-card/70 p-6"
            method="post"
            action="/api/public/contact"
          >
            <input
              type="text"
              name="website"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />
            <div>
              <label className="block text-sm mb-1" htmlFor="name">
                Nom *
              </label>
              <input
                id="name"
                name="name"
                required
                className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              />
            </div>
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
              <label className="block text-sm mb-1" htmlFor="message">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              />
            </div>
            <button type="submit" className="btn-primary text-sm">
              Envoyer le message
            </button>
            <p className="text-[11px] text-muted">
              Le formulaire utilise une protection anti-spam basique et vos
              données ne sont utilisées que pour répondre à votre message.
            </p>
          </form>
        </section>
        <aside className="space-y-4 text-sm">
          <div className="rounded-2xl border border-zinc-800 bg-card/70 p-4">
            <h2 className="font-semibold mb-2 text-sm">Infos pratiques</h2>
            <p className="text-xs text-muted">
              Les informations détaillées (adresse, email, réseaux) sont
              configurables dans le back-office.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-card/70 p-4">
            <h2 className="font-semibold mb-2 text-sm">Carte</h2>
            <p className="text-xs text-muted mb-2">
              Vous pouvez intégrer une carte (Google Maps, OpenStreetMap) via un
              iframe ou un widget externe. Pensez à ajouter un bandeau de
              consentement cookies si nécessaire.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

