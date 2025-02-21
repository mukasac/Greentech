import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string(),
  description: z.string().min(50, "Description must be at least 50 characters"),
  type: z.enum(["conference", "workshop", "hackathon", "networking", "webinar"]),
  date: z.string().transform((str) => new Date(str)),
  location: z.string(),
  attendees: z.number().default(0),
  maxAttendees: z.number().optional(),
  price: z.object({
    amount: z.number(),
    currency: z.string(),
  }).optional(),
  organizer: z.object({
    name: z.string(),
    logo: z.string().optional(),
  }),
  region: z.string(),
  tags: z.array(z.string()),
});