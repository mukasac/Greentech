// app/api/startups/[id]/gallery/[imageId]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const { id: startupId, imageId } = params;
    
    const galleryImage = await db.gallery.findFirst({
      where: {
        id: imageId,
        startupId,
      },
    });

    if (!galleryImage) {
      return NextResponse.json(
        { error: "Gallery image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(galleryImage);
  } catch (error) {
    console.error("Error fetching gallery image:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery image" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: startupId, imageId } = params;
    
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
        { error: "You don't have permission to update gallery images for this startup" },
        { status: 403 }
      );
    }

    // Check if gallery image exists
    const existingImage = await db.gallery.findFirst({
      where: {
        id: imageId,
        startupId,
      },
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: "Gallery image not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { url, alt, caption, isPrimary } = body;

    // Validate required fields
    if (!url) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Update gallery image
    const updatedImage = await db.gallery.update({
      where: {
        id: imageId,
      },
      data: {
        url,
        alt: alt || null,
        caption: caption || null,
        isPrimary: isPrimary !== undefined ? isPrimary : existingImage.isPrimary,
      },
    });

    return NextResponse.json(updatedImage);
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return NextResponse.json(
      { error: "Failed to update gallery image" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: startupId, imageId } = params;
    
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
        { error: "You don't have permission to delete gallery images from this startup" },
        { status: 403 }
      );
    }

    // Check if gallery image exists
    const existingImage = await db.gallery.findFirst({
      where: {
        id: imageId,
        startupId,
      },
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: "Gallery image not found" },
        { status: 404 }
      );
    }

    // Delete gallery image
    await db.gallery.delete({
      where: {
        id: imageId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}