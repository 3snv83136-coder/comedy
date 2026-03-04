import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const adminEmail = "admin@biiip-comedy.club";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: "ADMIN"
    }
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      clubName: "Biiip Comedy Club",
      address: "12 rue de la Vanne, 75000 Paris",
      phone: "+33 6 00 00 00 00",
      email: "contact@biiip-comedy.club",
      socialLinks: {
        instagram: "https://instagram.com/biiipcomedyclub"
      },
      heroText:
        "Plateaux d'humour et open mics dans une ambiance club intimiste à Paris.",
      aboutText:
        "Biiip Comedy Club est une association qui soutient la nouvelle scène stand-up parisienne."
    }
  });

  const artistNames = [
    "Alex Biiip",
    "Samia R.",
    "Jo Le Micro",
    "Chloé Punchline",
    "Romain T.",
    "Léa Impro"
  ];

  const artists = await Promise.all(
    artistNames.map((name, index) =>
      prisma.artist.upsert({
        where: { slug: slugify(name) },
        update: {},
        create: {
          name,
          slug: slugify(name),
          bioShort:
            "Humoriste de la nouvelle scène stand-up, entre observations du quotidien et vannes bien senties.",
          bioLong:
            "Passé·e par plusieurs plateaux parisiens, " +
            name +
            " développe un univers mêlant auto-dérision et regard sur la société. " +
            "Au Biiip Comedy Club, iel teste régulièrement de nouveaux passages.",
          instagram: "https://instagram.com/example" + index,
          tags: "stand-up,plateau,Paris"
        }
      })
    )
  );

  const baseDate = new Date();

  const eventsData = [
    {
      title: "Biiip Comedy Club · Plateau du jeudi",
      offsetDays: 7,
      city: "Paris"
    },
    {
      title: "Open Mic des Biiip",
      offsetDays: 14,
      city: "Paris"
    },
    {
      title: "Soirée spéciale · Best Of Biiip",
      offsetDays: -10,
      city: "Paris"
    }
  ];

  for (const e of eventsData) {
    const start = new Date(baseDate);
    start.setDate(start.getDate() + e.offsetDays);
    start.setHours(20, 0, 0, 0);
    const end = new Date(start);
    end.setHours(22);

    const slug = slugify(e.title + "-" + e.offsetDays);

    await prisma.event.upsert({
      where: { slug },
      update: {},
      create: {
        title: e.title,
        slug,
        description:
          "Un plateau de stand-up avec plusieurs humoristes de la scène parisienne. " +
          "Ambiance club intimiste, MC bienveillant, surprises et vannes fraîches.",
        startDate: start,
        endDate: end,
        venueName: "Salle Biiip",
        venueAddress: "12 rue de la Vanne, 75000 Paris",
        city: e.city,
        bookingUrl: "https://www.billetweb.fr/biiip-comedy-club",
        posterUrl: null,
        status: "PUBLISHED"
      }
    });
  }

  await prisma.fAQ.createMany({
    data: [
      {
        question: "Comment réserver pour une soirée Biiip Comedy Club ?",
        answer:
          "Les réservations se font via notre billetterie en ligne. Le bouton \"Réserver\" sur la page programmation vous redirige vers un site externe sécurisé.",
        order: 1
      },
      {
        question: "Puis-je demander un passage si je débute en stand-up ?",
        answer:
          "Oui ! Remplissez le formulaire \"Demande de passage\" avec quelques infos sur votre expérience et, si possible, un lien vidéo. Nous reviendrons vers vous dès que possible.",
        order: 2
      },
      {
        question: "Le club est-il accessible aux personnes à mobilité réduite ?",
        answer:
          "Nous faisons notre possible pour rendre les soirées accessibles. Contactez-nous en amont pour que nous puissions vous informer sur les conditions d’accès de la salle du moment.",
        order: 3
      }
    ]
  });

  await prisma.submission.create({
    data: {
      fullName: "Humoriste Test",
      stageName: "Test Biiip",
      email: "humoriste@example.com",
      phone: "+33 6 12 34 56 78",
      message:
        "Bonjour, je souhaiterais jouer au Biiip Comedy Club. J'ai déjà quelques plateaux à mon actif et une vidéo disponible sur demande.",
      status: "NEW"
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

