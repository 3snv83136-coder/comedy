import { ReactNode } from "react";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const role =
    // @ts-expect-error role on session user
    session.user?.role || "EDITOR";

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="min-h-screen bg-black text-foreground">
      <div className="border-b border-zinc-800 bg-black/80 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted hover:text-primary-500">
              ← Retour au site
            </Link>
            <span className="text-sm font-semibold">
              Biiip Comedy Club · Back-office
            </span>
            <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[11px] text-muted border border-zinc-700">
              {role === "ADMIN" ? "Admin" : "Éditeur"}
            </span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-xs text-muted hover:text-primary-500"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>
      <div className="container py-6 flex gap-6">
        <aside className="w-56 hidden md:block">
          <nav className="space-y-1 text-sm">
            <Link href="/admin" className="block py-1.5 text-muted hover:text-white">
              Dashboard
            </Link>
            <Link
              href="/admin/events"
              className="block py-1.5 text-muted hover:text-white"
            >
              Événements
            </Link>
            <Link
              href="/admin/artists"
              className="block py-1.5 text-muted hover:text-white"
            >
              Artistes
            </Link>
            <Link
              href="/admin/faq"
              className="block py-1.5 text-muted hover:text-white"
            >
              FAQ
            </Link>
            <Link
              href="/admin/submissions"
              className="block py-1.5 text-muted hover:text-white"
            >
              Demandes de passage
            </Link>
            {role === "ADMIN" && (
              <Link
                href="/admin/settings"
                className="block py-1.5 text-muted hover:text-white"
              >
                Paramètres du site
              </Link>
            )}
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

