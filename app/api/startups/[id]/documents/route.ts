// app/api/startups/[id]/documents/route.ts
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
    
    const documents = await db.document.findMany({
      where: { startupId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startupId = params.id;
    
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
        { error: "You don't have permission to add documents to this startup" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, url, type, size, shared = false } = body;

    // Validate required fields
    if (!name || !url || !type) {
      return NextResponse.json(
        { error: "Name, URL, and type are required" },
        { status: 400 }
      );
    }

    // Create document
    const document = await db.document.create({
      data: {
        name,
        url,
        type,
        size: size || null,
        shared,
        startupId,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}