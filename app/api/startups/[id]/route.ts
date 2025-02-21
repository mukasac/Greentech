// app/api/startups/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const startupId = params.id;
    
    // Fetch startup with all related data
    const startup = await db.startup.findUnique({
      where: { id: startupId },
      include: {
        team: true,
        gallery: true,
        jobs: {
          where: { status: "active" },
          orderBy: { postedAt: "desc" }
        },
        blogPosts: {
          where: { status: "published" },
          orderBy: { publishedAt: "desc" }
        }
      }
    });

    if (!startup) {
      return NextResponse.json(
        { error: "Startup not found" },
        { status: 404 }
      );
    }

    // Add analytics if available
    const analytics = await db.analyticsEvent.findMany({
      where: {
        startupId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      ...startup,
      analytics
    });
  } catch (error) {
    console.error("Error fetching startup:", error);
    return NextResponse.json(
      { error: "Failed to fetch startup" },
      { status: 500 }
    );
  }
}