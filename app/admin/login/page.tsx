import { Metadata } from "next";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validators";

export const metadata: Metadata = {
  title: "Connexion back-office"
};

async function loginAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    redirect("/admin/login?error=1");
  }

  await signIn("credentials", {
    redirectTo: "/admin",
    formData
  });
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-background to-black">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-card/80 p-6 shadow-neon-pink">
        <h1 className="text-xl font-semibold mb-2 text-center">
          Back-office Biiip
        </h1>
        <p className="text-xs text-muted mb-4 text-center">
          Accès réservé à l&apos;équipe de l&apos;association.
        </p>
        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="email">
              Email
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
            <label className="block text-sm mb-1" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            />
          </div>
          <button type="submit" className="btn-primary w-full text-sm">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

