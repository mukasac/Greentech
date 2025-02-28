import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { region: string } }
) {
  const { region } = params;

  if (!region) {
    return NextResponse.json(
      { error: 'Region ID is required' },
      { status: 400 }
    );
  }

  try {
    // Count active startups in this region
    const startupsCount = await db.startup.count({
      where: {
        regionId: region,
        status: 'active'
      }
    });
    
    // Count open positions in startups from this region
    // Using 'job' instead of 'jobPosition' assuming that's the correct model name in your Prisma schema
    const openPositionsCount = await db.job.count({
      where: {
        startup: {
          regionId: region
        },
        status: 'open'
      }
    });
    
    // Count upcoming events in this region
    const currentDate = new Date();
    const upcomingEventsCount = await db.event.count({
      where: {
        regionId: region,
        date: {
          gte: currentDate
        }
      }
    });
    
    return NextResponse.json({
      startups: startupsCount,
      openPositions: openPositionsCount,
      upcomingEvents: upcomingEventsCount
    });
  } catch (error) {
    console.error('Error fetching region statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch region statistics' },
      { status: 500 }
    );
  }
}