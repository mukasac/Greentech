// app/api/events/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { z } from "zod";

const updateEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
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

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const event = await db.event.findUnique({
      where: { id: params.id },
      include: {
        registrations: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
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
    
    // Check for UPDATE_EVENTS permission or SITE_ADMIN permission
    if (!session.user.permissions?.includes("UPDATE_EVENTS") && 
        !session.user.permissions?.includes("SITE_ADMIN")) {
      return NextResponse.json(
        { error: "You don't have permission to update events" },
        { status: 403 }
      );
    }

    // Check if the event exists
    const existingEvent = await db.event.findUnique({
      where: { id: params.id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Parse and validate the request body
    const json = await req.json();
    
    try {
      const validatedData = updateEventSchema.parse(json);
      
      // Update the event
      const updatedEvent = await db.event.update({
        where: { id: params.id },
        data: {
          ...validatedData,
          date: new Date(validatedData.date),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(updatedEvent);
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
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
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
    
    // Check for DELETE_EVENTS permission or SITE_ADMIN permission
    if (!session.user.permissions?.includes("DELETE_EVENTS") && 
        !session.user.permissions?.includes("SITE_ADMIN")) {
      return NextResponse.json(
        { error: "You don't have permission to delete events" },
        { status: 403 }
      );
    }

    // Check if the event exists
    const existingEvent = await db.event.findUnique({
      where: { id: params.id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Delete the event
    await db.event.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}