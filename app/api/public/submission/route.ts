import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submissionSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rateLimit";
import { uploadFile } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const ok = rateLimit(ip, { windowMs: 60_000, max: 5 });
  if (!ok) {
    return NextResponse.json(
      { error: "Trop de demandes, réessayez plus tard." },
      { status: 429 }
    );
  }

  const formData = await request.formData();

  const data = {
    fullName: String(formData.get("fullName") || ""),
    stageName: formData.get("stageName")
      ? String(formData.get("stageName"))
      : undefined,
    email: String(formData.get("email") || ""),
    phone: formData.get("phone") ? String(formData.get("phone")) : undefined,
    message: String(formData.get("message") || ""),
    honeypot: String(formData.get("website") || "")
  };

  const parsed = submissionSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Champs invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  let fileUrl: string | undefined;
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadFile(file, "submissions");
    fileUrl = uploaded.url;
  }

  const created = await prisma.submission.create({
    data: {
      fullName: parsed.data.fullName,
      stageName: parsed.data.stageName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message,
      fileUrl
    }
  });

  // Optionnel : envoi email si SMTP configuré (non bloquant)
  if (process.env.SMTP_HOST && process.env.SUBMISSION_NOTIFY_EMAIL) {
    // Ici, vous pouvez brancher un envoi via nodemailer ou un service externe.
    // Pour garder le template léger, l'implémentation concrète n'est pas incluse.
  }

  return NextResponse.redirect(new URL("/demande-de-passage?ok=1", request.url), {
    status: 303
  });
}

