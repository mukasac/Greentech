// app/api/news/slug/[slug]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const newsItem = await db.news.findUnique({
      where: { slug: params.slug },
    });

    if (!newsItem) {
      return NextResponse.json(
        { error: "News article not found" },
        { status: 404 }
      );
    }

    // Track view count (optional)
    await db.news.update({
      where: { id: newsItem.id },
      data: {
        // Add a viewCount field if you have one in your schema
        // viewCount: { increment: 1 }
      },
    });

    return NextResponse.json(newsItem);
  } catch (error) {
    console.error("Error fetching news article by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch news article" },
      { status: 500 }
    );
  }
}