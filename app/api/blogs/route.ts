import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startupId = searchParams.get('startupId');

    const blogPosts = await db.blogPost.findMany({
      where: {
        startupId: startupId || undefined
      },
      orderBy: {
        publishedAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        status: true,
        publishedAt: true,
        viewCount: true,
        readTime: true,
        author: true,
        tags: true
      }
    });

    return NextResponse.json(blogPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Received blog post data:', data); // Debug log

    // Validate required fields
    if (!data.title || !data.content || !data.slug || !data.startupId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the blog post
    const blogPost = await db.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt || data.content.slice(0, 150) + '...', // Create excerpt from content if not provided
        coverImage: data.coverImage || '/default-blog-cover.jpg', // Provide default cover image
        author: {
          name: data.author?.name || 'Anonymous',
          role: data.author?.role || 'Contributor',
          avatar: data.author?.avatar || '/default-avatar.png'
        },
        tags: data.tags || [],
        status: data.status || 'draft',
        startupId: data.startupId,
        publishedAt: data.status === 'published' ? new Date() : undefined, // Changed from null to undefined
        updatedAt: new Date(),
        readTime: data.readTime || Math.ceil(data.content.split(/\s+/).length / 200), // Calculate read time if not provided
        viewCount: 0
      }
    });

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}