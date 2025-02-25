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
        gallery: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        jobs: {
          where: { status: "active" },
          orderBy: { postedAt: 'desc' },
          include: {
            applications: {
              select: {
                id: true,
                status: true
              }
            }
          }
        },
        blogPosts: {
          where: { status: "published" },
          orderBy: { publishedAt: 'desc' },
          include: {
            comments: {
              where: { status: "approved" },
              select: {
                id: true,
                content: true,
                createdAt: true,
                name: true
              }
            }
          }
        },
        documents: {
          where: { shared: true },
          orderBy: { createdAt: 'desc' }
        },
        climateImpacts: true
      }
    });

    if (!startup) {
      return NextResponse.json(
        { error: "Startup not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await db.startup.update({
      where: { id: startupId },
      data: {
        viewCount: { increment: 1 }
      }
    });

    // Track analytics event
    await db.analyticsEvent.create({
      data: {
        type: "view",
        startupId: startupId,
        metadata: {
          timestamp: new Date(),
          userAgent: req.headers.get("user-agent")
        }
      }
    });

    return NextResponse.json(startup);
  } catch (error) {
    console.error("Error fetching startup:", error);
    return NextResponse.json(
      { error: "Failed to fetch startup" },
      { status: 500 }
    );
  }
}