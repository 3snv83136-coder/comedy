import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const ok = rateLimit(ip, { windowMs: 60_000, max: 5 });
  if (!ok) {
    return NextResponse.json(
      { error: "Trop de messages, réessayez plus tard." },
      { status: 429 }
    );
  }

  const formData = await request.formData();

  const data = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    message: String(formData.get("message") || ""),
    honeypot: String(formData.get("website") || "")
  };

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Champs invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Option : envoi email via SMTP si configuré.
  if (process.env.SMTP_HOST && process.env.CONTACT_NOTIFY_EMAIL) {
    // Brancher un envoi réel (nodemailer, service externe).
  }

  return NextResponse.redirect(new URL("/contact?ok=1", request.url), {
    status: 303
  });
}

