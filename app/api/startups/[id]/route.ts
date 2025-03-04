import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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
        climateImpacts: true,
        categories: {
          include: {
            category: true
          }
        }
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startupId = params.id;
    const body = await req.json();
    
    // Check if user has permission to update the startup
    const startup = await db.startup.findUnique({
      where: { id: startupId },
      select: { userId: true }
    });
    
    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }
    
    // Check if user owns the startup or has admin permissions
    if (startup.userId !== session.user.id && !session.user.permissions?.includes("MANAGE_ANY_STARTUP")) {
      return NextResponse.json(
        { error: "You don't have permission to update this startup" },
        { status: 403 }
      );
    }

    const {
      name,
      description,
      website,
      founded,
      employees,
      funding,
      logo,
      profileImage,
      country,
      status,
      featured,
      tags,
      sustainability,
      // Stage fields
      stage,
      startupStage,
      investmentStage,
      fundingNeeds,
      // Other fields...
      socialLinks,
    } = body;

    // Create update data object
    const updateData: any = {
      name,
      description,
      website,
      founded: typeof founded === 'string' ? parseInt(founded) : founded,
      employees,
      funding,
      country,
      tags,
      // Include stage fields explicitly
      startupStage,
      investmentStage,
      fundingNeeds,
    };

    // Add optional fields if they exist
    if (logo) updateData.logo = logo;
    if (profileImage) updateData.profileImage = profileImage;
    if (status) updateData.status = status;
    if (featured !== undefined) updateData.featured = featured;
    if (sustainability) updateData.sustainability = sustainability;
    if (stage) updateData.stage = stage;

    // Update the startup
    const updatedStartup = await db.startup.update({
      where: { id: startupId },
      data: updateData,
      include: {
        team: true,
        gallery: true,
        categories: {
          include: {
            category: true
          }
        },
        climateImpacts: true
      }
    });

    return NextResponse.json(updatedStartup);
  } catch (error) {
    console.error("Error updating startup:", error);
    return NextResponse.json(
      { error: "Failed to update startup" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startupId = params.id;
    
    // Check if user has permission to delete the startup
    const startup = await db.startup.findUnique({
      where: { id: startupId },
      select: { userId: true }
    });
    
    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }
    
    // Check if user owns the startup or has admin permissions
    if (startup.userId !== session.user.id && !session.user.permissions?.includes("MANAGE_ANY_STARTUP")) {
      return NextResponse.json(
        { error: "You don't have permission to delete this startup" },
        { status: 403 }
      );
    }

    // Delete the startup
    await db.startup.delete({
      where: { id: startupId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting startup:", error);
    return NextResponse.json(
      { error: "Failed to delete startup" },
      { status: 500 }
    );
  }
}