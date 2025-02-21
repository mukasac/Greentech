import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eventSchema } from "@/lib/validations/event";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region");
    const type = searchParams.get("type");

    const where = {
      ...(region && { region }),
      ...(type && { type }),
    };

    const events = await db.event.findMany({
      where,
      orderBy: { date: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
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
    const body = eventSchema.parse(json);

    const event = await db.event.create({
      data: {
        ...body,
        organizerId: session.user.id,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}