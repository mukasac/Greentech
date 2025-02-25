import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to update climate impact status
    if (!session.user.permissions?.includes("MANAGE_CLIMATE_IMPACT")) {
      return NextResponse.json(
        { error: "You don't have permission to update climate impact status" },
        { status: 403 }
      );
    }

    const impactId = params.id;
    const { isActive } = await req.json();

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

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

    // Update climate impact status
    const impact = await db.climateImpact.update({
      where: { id: impactId },
      data: { isActive }
    });

    return NextResponse.json(impact);
  } catch (error) {
    console.error('Error updating climate impact status:', error);
    return NextResponse.json(
      { error: 'Failed to update climate impact status' },
      { status: 500 }
    );
  }
}