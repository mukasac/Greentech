// @/lib/types/startup.ts

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
}

export interface Department {
  name: string;
  employeeCount: number;
  description?: string;
}

export interface Team {
  founders: string[];
  totalEmployees: number;
  locations: string[];
  leadership: TeamMember[];
  departments?: Department[];
  length?: number; // Added to fix the TypeScript error
}

export interface Job {
  id: string;
  title: string;
  location: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string | null;
}

export interface SustainabilityInfo {
  impact: string;
  sdgs: string[];
}

export interface Startup {
  id: string;
  name: string;
  description: string;
  logo?: string;
  coverImage?: string;
  website: string;
  founded: string | number;
  employees: string | number;
  funding: string;
  country: string;
  mainCategory: string;
  categories?: string[];
  tags: string[];
  createdAt: string | Date;
  team: Team;
  jobs?: Job[];
  gallery: GalleryImage[]; // Changed from optional to required
  sustainability: SustainabilityInfo;
}