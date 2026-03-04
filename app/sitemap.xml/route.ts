import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [events, artists] = await Promise.all([
    prisma.event.findMany({ where: { status: "PUBLISHED" } }),
    prisma.artist.findMany()
  ]);

  const urls: string[] = [
    "",
    "/programmation",
    "/artistes",
    "/le-club",
    "/demande-de-passage",
    "/faq",
    "/contact",
    "/mentions-legales",
    "/politique-de-confidentialite"
  ];

  const eventUrls = events.map((e) => `/programmation/${e.slug}`);
  const artistUrls = artists.map((a) => `/artistes/${a.slug}`);

  const all = [...urls, ...eventUrls, ...artistUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (path) => `<url><loc>${baseUrl}${path}</loc></url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" }
  });
}

