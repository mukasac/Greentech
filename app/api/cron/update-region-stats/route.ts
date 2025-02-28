// app/api/cron/update-region-stats/route.ts
import { NextResponse } from "next/server";
import { updateAllRegionStats } from "@/lib/services/region-stats-service";

// Define a secret key for cron job authentication
const CRON_SECRET = process.env.CRON_SECRET || 'default-cron-secret';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const authKey = searchParams.get("key");
  
  // Verify the request has the correct authentication key
  if (authKey !== CRON_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    // Update all region statistics
    const result = await updateAllRegionStats();
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to update region statistics",
          updated: result.updated 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated statistics for ${result.updated} regions`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in cron job for updating region statistics:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error during statistics update",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}