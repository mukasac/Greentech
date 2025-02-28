import { db } from "@/lib/db";
import { regions } from "@/lib/data/regions"; // Fallback data
import { Region } from "@/lib/types/region";

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
        return region as unknown as Region;
      }

      // Fallback to mock data
      return regions.find(r => r.slug === slug) || null;
    } catch (error) {
      console.error(`Error fetching region ${slug}:`, error);
      // Fallback to mock data
      return regions.find(r => r.slug === slug) || null;
    }
  },

  /**
   * Get region startups
   */
  async getRegionStartups(regionSlug: string, limit = 3) {
    try {
      const startups = await db.startup.findMany({
        where: {
          country: regionSlug
        },
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      });

      return startups;
    } catch (error) {
      console.error(`Error fetching startups for region ${regionSlug}:`, error);
      // Return empty array or fetch from mockup data as fallback
      return [];
    }
  },

  /**
   * Get region news
   */
  async getRegionNews(regionSlug: string, limit = 3) {
    try {
      const news = await db.news.findMany({
        where: {
          region: regionSlug
        },
        take: limit,
        orderBy: {
          publishedAt: 'desc'
        }
      });

      return news;
    } catch (error) {
      console.error(`Error fetching news for region ${regionSlug}:`, error);
      return [];
    }
  },

  /**
   * Get region events
   */
  async getRegionEvents(regionSlug: string, limit = 3) {
    try {
      const events = await db.event.findMany({
        where: {
          region: regionSlug,
          date: {
            gte: new Date() // Only future events
          }
        },
        take: limit,
        orderBy: {
          date: 'asc' // Upcoming events first
        }
      });

      return events;
    } catch (error) {
      console.error(`Error fetching events for region ${regionSlug}:`, error);
      return [];
    }
  },

  /**
   * Get region jobs
   */
  async getRegionJobs(regionSlug: string, limit = 3) {
    try {
      const jobs = await db.job.findMany({
        where: {
          location: {
            path: ['country'],
            equals: regionSlug
          },
          status: 'active'
        },
        take: limit,
        orderBy: {
          postedAt: 'desc'
        },
        include: {
          startup: {
            select: {
              name: true,
              logo: true,
              country: true
            }
          }
        }
      });

      return jobs;
    } catch (error) {
      console.error(`Error fetching jobs for region ${regionSlug}:`, error);
      return [];
    }
  },

  /**
   * Get all region data in a single call
   */
  async getRegionData(regionSlug: string) {
    try {
      const [region, startups, news, events, jobs] = await Promise.all([
        this.getRegionBySlug(regionSlug),
        this.getRegionStartups(regionSlug),
        this.getRegionNews(regionSlug),
        this.getRegionEvents(regionSlug),
        this.getRegionJobs(regionSlug)
      ]);

      return {
        region,
        startups,
        news,
        events,
        jobs
      };
    } catch (error) {
      console.error(`Error fetching all data for region ${regionSlug}:`, error);
      throw error;
    }
  }
};