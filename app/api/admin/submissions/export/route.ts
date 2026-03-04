import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" }
  });

  const header = [
    "id",
    "fullName",
    "stageName",
    "email",
    "phone",
    "message",
    "fileUrl",
    "status",
    "createdAt"
  ];

  const rows = submissions.map((s) =>
    [
      s.id,
      s.fullName,
      s.stageName || "",
      s.email,
      s.phone || "",
      s.message.replace(/\r?\n/g, " "),
      s.fileUrl || "",
      s.status,
      s.createdAt.toISOString()
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );

  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="submissions.csv"`
    }
  });
}

