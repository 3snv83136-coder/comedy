export type Show = {
  title: string;
  date: string; // ISO
  venue: string;
  city?: string;
  description?: string;
  bookingUrl?: string;
};

export const shows: Show[] = [
  {
    title: "Plateau du jeudi",
    date: "2026-03-20T20:00:00+01:00",
    venue: "Salle Biiip, 12 rue de la Vanne",
    city: "Paris",
    description:
      "Un plateau de stand-up avec plusieurs humoristes de la scène parisienne.",
    bookingUrl: "https://example.com/billeterie-jeudi"
  },
  {
    title: "Open Mic des Biiip",
    date: "2026-03-27T20:00:00+01:00",
    venue: "Salle Biiip, 12 rue de la Vanne",
    city: "Paris",
    description:
      "Open mic convivial pour humoristes débutant·es et confirmé·es.",
    bookingUrl: "https://example.com/billeterie-open-mic"
  }
];

