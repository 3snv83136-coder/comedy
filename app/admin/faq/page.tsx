import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function createFaq(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session) redirect("/admin/login");

  const question = String(formData.get("question") || "");
  const answer = String(formData.get("answer") || "");

  if (!question || !answer) {
    redirect("/admin/faq?error=1");
  }

  const maxOrder = await prisma.fAQ.aggregate({
    _max: { order: true }
  });

  await prisma.fAQ.create({
    data: {
      question,
      answer,
      order: (maxOrder._max.order ?? 0) + 1
    }
  });

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

async function deleteFaq(id: number) {
  "use server";
  const session = await auth();
  if (!session) redirect("/admin/login");

  await prisma.fAQ.delete({ where: { id } });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

async function getFaq() {
  return prisma.fAQ.findMany({
    orderBy: { order: "asc" }
  });
}

export default async function AdminFAQPage() {
  const faq = await getFaq();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold mb-1">FAQ</h1>
        <p className="text-xs text-muted">
          Gérer les questions fréquentes affichées sur la page publique.
        </p>
      </div>
      <form action={createFaq} className="space-y-3 max-w-xl rounded-2xl border border-zinc-800 bg-card/70 p-4">
        <h2 className="text-sm font-semibold">Nouvelle question</h2>
        <div>
          <label className="block text-xs mb-1" htmlFor="question">
            Question
          </label>
          <input
            id="question"
            name="question"
            required
            className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs mb-1" htmlFor="answer">
            Réponse
          </label>
          <textarea
            id="answer"
            name="answer"
            required
            rows={3}
            className="w-full rounded-md bg-black/40 border border-zinc-700 px-3 py-2 text-xs"
          />
        </div>
        <button type="submit" className="btn-primary text-xs">
          Ajouter
        </button>
      </form>
      <div className="rounded-2xl border border-zinc-800 bg-card/70 divide-y divide-zinc-800">
        {faq.map((item) => (
          <div key={item.id} className="p-3 flex items-start justify-between gap-4 text-xs">
            <div>
              <p className="font-medium mb-1">{item.question}</p>
              <p className="text-muted whitespace-pre-line">{item.answer}</p>
            </div>
            <form
              action={async () => {
                "use server";
                await deleteFaq(item.id);
              }}
            >
              <button
                type="submit"
                className="text-[11px] text-red-400 hover:text-red-300"
              >
                Supprimer
              </button>
            </form>
          </div>
        ))}
        {faq.length === 0 && (
          <div className="p-4 text-xs text-muted">
            Aucune question pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}

