import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const climateImpact = await db.climateImpact.findUnique({
      where: { id },
    });

    if (!climateImpact) {
      return NextResponse.json(
        { error: "Climate impact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(climateImpact);
  } catch (error) {
    console.error('Error fetching climate impact:', error);
    return NextResponse.json(
      { error: 'Failed to fetch climate impact' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Permission check removed

    const body = await req.json();
    const id = params.id;
    console.log("Received update data:", body);

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

    // Get the existing climate impact
    const climateImpact = await db.climateImpact.findUnique({
      where: { id }
    });

    if (!climateImpact) {
      return NextResponse.json(
        { error: "Climate impact not found" },
        { status: 404 }
      );
    }

    // Check if the climate impact belongs to the user's startup
    if (climateImpact.startupId !== startup.id) {
      return NextResponse.json(
        { error: "You can only update your own startup's climate impact data" },
        { status: 403 }
      );
    }

    // Extract metrics from nested structure - extract the actual fields
    const metrics = body.metrics || {};
    const lifecycle = body.lifecycle || {};
    
    // Update with matching the Prisma schema structure - put all fields at the top level
    const updatedImpact = await db.climateImpact.update({
      where: { id },
      data: {
        // Extract metrics individually with their descriptions
        co2Reduction: metrics.co2Reduction ?? null,
        co2ReductionDescription: metrics.co2ReductionDescription ?? null,
        waterSaved: metrics.waterSaved ?? null,
        waterSavedDescription: metrics.waterSavedDescription ?? null,
        energyEfficiency: metrics.energyEfficiency ?? null,
        energyEfficiencyDescription: metrics.energyEfficiencyDescription ?? null,
        wasteDiverted: metrics.wasteDiverted ?? null,
        wasteDivertedDescription: metrics.wasteDivertedDescription ?? null,
        biodiversityImpact: metrics.biodiversityImpact ?? null,
        
        // Carbon footprint data (these are already at top level in the form)
        carbonCaptured: body.carbonCaptured ?? null,
        carbonCapturedDescription: body.carbonCapturedDescription ?? null,
        lifecycleCo2Reduction: body.lifecycleCo2Reduction ?? null,
        lifecycleCo2ReductionDescription: body.lifecycleCo2ReductionDescription ?? null,
        offsetPrograms: body.offsetPrograms ?? null,
        
        // SDGs and certifications
        sdgs: body.sdgs || [],
        sdgImpact: body.sdgImpact ?? null,
        certifications: body.certifications || [],
        awards: body.awards ?? null,
        
        // Store lifecycle data as JSON
        lifecycle: lifecycle
      },
    });

    return NextResponse.json(updatedImpact);
  } catch (error) {
    console.error('Error updating climate impact:', error);
    return NextResponse.json(
      { error: 'Failed to update climate impact' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Permission check removed

    const id = params.id;

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

    // Get the existing climate impact
    const climateImpact = await db.climateImpact.findUnique({
      where: { id }
    });

    if (!climateImpact) {
      return NextResponse.json(
        { error: "Climate impact not found" },
        { status: 404 }
      );
    }

    // Check if the climate impact belongs to the user's startup
    if (climateImpact.startupId !== startup.id) {
      return NextResponse.json(
        { error: "You can only delete your own startup's climate impact data" },
        { status: 403 }
      );
    }

    await db.climateImpact.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Climate impact deleted successfully" });
  } catch (error) {
    console.error('Error deleting climate impact:', error);
    return NextResponse.json(
      { error: 'Failed to delete climate impact' },
      { status: 500 }
    );
  }
}