import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe requis")
});

export const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  venueName: z.string().min(2),
  venueAddress: z.string().optional().nullable(),
  city: z.string().min(2),
  bookingUrl: z.string().url(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  posterUrl: z.string().url().optional().nullable()
});

export const artistSchema = z.object({
  name: z.string().min(2),
  bioShort: z.string().min(10),
  bioLong: z.string().optional().nullable(),
  instagram: z.string().url().optional().nullable(),
  tiktok: z.string().url().optional().nullable(),
  youtube: z.string().url().optional().nullable(),
  website: z.string().url().optional().nullable(),
  videoEmbedUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional()
});

export const submissionSchema = z.object({
  fullName: z.string().min(2),
  stageName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(20),
  honeypot: z.string().max(0).optional().or(z.literal(""))
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  honeypot: z.string().max(0).optional().or(z.literal(""))
});

export const newsletterSchema = z.object({
  email: z.string().email()
});

