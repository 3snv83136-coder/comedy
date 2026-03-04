import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function updateSettings(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session) redirect("/admin/login");

  // @ts-expect-error role on user
  if (session.user?.role !== "ADMIN") {
    redirect("/admin");
  }

  const clubName = String(formData.get("clubName") || "");
  const address = String(formData.get("address") || "");
  const phone = String(formData.get("phone") || "");
  const email = String(formData.get("email") || "");
  const heroText = String(formData.get("heroText") || "");
  const aboutText = String(formData.get("aboutText") || "");

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      clubName,
      address,
      phone,
      email,
      heroText,
      aboutText,
      socialLinks: {}
    },
    create: {
      id: 1,
      clubName,
      address,
      phone,
      email,
      heroText,
      aboutText,
      socialLinks: {}
    }
  });

  revalidatePath("/");
  revalidatePath("/le-club");
  redirect("/admin/settings");
}

async function getSettings() {
  return prisma.siteSettings.findFirst();
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Paramètres du site</h1>
      <form action={updateSettings} className="space-y-3">
        <div>
          <label className="block text-sm mb-1" htmlFor="clubName">
            Nom du club
          </label>
          <input
            id="clubName"
            name="clubName"
            defaultValue={settings?.clubName || "Biiip Comedy Club"}
            className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="address">
            Adresse
          </label>
          <input
            id="address"
            name="address"
            defaultValue={settings?.address || ""}
            className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="phone">
              Téléphone
            </label>
            <input
              id="phone"
              name="phone"
              defaultValue={settings?.phone || ""}
              className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="email">
              Email de contact
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={settings?.email || ""}
              className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="heroText">
            Texte de mise en avant (Accueil)
          </label>
          <textarea
            id="heroText"
            name="heroText"
            rows={3}
            defaultValue={settings?.heroText || ""}
            className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="aboutText">
            Texte &quot;À propos&quot;
          </label>
          <textarea
            id="aboutText"
            name="aboutText"
            rows={4}
            defaultValue={settings?.aboutText || ""}
            className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="btn-primary text-sm">
          Enregistrer
        </button>
      </form>
    </div>
  );
}

