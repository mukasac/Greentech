// app/api/startups/[id]/team/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startupId = params.id;
    
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
        { error: "You don't have permission to add team members to this startup" },
        { status: 403 }
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

    // Create team member
    const teamMember = await db.team.create({
      data: {
        name,
        role,
        image,
        bio: bio || null,
        linkedin: linkedin || null,
        twitter: twitter || null,
        startupId,
      },
    });

    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}