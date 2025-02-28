// app/api/events/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";

// Define validation schema using Zod
const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Event type is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  maxAttendees: z.number().nullable().optional(),
  price: z.object({
    amount: z.number(),
    currency: z.string(),
  }),
  organizer: z.object({
    name: z.string(),
    logo: z.string().optional(),
  }),
  region: z.string().min(1, "Region is required"),
  tags: z.array(z.string()),
});

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
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for CREATE_EVENTS permission or SITE_ADMIN permission
    if (!session.user.permissions?.includes("CREATE_EVENTS") && 
        !session.user.permissions?.includes("SITE_ADMIN")) {
      return NextResponse.json(
        { error: "You don't have permission to create events" },
        { status: 403 }
      );
    }

    // Parse and validate the request body
    const json = await req.json();
    
    try {
      const validatedData = eventSchema.parse(json);
      
      // Create the event
      const event = await db.event.create({
        data: {
          ...validatedData,
          date: new Date(validatedData.date),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(event, { status: 201 });
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
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}