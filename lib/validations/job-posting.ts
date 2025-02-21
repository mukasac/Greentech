import { z } from "zod";
import { JobType, ExperienceLevel, WorkLocation, Currency } from "@/lib/types/job";

export const jobPostingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  type: z.nativeEnum(JobType),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  locationType: z.nativeEnum(WorkLocation),
  city: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  salaryMin: z.number().min(0, "Minimum salary must be greater than 0"),
  salaryMax: z.number().min(0, "Maximum salary must be greater than 0"),
  currency: z.nativeEnum(Currency),
  description: z.string().min(100, "Description must be at least 100 characters"),
  requirements: z.string().min(50, "Requirements must be at least 50 characters"),
  responsibilities: z.string().min(50, "Responsibilities must be at least 50 characters"),
  skills: z.string().min(3, "At least one skill is required"),
  department: z.string().min(2, "Department is required"),
  startup: z.object({
    id: z.string().min(1, "Startup ID is required")
  })
}).refine(data => data.salaryMax > data.salaryMin, {
  message: "Maximum salary must be greater than minimum salary",
  path: ["salaryMax"],
});

export type JobPostingFormData = z.infer<typeof jobPostingSchema>;