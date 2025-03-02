import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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

    // Check permission
    if (!session.user.permissions?.includes("MANAGE_CLIMATE_IMPACT")) {
      return NextResponse.json(
        { error: "You don't have permission to update climate impact data" },
        { status: 403 }
      );
    }

    const body = await req.json();
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
        { error: "You can only update your own startup's climate impact data" },
        { status: 403 }
      );
    }

    // Extract the nested data structures
    const metricsData = body.metrics || {};
    const lifecycleData = body.lifecycle || {};
    
    // Extract carbonFootprint data if it exists
    const carbonCaptured = body.carbonFootprint?.carbonCaptured ?? body.carbonCaptured ?? null;
    const lifecycleCo2Reduction = body.carbonFootprint?.lifecycleCo2Reduction ?? body.lifecycleCo2Reduction ?? null;
    const offsetPrograms = body.carbonFootprint?.offsetPrograms ?? body.offsetPrograms ?? null;
    
    // Update with matching the Prisma schema structure - flattening the data
    const updatedImpact = await db.climateImpact.update({
      where: { id },
      data: {
        // Core metrics fields for backward compatibility
        co2Reduction: metricsData.co2Reduction ?? null,
        waterSaved: metricsData.waterSaved ?? null,
        energyEfficiency: metricsData.energyEfficiency ?? null,
        wasteDiverted: metricsData.wasteDiverted ?? null,
        biodiversityImpact: metricsData.biodiversityImpact ?? null,
        
        // Carbon footprint data - FLATTENED
        carbonCaptured,
        lifecycleCo2Reduction,
        offsetPrograms,
        
        // SDGs and certifications
        sdgs: body.sdgs || [],
        sdgImpact: body.sdgImpact ?? null,
        certifications: body.certifications || [],
        awards: body.awards ?? null,
      },
    });

    // Handle JSON fields separately to avoid TypeScript errors
    if (Object.keys(metricsData).length > 0 || Object.keys(lifecycleData).length > 0) {
      await db.$executeRaw`
        UPDATE "ClimateImpact"
        SET 
          "metrics" = ${JSON.stringify(metricsData)},
          "lifecycle" = ${JSON.stringify(lifecycleData)},
          "updatedAt" = NOW()
        WHERE "id" = ${id}
      `;
    }

    // Get the latest data
    const finalImpact = await db.climateImpact.findUnique({
      where: { id },
    });

    return NextResponse.json(finalImpact);
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

    // Check permission
    if (!session.user.permissions?.includes("MANAGE_CLIMATE_IMPACT")) {
      return NextResponse.json(
        { error: "You don't have permission to delete climate impact data" },
        { status: 403 }
      );
    }

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