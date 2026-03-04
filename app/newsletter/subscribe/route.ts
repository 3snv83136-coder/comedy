import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  let email: string | null = null;

  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => null);
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }
    email = parsed.data.email;
  } else {
    const formData = await request.formData();
    const parsed = newsletterSchema.safeParse({
      email: String(formData.get("email") || "")
    });
    if (!parsed.success) {
      return NextResponse.redirect(
        new URL("/?newsletter_error=1", request.url),
        { status: 303 }
      );
    }
    email = parsed.data.email;
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email },
    update: {}
  });

  // Double opt-in recommandé mais non implémenté ici.

  if (contentType.includes("application/json")) {
    return NextResponse.json({
      message:
        "Inscription enregistrée. Un double opt-in est recommandé mais non implémenté dans ce template."
    });
  }

  return NextResponse.redirect(
    new URL("/?newsletter_ok=1", request.url),
    { status: 303 }
  );
}


