// app/api/startups/[id]/analytics/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startupId = params.id;

    // Get startup profile views
    const profileViews = await db.analyticsEvent.findMany({
      where: {
        startupId,
        type: "view",
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group views by date
    const viewsByDate = profileViews.reduce((acc, event) => {
      const date = event.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get job application statistics
    const jobStats = await db.job.findMany({
      where: { startupId },
      select: {
        id: true,
        title: true,
        _count: {
          select: { applications: true },
        },
        viewCount: true,
      },
    });

    return NextResponse.json({
      viewsByDate,
      totalViews: profileViews.length,
      jobStats: jobStats.map(job => ({
        jobId: job.id,
        title: job.title,
        applicationCount: job._count.applications,
        viewCount: job.viewCount,
      })),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}