// app/api/startups/[id]/gallery/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const startupId = params.id;

    const galleryImages = await db.gallery.findMany({
      where: { startupId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(galleryImages);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 }
    );
  }
}

// export async function POST(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const startupId = params.id;

//     // Check if user owns this startup
//     const startup = await db.startup.findUnique({
//       where: { id: startupId },
//       select: { userId: true },
//     });

//     if (!startup) {
//       return NextResponse.json({ error: "Startup not found" }, { status: 404 });
//     }

//     if (startup.userId !== session.user.id &&
//         !session.user.permissions?.includes("ADMIN_ACCESS")) {
//       return NextResponse.json(
//         { error: "You don't have permission to add gallery images to this startup" },
//         { status: 403 }
//       );
//     }

//     const body = await req.json();
//     const { url, alt, caption, isPrimary = false } = body;

//     // Validate required fields
//     if (!url) {
//       return NextResponse.json(
//         { error: "Image URL is required" },
//         { status: 400 }
//       );
//     }

//     // Create gallery image
//     const galleryImage = await db.gallery.create({
//       data: {
//         url,
//         alt: alt || null,
//         caption: caption || null,
//         isPrimary,
//         startupId,
//       },
//     });

//     return NextResponse.json(galleryImage, { status: 201 });
//   } catch (error) {
//     console.error("Error creating gallery image:", error);
//     return NextResponse.json(
//       { error: "Failed to create gallery image" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startupId = params.id;
console.log("Startup ID route.......:", startupId);
    // Check if the startup exists and if the user owns it or has admin access
    const startup = await db.startup.findUnique({
      where: { id: startupId },
      select: { userId: true },
    });

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    // Ensure the user has permission to add images to this startup
    if (
      startup.userId !== session.user.id &&
      !session.user.permissions?.includes("ADMIN_ACCESS")
    ) {
      return NextResponse.json(
        { error: "You don't have permission to add images to this startup" },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const { url, alt, caption } = body;

    // Validate the required fields
    if (!url) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Insert the image into the gallery table
    const galleryImage = await db.gallery.create({
      data: {
        url,
        alt: alt || null,
        caption: caption || null,
        startupId,
      },
    });

    // Return the created gallery image
    return NextResponse.json(galleryImage, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery image:", error);
    return NextResponse.json(
      { error: "Failed to create gallery image" },
      { status: 500 }
    );
  }
}
