"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Event } from "@/lib/types/event";
import { usePermissions } from "@/hooks/usePermissions";

interface RegionEventsProps {
  region: string;
  events: Event[];
}

export function RegionEvents({ region, events }: RegionEventsProps) {
  const { hasPermission } = usePermissions();

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No events scheduled in this region.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <Badge className="mb-4">{event.type}</Badge>
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {event.description && event.description.length > 120
                  ? `${event.description.substring(0, 120)}...`
                  : event.description}
              </p>

              <div className="space-y-2 text-sm text-muted-foreground mb-4">
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
                  <span>{event.attendees} attendees</span>
                </div>
              </div>
              {hasPermission("REGISTER_FOR_EVENT") && (
                <Button className="w-full" asChild>
                  <Link href={`/events/${event.slug}`}>Register Now</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        {hasPermission("VIEW_EVENTS") && (
          <Button variant="outline" asChild>
            <Link href={`/events?region=${region}`}>
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}