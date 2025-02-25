// app/api/startups/climate-impact/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to create climate impact
    if (!session.user.permissions?.includes("MANAGE_CLIMATE_IMPACT")) {
      return NextResponse.json(
        { error: "You don't have permission to create climate impact data" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Get the user's startup
    const startup = await db.startup.findFirst({
      where: {
        userId: session.user.id
      }
    });

    if (!startup) {
      return NextResponse.json(
        { error: "No startup found for this user" },
        { status: 404 }
      );
    }

    // Restructure the data to match Prisma schema
    const impact = await db.climateImpact.create({
      data: {
        // Main metrics
        co2Reduction: body.metrics?.co2Reduction || null,
        waterSaved: body.metrics?.waterSaved || null,
        energyEfficiency: body.metrics?.energyEfficiency || null,
        wasteDiverted: body.metrics?.wasteDiverted || null,
        biodiversityImpact: body.metrics?.biodiversityImpact || null,

        // Carbon footprint data
        carbonCaptured: body.carbonFootprint?.carbonCaptured || null,
        lifecycleCo2Reduction: body.carbonFootprint?.lifecycleCo2Reduction || null,
        offsetPrograms: body.carbonFootprint?.offsetPrograms || null,

        // SDGs and certifications
        sdgs: body.sdgs || [],
        sdgImpact: body.sdgImpact || null,
        certifications: body.certifications || [],
        awards: body.awards || null,

        // Lifecycle data stored as JSON
        lifecycle: body.lifecycle || {},

        // Startup reference and status
        startupId: startup.id,
        isActive: true,
      },
    });

    return NextResponse.json(impact, { status: 201 });
  } catch (error) {
    console.error('Error creating climate impact:', error);
    return NextResponse.json(
      { error: 'Failed to create climate impact' },
      { status: 500 }
    );
  }
}