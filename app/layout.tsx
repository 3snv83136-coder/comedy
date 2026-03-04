import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Biiip Comedy Club - Stand-up à Paris",
    template: "%s | Biiip Comedy Club"
  },
  description:
    "Biiip Comedy Club, association de stand-up : soirées humour, plateau d'artistes et open mics à Paris.",
  openGraph: {
    title: "Biiip Comedy Club",
    description:
      "Plateaux de stand-up, artistes émergents et ambiance club à Paris.",
    url: baseUrl,
    siteName: "Biiip Comedy Club",
    type: "website",
    locale: "fr_FR"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-background text-foreground">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-zinc-800 bg-black/60 backdrop-blur">
            <div className="container flex items-center justify-between py-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative h-10 w-28 md:w-32">
                  <Image
                    src="/logo-biiip.png"
                    alt="Biiip Comedy Club"
                    fill
                    className="object-contain drop-shadow-[0_0_20px_rgba(0,184,255,0.7)]"
                    sizes="128px"
                    priority
                  />
                </div>
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <Link href="/programmation">Programmation</Link>
                <a href="mailto:contact@biiip-comedy.club">Contact</a>
              </nav>
              <a
                href="mailto:contact@biiip-comedy.club"
                className="btn-outline text-xs"
              >
                Écrire au club
              </a>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-zinc-800 bg-black/80 mt-10">
            <div className="container py-8 text-sm text-muted flex flex-col md:flex-row items-center justify-between gap-4">
              <p>© {new Date().getFullYear()} Biiip Comedy Club. Tous droits réservés.</p>
              <p>
                Contact :{" "}
                <a href="mailto:contact@biiip-comedy.club">
                  contact@biiip-comedy.club
                </a>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

