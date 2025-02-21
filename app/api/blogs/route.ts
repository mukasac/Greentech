// app/api/blogs/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Update permission check to match the correct permission name
    if (!session.user.permissions?.includes("CREATE_BLOG")) {
      console.log("User permissions:", session.user.permissions);
      return NextResponse.json(
        { error: "You don't have permission to create blog posts" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      content,
      excerpt,
      coverImage,
      tags,
      status,
      startupId,
      author,
    } = body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .trim();

    // Check if user owns this startup
    const startup = await db.startup.findUnique({
      where: { id: startupId },
      select: { userId: true },
    });

    if (!startup) {
      return NextResponse.json(
        { error: "Startup not found" },
        { status: 404 }
      );
    }

    if (startup.userId !== session.user.id && 
        !session.user.permissions?.includes("ADMIN_ACCESS")) {
      return NextResponse.json(
        { error: "You don't have permission to create blog posts for this startup" },
        { status: 403 }
      );
    }

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    // Create blog post
    const blogPost = await db.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        coverImage,
        tags: Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()),
        status,
        readTime,
        viewCount: 0,
        startupId,
        author: {
          name: author?.name || session.user.name || "Anonymous",
          role: author?.role || "Team Member",
          avatar: author?.avatar || "/placeholder-avatar.png",
        },
      },
    });

    return NextResponse.json(blogPost, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}