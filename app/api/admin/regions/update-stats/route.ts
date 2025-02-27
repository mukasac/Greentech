import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { updateAllRegionStats, updateRegionStats } from "@/lib/services/region-stats-service";

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
        { error: "You don't have permission to update region statistics" },
        { status: 403 }
      );
    }

    // Check if a specific region is requested or all regions
    const { searchParams } = new URL(req.url);
    const regionSlug = searchParams.get("region");
    
    let responseData;
    if (regionSlug) {
      // Update specific region
      const success = await updateRegionStats(regionSlug);
      responseData = {
        success,
        message: success
          ? `Statistics for ${regionSlug} updated successfully`
          : `Failed to update statistics for ${regionSlug}`
      };
    } else {
      // Update all regions
      const result = await updateAllRegionStats();
      responseData = {
        ...result,
        message: result.success
          ? `Successfully updated statistics for ${result.updated} regions`
          : "Failed to update region statistics"
      };
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error updating region statistics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update region statistics" },
      { status: 500 }
    );
  }
}