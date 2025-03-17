// app/api/startups/[id]/claim/route.ts
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

    // Check if the startup exists
    const startup = await db.startup.findUnique({
      where: { id: startupId },
    });

    if (!startup) {
      return NextResponse.json(
        { error: "Startup not found" },
        { status: 404 }
      );
    }

    // Check if startup is already claimed
    if (startup.userId) {
      return NextResponse.json(
        { error: "This startup has already been claimed" },
        { status: 400 }
      );
    }

    // Update the startup with the user's ID to claim it
    const claimedStartup = await db.startup.update({
      where: { id: startupId },
      data: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "Startup claimed successfully", startup: claimedStartup },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error claiming startup:", error);
    return NextResponse.json(
      { error: "Failed to claim startup" },
      { status: 500 }
    );
  }
}