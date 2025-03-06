"use client";

import { useState, useEffect } from "react";
import { Event } from "@/lib/types/event";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Loader2 } from "lucide-react";
import Link from "next/link";

export function EventsList() {
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
    <div className="grid gap-4 sm:gap-6">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge>{event.type}</Badge>
                  {event.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">{event.title}</h3>
                <p className="mt-1 text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-3">
                  {event.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  {event.maxAttendees ? (
                    <span className="truncate">
                      {event.attendees} / {event.maxAttendees} attendees
                    </span>
                  ) : (
                    <span className="truncate">{event.attendees} attendees</span>
                  )}
                </div>
              </div>
              
              <div className="mt-2">
                <Button asChild className="w-full sm:w-auto">
                  <Link href={`/events/${event.slug}`}>Register Now</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}