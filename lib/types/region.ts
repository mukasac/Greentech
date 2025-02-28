export interface RegionStats {
  id?: string;
  regionId?: string;
  startups: number;
  employees: number;
  openJobs: number;
  upcomingEvents: number;
  totalInvestment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegionInitiative {
  id?: string;
  title: string;
  description: string;
  regionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EcosystemPartner {
  id?: string;
  name: string;
  logo: string;
  type: "accelerator" | "investor" | "university" | "government";
  regionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Region {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  stats: RegionStats;
  initiatives: RegionInitiative[];
  ecosystemPartners: EcosystemPartner[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegionData {
  region: Region;
  startups: any[];
  news: any[];
  events: any[];
  jobs: any[];
}