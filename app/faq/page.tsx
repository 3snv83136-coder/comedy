import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Questions fréquentes sur les soirées stand-up, la réservation et les demandes de passage."
};

async function getFaq() {
  return prisma.fAQ.findMany({
    orderBy: { order: "asc" }
  });
}

export default async function FAQPage() {
  const faq = await getFaq();

  return (
    <div className="container py-10 md:py-14">
      <h1 className="text-2xl md:text-3xl font-semibold mb-2">FAQ</h1>
      <p className="text-sm text-muted mb-6 max-w-xl">
        Quelques réponses aux questions les plus fréquentes concernant le club,
        la billetterie et les demandes de passage.
      </p>
      <div className="space-y-3">
        {faq.length === 0 && (
          <p className="text-sm text-muted">
            La FAQ sera complétée prochainement.
          </p>
        )}
        {faq.map((item) => (
          <details
            key={item.id}
            className="group rounded-2xl border border-zinc-800 bg-card/70 p-4"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className="font-medium text-sm">{item.question}</span>
              <span className="text-xs text-muted group-open:hidden">+</span>
              <span className="text-xs text-muted hidden group-open:inline">
                -
              </span>
            </summary>
            <div className="mt-2 text-sm text-muted">
              {item.answer.split("\n").map((p, idx) => (
                <p key={idx} className={idx > 0 ? "mt-1" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

