import { NextResponse } from "next/server";
import { RegionService } from "@/lib/services/region-service";

export async function GET(
  req: Request,
  { params }: { params: { region: string } }
) {
  try {
    const regionSlug = params.region;
    
    // Get all region data using the service
    const regionData = await RegionService.getRegionData(regionSlug);
    
    if (!regionData.region) {
      return NextResponse.json(
        { error: "Region not found" },
        { status: 404 }
      );
    }

    // Return the data
    return NextResponse.json(regionData);
  } catch (error) {
    console.error("Error fetching region data:", error);
    return NextResponse.json(
      { error: "Failed to fetch region data" },
      { status: 500 }
    );
  }
}