import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function updateStatus(id: string, status: string) {
  "use server";
  const session = await auth();
  if (!session) redirect("/admin/login");

  if (!["NEW", "IN_REVIEW", "ACCEPTED", "REJECTED"].includes(status)) {
    return;
  }

  await prisma.submission.update({
    where: { id },
    data: { status: status as any }
  });

  revalidatePath("/admin/submissions");
}

async function getSubmissions(status?: string) {
  return prisma.submission.findMany({
    where: status && status !== "ALL" ? { status: status as any } : {},
    orderBy: { createdAt: "desc" }
  });
}

export default async function AdminSubmissionsPage({
  searchParams
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status || "ALL";
  const submissions = await getSubmissions(status);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold mb-1">Demandes de passage</h1>
          <p className="text-xs text-muted">
            Suivre les candidatures, lire les messages et gérer les statuts.
          </p>
        </div>
        <a
          href="/api/admin/submissions/export"
          className="btn-outline text-xs"
        >
          Export CSV
        </a>
      </div>
      <form className="text-xs mb-2">
        <label className="mr-2">Filtrer par statut :</label>
        <select
          name="status"
          defaultValue={status}
          className="rounded-full bg-black/40 border border-zinc-700 px-2 py-1"
        >
          <option value="ALL">Tous</option>
          <option value="NEW">Nouveau</option>
          <option value="IN_REVIEW">En cours</option>
          <option value="ACCEPTED">Accepté</option>
          <option value="REJECTED">Refusé</option>
        </select>
      </form>
      <div className="rounded-2xl border border-zinc-800 bg-card/70 divide-y divide-zinc-800">
        {submissions.map((s) => (
          <div key={s.id} className="p-3 text-xs flex flex-col gap-2">
            <div className="flex justify-between gap-2">
              <div>
                <p className="font-medium">
                  {s.stageName || s.fullName}{" "}
                  <span className="text-muted">({s.fullName})</span>
                </p>
                <p className="text-muted">
                  {s.email}
                  {s.phone && ` · ${s.phone}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-muted">
                  {new Date(s.createdAt).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] mt-1 ${
                    s.status === "NEW"
                      ? "bg-primary-500/20 text-primary-300 border border-primary-500/50"
                      : s.status === "ACCEPTED"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                        : s.status === "REJECTED"
                          ? "bg-red-500/20 text-red-300 border border-red-500/50"
                          : "bg-zinc-900 text-zinc-300 border border-zinc-700"
                  }`}
                >
                  {s.status === "NEW"
                    ? "Nouveau"
                    : s.status === "IN_REVIEW"
                      ? "En cours"
                      : s.status === "ACCEPTED"
                        ? "Accepté"
                        : "Refusé"}
                </span>
              </div>
            </div>
            <p className="whitespace-pre-line text-muted">{s.message}</p>
            <div className="flex items-center justify-between gap-2">
              {s.fileUrl ? (
                <a
                  href={s.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-primary-400 hover:text-primary-300"
                >
                  Télécharger le dossier (PDF)
                </a>
              ) : (
                <span className="text-[11px] text-muted">
                  Aucune pièce jointe
                </span>
              )}
              <form
                action={async (formData) => {
                  "use server";
                  const status = String(formData.get("status") || "");
                  await updateStatus(s.id, status);
                }}
                className="flex items-center gap-1"
              >
                <label className="text-[11px] text-muted" htmlFor={`status-${s.id}`}>
                  Statut :
                </label>
                <select
                  id={`status-${s.id}`}
                  name="status"
                  defaultValue={s.status}
                  className="rounded-full bg-black/40 border border-zinc-700 px-2 py-1 text-[11px]"
                >
                  <option value="NEW">Nouveau</option>
                  <option value="IN_REVIEW">En cours</option>
                  <option value="ACCEPTED">Accepté</option>
                  <option value="REJECTED">Refusé</option>
                </select>
                <button
                  type="submit"
                  className="text-[11px] text-primary-400 hover:text-primary-300"
                >
                  Mettre à jour
                </button>
              </form>
            </div>
          </div>
        ))}
        {submissions.length === 0 && (
          <div className="p-4 text-xs text-muted">
            Aucune demande pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}

