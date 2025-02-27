"use client";

import { useState, useEffect } from "react";
import { Event } from "@/lib/types/event";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";

export function EventsList() {
  const { hasPermission } = usePermissions();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/events", {
          cache: 'no-store',
          headers: {
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (!events || events.length === 0) {
    return <div className="text-center py-4">No events found</div>;
  }

  return (
    <div className="grid gap-6">
      {events.map((event) => (
        <Card key={event.id}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge>{event.type}</Badge>
                  {event.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="mt-1 text-muted-foreground">
                  {event.description.substring(0, 120)}
                  {event.description.length > 120 ? '...' : ''}
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
                    {event.maxAttendees ? (
                      <span>
                        {event.attendees} / {event.maxAttendees} attendees
                      </span>
                    ) : (
                      <span>{event.attendees} attendees</span>
                    )}
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