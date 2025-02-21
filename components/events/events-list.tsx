"use client";

import { Event } from "@/lib/types/event";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";

// Mock data - replace with actual data fetching
const events: Event[] = [
  {
    id: "1",
    title: "Nordic Green Tech Summit 2024",
    slug: "nordic-green-tech-summit-2024",
    description:
      "Annual conference bringing together leading sustainable technology innovators.",
    type: "conference",
    date: "2024-06-15T09:00:00Z",
    location: "Oslo, Norway",
    attendees: 250,
    maxAttendees: 500,
    price: {
      amount: 299,
      currency: "EUR",
    },
    organizer: {
      name: "Innovation Norway",
      logo: "https://example.com/logo.png",
    },
    region: "norway",
    tags: ["Conference", "Networking", "Innovation"],
  },
  // Add more events...
];

export function EventsList() {
  const { hasPermission } = usePermissions();

  return (
    <div className="grid gap-6">
      {events.map((event) => (
        <Card key={event.id}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge>{event.type}</Badge>
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="mt-1 text-muted-foreground">
                  {event.description}
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 md:items-end">
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.attendees} / {event.maxAttendees} attendees
                    </span>
                  </div>
                </div>
                {hasPermission("REGISTER_FOR_EVENT") && (
                  <Button asChild>
                    <Link href={`/events/${event.slug}`}>Register Now</Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
