// app/api/startups/[id]/team/[memberId]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const { id: startupId, memberId } = params;
    
    const teamMember = await db.team.findFirst({
      where: {
        id: memberId,
        startupId,
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json(
      { error: "Failed to fetch team member" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: startupId, memberId } = params;
    
    // Check if user owns this startup
    const startup = await db.startup.findUnique({
      where: { id: startupId },
      select: { userId: true },
    });

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    if (startup.userId !== session.user.id && 
        !session.user.permissions?.includes("ADMIN_ACCESS")) {
      return NextResponse.json(
        { error: "You don't have permission to update team members for this startup" },
        { status: 403 }
      );
    }

    // Check if team member exists
    const existingMember = await db.team.findFirst({
      where: {
        id: memberId,
        startupId,
      },
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, role, image, bio, linkedin, twitter } = body;

    // Validate required fields
    if (!name || !role || !image) {
      return NextResponse.json(
        { error: "Name, role, and image are required" },
        { status: 400 }
      );
    }

    // Update team member
    const updatedMember = await db.team.update({
      where: {
        id: memberId,
      },
      data: {
        name,
        role,
        image,
        bio: bio || null,
        linkedin: linkedin || null,
        twitter: twitter || null,
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: startupId, memberId } = params;
    
    // Check if user owns this startup
    const startup = await db.startup.findUnique({
      where: { id: startupId },
      select: { userId: true },
    });

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    if (startup.userId !== session.user.id && 
        !session.user.permissions?.includes("ADMIN_ACCESS")) {
      return NextResponse.json(
        { error: "You don't have permission to delete team members from this startup" },
        { status: 403 }
      );
    }

    // Check if team member exists
    const existingMember = await db.team.findFirst({
      where: {
        id: memberId,
        startupId,
      },
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // Delete team member
    await db.team.delete({
      where: {
        id: memberId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}