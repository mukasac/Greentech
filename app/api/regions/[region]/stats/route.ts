// app/api/regions/[region]/stats/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { region: string } }
) {
  try {
    const regionSlug = params.region;
    
    // Fetch the region with its stats
    const region = await db.region.findUnique({
      where: { slug: regionSlug },
      include: {
        stats: true
      }
    });
    
    if (!region || !region.stats) {
      return NextResponse.json(
        { error: "Region stats not found" },
        { status: 404 }
      );
    }

    // Count actual open jobs related to the region
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

    // Count startups in the region
    const startupsCount = await db.startup.count({
      where: { 
        OR: [
          { region: { slug: regionSlug } },
          { country: regionSlug }
        ]
      }
    });

    // Return real-time stats, falling back to stored stats if queries return 0
    return NextResponse.json({
      startups: startupsCount || region.stats.startups,
      openJobs: openJobsCount || region.stats.openJobs,
      upcomingEvents: upcomingEventsCount || region.stats.upcomingEvents,
      employees: region.stats.employees,
      totalInvestment: region.stats.totalInvestment
    });
  } catch (error) {
    console.error("Error fetching region stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch region statistics" },
      { status: 500 }
    );
  }
}