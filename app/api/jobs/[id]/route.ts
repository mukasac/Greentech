import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    
    // Fetch job with related data
    const job = await db.job.findUnique({
      where: { id: jobId },
      include: {
        startup: {
          select: {
            name: true,
            logo: true,
            country: true,
          },
        },
        applications: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await db.job.update({
      where: { id: jobId },
      data: {
        viewCount: { increment: 1 }
      }
    });

    // Track analytics event
    await db.analyticsEvent.create({
      data: {
        type: "view",
        startupId: job.startupId,
        metadata: {
          jobId: job.id,
          timestamp: new Date(),
        }
      }
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;

    // Delete the job
    await db.job.delete({
      where: { id: jobId },
    });

    return NextResponse.json(
      { message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}