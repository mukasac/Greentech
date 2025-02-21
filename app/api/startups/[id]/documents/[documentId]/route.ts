// app/api/startups/[id]/documents/[documentId]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string; documentId: string } }
) {
  try {
    const { id: startupId, documentId } = params;
    
    const document = await db.document.findFirst({
      where: {
        id: documentId,
        startupId,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string; documentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: startupId, documentId } = params;
    
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
        { error: "You don't have permission to update documents for this startup" },
        { status: 403 }
      );
    }

    // Check if document exists
    const existingDocument = await db.document.findFirst({
      where: {
        id: documentId,
        startupId,
      },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, url, type, size, shared } = body;

    // Validate required fields
    if (!name || !url || !type) {
      return NextResponse.json(
        { error: "Name, URL, and type are required" },
        { status: 400 }
      );
    }

    // Update document
    const updatedDocument = await db.document.update({
      where: {
        id: documentId,
      },
      data: {
        name,
        url,
        type,
        size: size || null,
        shared: shared !== undefined ? shared : existingDocument.shared,
      },
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; documentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: startupId, documentId } = params;
    
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
        { error: "You don't have permission to delete documents from this startup" },
        { status: 403 }
      );
    }

    // Check if document exists
    const existingDocument = await db.document.findFirst({
      where: {
        id: documentId,
        startupId,
      },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Delete document
    await db.document.delete({
      where: {
        id: documentId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}