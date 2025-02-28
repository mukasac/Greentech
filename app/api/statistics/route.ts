// app/api/statistics/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Import your database connection

export async function GET() {
  try {
    // Example queries - modify these according to your database schema
    const startupsCount = await db.startup.count({
      where: { status: 'active' }
    });
    
    const positionsCount = await db.jobPosition.count({
      where: { status: 'open' }
    });
    
    const currentDate = new Date();
    const eventsCount = await db.event.count({
      where: {
        date: {
          gte: currentDate
        }
      }
    });
    
    return NextResponse.json({
      startups: startupsCount,
      positions: positionsCount,
      events: eventsCount
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}