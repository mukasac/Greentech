export interface RegionStats {
  startups: number;
  employees: number;
  openJobs: number;
  upcomingEvents: number;
  totalInvestment: string;
}

export interface Region {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  stats: RegionStats;
  initiatives: {
    title: string;
    description: string;
  }[];
  ecosystemPartners: {
    name: string;
    logo: string;
    type: "accelerator" | "investor" | "university" | "government";
  }[];
}