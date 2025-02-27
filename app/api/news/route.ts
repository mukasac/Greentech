// app/api/news/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Sample news data for development if database is empty
const sampleNews = [
  {
    id: "sample-1",
    title: "Norway Launches $100M Green Tech Fund",
    slug: "norway-launches-green-tech-fund",
    excerpt: "New government initiative to boost sustainable technology innovation across the country.",
    content: "The Norwegian government has announced a new $100 million fund dedicated to green technology innovation. The fund will focus on supporting startups and research institutions working on sustainable solutions in energy, transportation, and waste management.\n\nThis initiative is part of Norway's broader strategy to reduce carbon emissions by 55% by 2030 and achieve carbon neutrality by 2050. The fund will provide grants ranging from $50,000 to $2 million for early-stage companies with promising green technologies.\n\n\"Innovation is key to addressing climate change,\" said Norway's Minister of Climate and Environment. \"This fund will help accelerate the development and deployment of technologies that can reduce our environmental footprint while creating jobs and economic growth.\"",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51",
    tags: ["Investment", "Government", "Green Tech"],
    region: "norway",
    source: "Ministry of Climate and Environment",
    publishedAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sample-2",
    title: "Swedish Startup Revolutionizes Battery Recycling",
    slug: "swedish-startup-revolutionizes-battery-recycling",
    excerpt: "Innovative technology reclaims 95% of materials from used lithium-ion batteries, addressing a critical environmental challenge.",
    content: "A Stockholm-based startup has developed a groundbreaking process that can reclaim up to 95% of materials from used lithium-ion batteries, potentially solving one of the biggest challenges in the transition to electric vehicles and renewable energy storage.\n\nThe technology uses a combination of mechanical and hydrometallurgical processes to extract valuable metals like lithium, cobalt, nickel, and manganese from spent batteries. These materials can then be returned to the battery supply chain, reducing the need for new mining operations.\n\n\"Battery waste is going to be one of the biggest environmental challenges in the coming decades,\" said the company's CEO. \"Our solution not only addresses this problem but also creates a circular economy for battery materials.\"\n\nThe company has already secured partnerships with several major automotive manufacturers and plans to open its first full-scale recycling plant next year.",
    image: "https://images.unsplash.com/photo-1611122281384-b1dbd38ed6eb",
    tags: ["Innovation", "Circular Economy", "Energy Storage"],
    region: "sweden",
    source: "GreenTech Sweden",
    publishedAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET(req: Request) {
  try {
    // Try to fetch news from the database
    let news = await db.news.findMany({
      orderBy: { publishedAt: "desc" },
    });

    // If no news in the database, use sample data in development
    if (news.length === 0 && process.env.NODE_ENV !== 'production') {
      console.log('No news found in database, returning sample data');
      return NextResponse.json(sampleNews);
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    
    // Return sample data when database error occurs in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Database error, returning sample data');
      return NextResponse.json(sampleNews);
    }
    
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Check authorization
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check for CREATE_LATEST_NEWS permission or SITE_ADMIN permission
    if (!session.user.permissions?.includes("CREATE_LATEST_NEWS") && 
        !session.user.permissions?.includes("SITE_ADMIN")) {
      return NextResponse.json(
        { error: "You don't have permission to create news articles" },
        { status: 403 }
      );
    }

    // Parse and validate the request body
    const json = await req.json();
    
    // Basic validation (should have more robust validation in production)
    if (!json.title || !json.slug || !json.content || !json.excerpt || !json.image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Create the news article
    try {
      const news = await db.news.create({
        data: {
          ...json,
          authorId: session.user.id,
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(news, { status: 201 });
    } catch (dbError) {
      console.error("Database error creating news:", dbError);
      return NextResponse.json(
        { error: "Failed to save news to database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "Failed to create news article" },
      { status: 500 }
    );
  }
}