import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const startupId = req.headers.get('x-startup-id');
    
    const blogPosts = await db.blogPost.findMany({
      where: {
        startupId: startupId || undefined
      },
      orderBy: {
        publishedAt: 'desc'
      },
      include: {
        startup: true,
        comments: true
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