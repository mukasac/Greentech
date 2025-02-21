import { z } from "zod";
import { startupSchema, eventSchema, newsSchema, jobSchema } from "@/lib/validations";

export type StartupCreateInput = z.infer<typeof startupSchema>;
export type StartupUpdateInput = Partial<StartupCreateInput>;
export type EventCreateInput = z.infer<typeof eventSchema>;
export type NewsCreateInput = z.infer<typeof newsSchema>;
export type JobCreateInput = z.infer<typeof jobSchema>;