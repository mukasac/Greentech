// lib/services/region-stats-service.ts
import { db } from "@/lib/db";

export async function updateRegionStats(regionSlug: string): Promise<boolean> {
  try {
    // Find the region
    const region = await db.region.findUnique({
      where: { slug: regionSlug },
      include: { stats: true }
    });

    if (!region) {
      console.error(`Region with slug ${regionSlug} not found`);
      return false;
    }

    // Count startups in the region
    const startupsCount = await db.startup.count({
      where: { 
        OR: [
          { region: { slug: regionSlug } },
          { country: regionSlug }
        ]
      }
    });

    // Sum up employees in the region
    const startups = await db.startup.findMany({
      where: { 
        OR: [
          { region: { slug: regionSlug } },
          { country: regionSlug }
        ]
      },
      select: { employees: true }
    });
    
    const employeesCount = startups.reduce((sum, startup) => {
      // Parse the employees string to a number
      const employees = parseInt(startup.employees);
      return sum + (isNaN(employees) ? 0 : employees);
    }, 0);

    // Count open jobs in the region
    const openJobsCount = await db.job.count({
      where: {
        OR: [
          {
            startup: {
              region: {
                slug: regionSlug
              }
            }
          },
          {
            location: {
              path: ['country'],
              equals: regionSlug
            }
          }
        ],
        status: 'active'
      }
    });

    // Count upcoming events in the region
    const upcomingEventsCount = await db.event.count({
      where: {
        OR: [
          { region: regionSlug },
          { regionEntity: { slug: regionSlug }}
        ],
        date: {
          gte: new Date()
        }
      }
    });

    // Update the region stats
    await db.regionStats.update({
      where: { regionId: region.id },
      data: {
        startups: startupsCount,
        employees: employeesCount,
        openJobs: openJobsCount,
        upcomingEvents: upcomingEventsCount,
        updatedAt: new Date()
      }
    });

    return true;
  } catch (error) {
    console.error("Error updating region stats:", error);
    return false;
  }
}

export async function updateAllRegionStats(): Promise<{ success: boolean, updated: number }> {
  try {
    // Get all regions
    const regions = await db.region.findMany({
      select: { slug: true }
    });

    let updatedCount = 0;

    // Update stats for each region
    for (const region of regions) {
      const success = await updateRegionStats(region.slug);
      if (success) updatedCount++;
    }

    return {
      success: true,
      updated: updatedCount
    };
  } catch (error) {
    console.error("Error updating all region stats:", error);
    return {
      success: false,
      updated: 0
    };
  }
}