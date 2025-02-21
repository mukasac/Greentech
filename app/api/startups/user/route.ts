// app/api/startups/user/route.ts
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

    // Fetch startups belonging to the user
    const startups = await db.startup.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        team: true,
        gallery: true,
        jobs: true,
        blogPosts: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(startups);
  } catch (error) {
    console.error("Error fetching user startups:", error);
    return NextResponse.json(
      { error: "Failed to fetch startups" },
      { status: 500 }
    );
  }
}