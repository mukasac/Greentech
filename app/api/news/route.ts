import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsSchema } from "@/lib/validations/news";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region");
    const category = searchParams.get("category");

    const where = {
      ...(region && { region }),
      ...(category && { category }),
    };

    const news = await db.news.findMany({
      where,
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const json = await req.json();
    const body = newsSchema.parse(json);

    const news = await db.news.create({
      data: {
        ...body,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 }
    );
  }
}