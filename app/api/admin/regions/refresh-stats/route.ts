import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    // Check authorization
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check for SITE_ADMIN permission
    if (!session.user.permissions?.includes("SITE_ADMIN")) {
      return NextResponse.json(
        { error: "You don't have permission to refresh region statistics" },
        { status: 403 }
      );
    }

    // Get all regions
    const regions = await db.region.findMany();
    const results = [];
    
    for (const region of regions) {
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
      const regionStats = await db.regionStats.upsert({
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

      results.push({
        region: region.name,
        stats: {
          startups: startupsCount,
          employees: employeesCount,
          openJobs: openJobsCount,
          upcomingEvents: upcomingEventsCount
        }
      });
    }

    return NextResponse.json({
      message: "Region statistics refreshed successfully",
      results
    });
  } catch (error) {
    console.error("Error refreshing region statistics:", error);
    return NextResponse.json(
      { error: "Failed to refresh region statistics" },
      { status: 500 }
    );
  }
}