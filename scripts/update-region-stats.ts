import { db } from "@/lib/db";

/**
 * Script to update region statistics based on current database data
 * This can be run periodically as a cron job to keep statistics up to date
 */
async function updateRegionStats() {
  console.log("Updating region statistics...");

  try {
    // Get all regions
    const regions = await db.region.findMany();
    
    for (const region of regions) {
      console.log(`Updating stats for region: ${region.name}`);
      
      // Count startups in the region
      const startupsCount = await db.startup.count({
        where: { 
          OR: [
            { regionId: region.id },
            { country: region.slug }
          ]
        }
      });

      // Sum up employees in the region
      const startups = await db.startup.findMany({
        where: { 
          OR: [
            { regionId: region.id },
            { country: region.slug }
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
                regionId: region.id
              }
            },
            {
              location: {
                path: ['country'],
                equals: region.slug
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
            { regionId: region.id },
            { region: region.slug }
          ],
          date: {
            gte: new Date()
          }
        }
      });

      // Update region stats
      await db.regionStats.upsert({
        where: { regionId: region.id },
        update: {
          startups: startupsCount,
          employees: employeesCount,
          openJobs: openJobsCount,
          upcomingEvents: upcomingEventsCount,
          updatedAt: new Date()
        },
        create: {
          regionId: region.id,
          startups: startupsCount,
          employees: employeesCount,
          openJobs: openJobsCount,
          upcomingEvents: upcomingEventsCount,
          totalInvestment: "€0" // Default value
        }
      });

      console.log(`Updated stats for ${region.name}: ${startupsCount} startups, ${employeesCount} employees, ${openJobsCount} jobs, ${upcomingEventsCount} events`);
    }

    console.log("All region statistics updated successfully");
  } catch (error) {
    console.error("Error updating region statistics:", error);
  } finally {
    await db.$disconnect();
  }
}

// Run the update
updateRegionStats();