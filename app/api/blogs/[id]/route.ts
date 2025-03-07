// app/api/blogs/[id]/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { z } from "zod";

// Define validation schema using Zod
const updateBlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(30, "Content must be at least 30 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  coverImage: z.string().url("Cover image must be a valid URL"),
  tags: z.array(z.string()),
  status: z.enum(["draft", "published", "archived"]),
  startupId: z.string(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const blogId = params.id;
    
    const blogPost = await db.blogPost.findUnique({
      where: { id: blogId },
    });

    if (!blogPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check permissions - FIXED: Changed EDIT_BLOG to UPDATE_BLOG
    if (!session.user.permissions?.includes("UPDATE_BLOG")) {
      return NextResponse.json(
        { error: "You don't have permission to edit blog posts" },
        { status: 403 }
      );
    }

    const blogId = params.id;

    // 3. Get the existing blog post
    const existingPost = await db.blogPost.findUnique({
      where: { id: blogId },
      include: {
        startup: {
          select: { userId: true }
        }
      }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // 4. Check if user owns this blog post's startup
    if (existingPost.startup.userId !== session.user.id && 
        !session.user.permissions?.includes("ADMIN_ACCESS")) {
      return NextResponse.json(
        { error: "You don't have permission to edit this blog post" },
        { status: 403 }
      );
    }

    // 5. Parse and validate request body
    const body = await req.json();
    const validationResult = updateBlogSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 6. Update the blog post
    const updatedPost = await db.blogPost.update({
      where: { id: blogId },
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        tags: data.tags,
        status: data.status,
        updatedAt: new Date(),
        // Only update publishedAt if status is published and it wasn't published before
        publishedAt: data.status === 'published' && !existingPost.publishedAt 
          ? new Date() 
          : existingPost.publishedAt,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check permissions
    if (!session.user.permissions?.includes("DELETE_BLOG")) {
      return NextResponse.json(
        { error: "You don't have permission to delete blog posts" },
        { status: 403 }
      );
    }

    const blogId = params.id;

    // 3. Get the existing blog post
    const existingPost = await db.blogPost.findUnique({
      where: { id: blogId },
      include: {
        startup: {
          select: { userId: true }
        }
      }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // 4. Check if user owns this blog post's startup
    if (existingPost.startup.userId !== session.user.id && 
        !session.user.permissions?.includes("ADMIN_ACCESS")) {
      return NextResponse.json(
        { error: "You don't have permission to delete this blog post" },
        { status: 403 }
      );
    }

    // 5. Delete the blog post
    await db.blogPost.delete({
      where: { id: blogId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}