import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
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

    // Fetch all regions with stats
    const regions = await db.region.findMany({
      include: {
        stats: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(regions);
  } catch (error) {
    console.error("Error fetching regions:", error);
    return NextResponse.json(
      { error: "Failed to fetch regions" },
      { status: 500 }
    );
  }
}

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
        { error: "You don't have permission to create regions" },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.slug || !body.description || !body.coverImage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if a region with the same slug already exists
    const existingRegion = await db.region.findUnique({
      where: { slug: body.slug },
    });

    if (existingRegion) {
      return NextResponse.json(
        { error: "A region with this slug already exists" },
        { status: 400 }
      );
    }

    // Create the new region
    const region = await db.region.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        coverImage: body.coverImage,
      },
    });

    // Create default region stats
    await db.regionStats.create({
      data: {
        regionId: region.id,
        startups: 0,
        employees: 0,
        openJobs: 0,
        upcomingEvents: 0,
        totalInvestment: "€0",
      },
    });

    // Return the created region
    return NextResponse.json(region, { status: 201 });
  } catch (error) {
    console.error("Error creating region:", error);
    return NextResponse.json(
      { error: "Failed to create region" },
      { status: 500 }
    );
  }
}