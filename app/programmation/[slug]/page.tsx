import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug }
  });
  if (!event) {
    return { title: "Événement introuvable" };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate?.toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venueName,
      address: event.venueAddress || event.city
    },
    image: event.posterUrl
      ? [event.posterUrl]
      : [`${baseUrl}/icon.png`],
    offers: {
      "@type": "Offer",
      url: event.bookingUrl,
      availability: "https://schema.org/InStock"
    }
  };

  return {
    title: event.title,
    description: event.description.slice(0, 150),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 150),
      url: `${baseUrl}/programmation/${event.slug}`
    },
    other: {
      "script:type=application/ld+json": JSON.stringify(eventJsonLd)
    }
  };
}

export default async function EventPage({ params }: Props) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug }
  });

  if (!event) {
    return (
      <div className="container py-10">
        <p className="text-sm text-muted">Événement introuvable.</p>
      </div>
    );
  }

  return (
    <div className="container py-10 md:py-14 max-w-3xl">
      <p className="text-xs text-muted mb-2">
        {new Date(event.startDate).toLocaleString("fr-FR", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })}
      </p>
      <h1 className="text-2xl md:text-3xl font-semibold mb-2">
        {event.title}
      </h1>
      <p className="text-sm text-muted mb-4">
        {event.venueName} {event.venueAddress && `· ${event.venueAddress}`}{" "}
        {event.city && `· ${event.city}`}
      </p>
      <p className="text-sm text-muted whitespace-pre-line mb-6">
        {event.description}
      </p>
      <a
        href={event.bookingUrl}
        className="btn-primary text-sm"
        target="_blank"
        rel="noreferrer"
      >
        Réserver vos places
      </a>
      <p className="text-[11px] text-muted mt-2">
        Vous serez redirigé vers une plate-forme externe de billetterie pour
        finaliser votre réservation.
      </p>
    </div>
  );
}

