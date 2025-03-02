// lib/services/region-service.ts
import { db } from "@/lib/db";
import { regions } from "@/lib/data/regions"; // Fallback data
import { Region } from "@/lib/types/region";

// Define the proper type for ecosystem partners
type PartnerType = "accelerator" | "investor" | "university" | "government";

interface Initiative {
  title: string;
  description: string;
}

interface EcosystemPartner {
  name: string;
  logo: string;
  type: PartnerType;
}

// Define default content for ecosystem sections if missing from database
const DEFAULT_INITIATIVES: Initiative[] = [
  {
    title: "Green Energy Transition",
    description: "Supporting the shift towards renewable energy sources across the region."
  },
  {
    title: "Circular Economy",
    description: "Promoting sustainable production and consumption models to minimize waste."
  },
  {
    title: "Climate Innovation Hub",
    description: "Accelerating and supporting startups focused on climate change solutions."
  }
];

const DEFAULT_PARTNERS: EcosystemPartner[] = [
  {
    name: "Regional Innovation Hub",
    logo: "/placeholder-logo.png",
    type: "accelerator"
  },
  {
    name: "Green Tech University",
    logo: "/placeholder-logo.png",
    type: "university"
  },
  {
    name: "Sustainable Ventures",
    logo: "/placeholder-logo.png",
    type: "investor"
  },
  {
    name: "Environment Ministry",
    logo: "/placeholder-logo.png",
    type: "government"
  }
];

/**
 * Service for fetching region data from the database
 */
export const RegionService = {
  /**
   * Get all regions
   */
  async getAllRegions(): Promise<Region[]> {
    try {
      // Try to fetch from database
      const dbRegions = await db.region.findMany({
        include: {
          initiatives: true,
          ecosystemPartners: true,
          stats: true
        }
      });

      if (dbRegions && dbRegions.length > 0) {
        return dbRegions as unknown as Region[];
      }

      // Fallback to mock data
      return regions;
    } catch (error) {
      console.error("Error fetching regions:", error);
      // Fallback to mock data
      return regions;
    }
  },

  /**
   * Get a single region by slug
   */
  async getRegionBySlug(slug: string): Promise<Region | null> {
    try {
      // Try to fetch from database
      const region = await db.region.findUnique({
        where: { slug },
        include: {
          initiatives: true,
          ecosystemPartners: true,
          stats: true
        }
      });

      if (region) {
        // Ensure the region has initiatives and ecosystem partners
        const enhancedRegion = { ...region } as unknown as Region;
        
        // Add default initiatives if missing
        if (!enhancedRegion.initiatives || enhancedRegion.initiatives.length === 0) {
          enhancedRegion.initiatives = DEFAULT_INITIATIVES;
        }
        
        // Add default partners if missing
        if (!enhancedRegion.ecosystemPartners || enhancedRegion.ecosystemPartners.length === 0) {
          enhancedRegion.ecosystemPartners = DEFAULT_PARTNERS;
        }
        
        return enhancedRegion;
      }

      // Fallback to mock data
      const mockRegion = regions.find(r => r.slug === slug);
      
      // If mock region exists, enhance it with default initiatives and partners if needed
      if (mockRegion) {
        const enhancedMockRegion = { ...mockRegion };
        
        if (!enhancedMockRegion.initiatives || enhancedMockRegion.initiatives.length === 0) {
          enhancedMockRegion.initiatives = DEFAULT_INITIATIVES;
        }
        
        if (!enhancedMockRegion.ecosystemPartners || enhancedMockRegion.ecosystemPartners.length === 0) {
          enhancedMockRegion.ecosystemPartners = DEFAULT_PARTNERS;
        }
        
        return enhancedMockRegion;
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching region ${slug}:`, error);
      // Fallback to mock data with enhancements
      const mockRegion = regions.find(r => r.slug === slug);
      
      if (mockRegion) {
        const enhancedMockRegion = { ...mockRegion };
        
        if (!enhancedMockRegion.initiatives || enhancedMockRegion.initiatives.length === 0) {
          enhancedMockRegion.initiatives = DEFAULT_INITIATIVES;
        }
        
        if (!enhancedMockRegion.ecosystemPartners || enhancedMockRegion.ecosystemPartners.length === 0) {
          enhancedMockRegion.ecosystemPartners = DEFAULT_PARTNERS;
        }
        
        return enhancedMockRegion;
      }
      
      return null;
    }
  },

  /**
   * Get all region data in a single call
   * Note: We maintain this method for backward compatibility,
   * but we're no longer fetching startups, news, events, and jobs
   */
  async getRegionData(regionSlug: string) {
    try {
      const region = await this.getRegionBySlug(regionSlug);

      // We return an object with only the region but maintain the structure
      // for backward compatibility with existing code
      return {
        region,
        startups: [],
        news: [],
        events: [],
        jobs: []
      };
    } catch (error) {
      console.error(`Error fetching data for region ${regionSlug}:`, error);
      throw error;
    }
  }
};