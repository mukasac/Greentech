export const JobType = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  INTERNSHIP: "internship",
} as const;

export type JobType = typeof JobType[keyof typeof JobType];

export const ExperienceLevel = {
  ENTRY: "entry",
  MID: "mid",
  SENIOR: "senior",
  LEAD: "lead",
  EXECUTIVE: "executive",
} as const;

export type ExperienceLevel = typeof ExperienceLevel[keyof typeof ExperienceLevel];

export const WorkLocation = {
  REMOTE: "remote",
  HYBRID: "hybrid",
  ON_SITE: "on-site",
} as const;

export type WorkLocation = typeof WorkLocation[keyof typeof WorkLocation];

export const Currency = {
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  NOK: "NOK",
} as const;

export type Currency = typeof Currency[keyof typeof Currency];

export interface Job {
  id: string;
  title: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  location: {
    type: WorkLocation;
    city?: string | null;
    country: string;
  };
  salary: {
    min: number;
    max: number;
    currency: Currency;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  department: string;
  applicationUrl: string;
  status: "active" | "filled" | "expired";
  applicationCount: number;
  viewCount: number;
  startupId: string;
  startup?: {
    name: string;
    logo: string;
    country: string;
  };
  postedAt: Date;
  expiresAt?: Date | null;
  updatedAt: Date;
}

// Helper type for creating a new job
export type JobCreateInput = Omit<
  Job,
  "id" | "applicationCount" | "viewCount" | "updatedAt" | "startup"
>;