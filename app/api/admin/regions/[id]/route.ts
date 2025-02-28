import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { Region } from "@/lib/types/region";

// GET: Fetch a single region by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authorization
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check for SITE_ADMIN permission
    if (!session.user.permissions?.includes("SITE_ADMIN")) {
      return NextResponse.json(
        { error: "You don't have permission to access region administration" },
        { status: 403 }
      );
    }

    // Fetch the region from the database
    const region = await db.region.findUnique({
      where: { id: params.id },
      include: {
        stats: true,
        initiatives: true,
        ecosystemPartners: true
      }
    });

    if (!region) {
      return NextResponse.json(
        { error: "Region not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(region);
  } catch (error) {
    console.error("Error fetching region:", error);
    return NextResponse.json(
      { error: "Failed to fetch region" },
      { status: 500 }
    );
  }
}

// PUT: Update a region
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authorization
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check for SITE_ADMIN permission
    if (!session.user.permissions?.includes("SITE_ADMIN")) {
      return NextResponse.json(
        { error: "You don't have permission to update regions" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.description || !body.slug || !body.stats) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the region exists
    const existingRegion = await db.region.findUnique({
      where: { id: params.id },
      include: { stats: true }
    });

    if (!existingRegion) {
      return NextResponse.json(
        { error: "Region not found" },
        { status: 404 }
      );
    }

    // Update the region using a transaction to ensure stats are updated together
    const result = await db.$transaction(async (prisma) => {
      // Update the main region details
      const updatedRegion = await prisma.region.update({
        where: { id: params.id },
        data: {
          name: body.name,
          description: body.description,
          coverImage: body.coverImage,
          // We don't update the slug as it's used in URLs
        }
      });

      // Update stats if stats ID exists
      if (existingRegion.stats?.id) {
        await prisma.regionStats.update({
          where: { id: existingRegion.stats.id },
          data: {
            startups: body.stats.startups,
            employees: body.stats.employees,
            openJobs: body.stats.openJobs,
            upcomingEvents: body.stats.upcomingEvents,
            totalInvestment: body.stats.totalInvestment,
            updatedAt: new Date()
          }
        });
      } else {
        // Create stats if they don't exist
        await prisma.regionStats.create({
          data: {
            regionId: params.id,
            startups: body.stats.startups,
            employees: body.stats.employees,
            openJobs: body.stats.openJobs,
            upcomingEvents: body.stats.upcomingEvents,
            totalInvestment: body.stats.totalInvestment
          }
        });
      }

      return updatedRegion;
    });

    // Return the updated region
    return NextResponse.json({
      message: "Region updated successfully",
      region: result
    });
  } catch (error) {
    console.error("Error updating region:", error);
    return NextResponse.json(
      { error: "Failed to update region" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a region
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authorization
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check for SITE_ADMIN permission
    if (!session.user.permissions?.includes("SITE_ADMIN")) {
      return NextResponse.json(
        { error: "You don't have permission to delete regions" },
        { status: 403 }
      );
    }

    // Check if the region exists
    const existingRegion = await db.region.findUnique({
      where: { id: params.id }
    });

    if (!existingRegion) {
      return NextResponse.json(
        { error: "Region not found" },
        { status: 404 }
      );
    }

    // Delete the region
    await db.region.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      message: "Region deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting region:", error);
    return NextResponse.json(
      { error: "Failed to delete region" },
      { status: 500 }
    );
  }
}