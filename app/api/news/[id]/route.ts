// app/api/news/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { z } from "zod";

const updateNewsSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(50, "Excerpt must be at least 50 characters"),
  content: z.string().min(100, "Content must be at least 100 characters"),
  image: z.string().url("Image must be a valid URL"),
  tags: z.array(z.string()),
  region: z.string(),
  source: z.string().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const newsItem = await db.news.findUnique({
      where: { id: params.id },
    });

    if (!newsItem) {
      return NextResponse.json(
        { error: "News article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(newsItem);
  } catch (error) {
    console.error("Error fetching news article:", error);
    return NextResponse.json(
      { error: "Failed to fetch news article" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authorization
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check for UPDATE_LATEST_NEWS permission or SITE_ADMIN permission
    if (!session.user.permissions?.includes("UPDATE_LATEST_NEWS") && 
        !session.user.permissions?.includes("SITE_ADMIN")) {
      return NextResponse.json(
        { error: "You don't have permission to update news articles" },
        { status: 403 }
      );
    }

    // Check if the news article exists
    const existingNews = await db.news.findUnique({
      where: { id: params.id },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: "News article not found" },
        { status: 404 }
      );
    }

    // Parse and validate the request body
    const json = await req.json();
    
    try {
      const validatedData = updateNewsSchema.parse(json);
      
      // Update the news article
      const updatedNews = await db.news.update({
        where: { id: params.id },
        data: {
          ...validatedData,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(updatedNews);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: validationError.format() },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error("Error updating news article:", error);
    return NextResponse.json(
      { error: "Failed to update news article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authorization
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check for DELETE_LATEST_NEWS permission or SITE_ADMIN permission
    if (!session.user.permissions?.includes("DELETE_LATEST_NEWS") && 
        !session.user.permissions?.includes("SITE_ADMIN")) {
      return NextResponse.json(
        { error: "You don't have permission to delete news articles" },
        { status: 403 }
      );
    }

    // Check if the news article exists
    const existingNews = await db.news.findUnique({
      where: { id: params.id },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: "News article not found" },
        { status: 404 }
      );
    }

    // Delete the news article
    await db.news.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting news article:", error);
    return NextResponse.json(
      { error: "Failed to delete news article" },
      { status: 500 }
    );
  }
}