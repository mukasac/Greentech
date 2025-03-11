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
    
    // Permission check removed

    const body = await req.json();
    console.log("Received climate impact data:", body);

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

    // Create the impact data with flattened structure
    const impact = await db.climateImpact.create({
      data: {
        // Metrics
        co2Reduction: body.metrics?.co2Reduction || null,
        co2ReductionDescription: body.metrics?.co2ReductionDescription || null,
        waterSaved: body.metrics?.waterSaved || null,
        waterSavedDescription: body.metrics?.waterSavedDescription || null,
        energyEfficiency: body.metrics?.energyEfficiency || null,
        energyEfficiencyDescription: body.metrics?.energyEfficiencyDescription || null,
        wasteDiverted: body.metrics?.wasteDiverted || null,
        wasteDivertedDescription: body.metrics?.wasteDivertedDescription || null,
        biodiversityImpact: body.metrics?.biodiversityImpact || null,
        
        // Carbon footprint (directly from body for flat structure)
        carbonCaptured: body.carbonCaptured || null,
        carbonCapturedDescription: body.carbonCapturedDescription || null,
        lifecycleCo2Reduction: body.lifecycleCo2Reduction || null,
        lifecycleCo2ReductionDescription: body.lifecycleCo2ReductionDescription || null,
        offsetPrograms: body.offsetPrograms || null,
        
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
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if (error.stack) console.error('Stack trace:', error.stack);
    }
    
    return NextResponse.json(
      { error: 'Failed to create climate impact' },
      { status: 500 }
    );
  }
}