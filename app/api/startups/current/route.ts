import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startup = await db.startup.findFirst({
      where: {
        userId: session.user.id
      },
      include: {
        team: true,
        gallery: true,
        climateImpacts: true 
      }
    });

    if (!startup) {
      return NextResponse.json({ error: "No startup found" }, { status: 404 });
    }

    return NextResponse.json(startup);
  } catch (error) {
    console.error("Error fetching current startup:", error);
    return NextResponse.json(
      { error: "Failed to fetch startup" },
      { status: 500 }
    );
  }
}