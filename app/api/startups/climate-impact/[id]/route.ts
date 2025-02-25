import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to update climate impact
    if (!session.user.permissions?.includes("MANAGE_CLIMATE_IMPACT")) {
      return NextResponse.json(
        { error: "You don't have permission to update climate impact data" },
        { status: 403 }
      );
    }

    const impactId = params.id;
    const data = await req.json();

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

    // Check if climate impact exists and belongs to user's startup
    const existingImpact = await db.climateImpact.findFirst({
      where: {
        id: impactId,
        startupId: startup.id
      }
    });

    if (!existingImpact) {
      return NextResponse.json(
        { error: "Climate impact not found or access denied" },
        { status: 404 }
      );
    }

    // Update climate impact
    const impact = await db.climateImpact.update({
      where: { id: impactId },
      data
    });

    return NextResponse.json(impact);
  } catch (error) {
    console.error('Error updating climate impact:', error);
    return NextResponse.json(
      { error: 'Failed to update climate impact' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to delete climate impact
    if (!session.user.permissions?.includes("MANAGE_CLIMATE_IMPACT")) {
      return NextResponse.json(
        { error: "You don't have permission to delete climate impact data" },
        { status: 403 }
      );
    }

    const impactId = params.id;

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

    // Check if climate impact exists and belongs to user's startup
    const existingImpact = await db.climateImpact.findFirst({
      where: {
        id: impactId,
        startupId: startup.id
      }
    });

    if (!existingImpact) {
      return NextResponse.json(
        { error: "Climate impact not found or access denied" },
        { status: 404 }
      );
    }

    // Delete climate impact
    await db.climateImpact.delete({
      where: { id: impactId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting climate impact:', error);
    return NextResponse.json(
      { error: 'Failed to delete climate impact' },
      { status: 500 }
    );
  }
}