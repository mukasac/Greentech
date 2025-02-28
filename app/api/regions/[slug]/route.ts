import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RegionService } from "@/lib/services/region-service";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Get region data using the service
    const regionData = await RegionService.getRegionData(params.slug);
    
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