import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Check authorization
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check for SITE_ADMIN permission
    if (!session.user.permissions?.includes("SITE_ADMIN")) {
      return NextResponse.json(
        { error: "You don't have permission to access region administration" },
        { status: 403 }
      );
    }

    // Find region by slug
    const region = await db.region.findUnique({
      where: { slug: params.slug },
      select: { id: true, name: true, slug: true }
    });

    if (!region) {
      return NextResponse.json(
        { error: "Region not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ regionId: region.id });
  } catch (error) {
    console.error("Error resolving region slug to ID:", error);
    return NextResponse.json(
      { error: "Failed to convert slug to ID" },
      { status: 500 }
    );
  }
}