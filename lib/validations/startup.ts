import { z } from "zod";

export const startupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  logo: z.string().url("Logo must be a valid URL"),
  profileImage: z.string().url("Profile image must be a valid URL"),
  mainCategory: z.string(),
  subcategories: z.array(z.string()),
  country: z.string(),
  founded: z.number().min(1900).max(new Date().getFullYear()),
  website: z.string().url("Website must be a valid URL"),
  funding: z.string(),
  employees: z.string(),
  tags: z.array(z.string()),
});