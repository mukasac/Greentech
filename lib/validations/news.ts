import { z } from "zod";

export const newsSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string(),
  excerpt: z.string().min(50, "Excerpt must be at least 50 characters"),
  content: z.string().min(100, "Content must be at least 100 characters"),
  image: z.string().url("Image must be a valid URL"),
  tags: z.array(z.string()),
  region: z.string(),
});