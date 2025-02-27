// app/api/events/slug/[slug]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Find the event by slug
    const event = await db.event.findUnique({
      where: { slug: params.slug },
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

    // Increment view count - you could add this field to your Event model
    // await db.event.update({
    //   where: { id: event.id },
    //   data: {
    //     viewCount: { increment: 1 }
    //   }
    // });

    // Track analytics event if needed
    await db.analyticsEvent.create({
      data: {
        type: "view",
        startupId: event.id, // You might need to adjust this field
        metadata: {
          eventId: event.id,
          timestamp: new Date(),
          userAgent: req.headers.get("user-agent")
        }
      }
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}