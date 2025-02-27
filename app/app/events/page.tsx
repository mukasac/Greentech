// app/events/page.tsx
"use client";

import { useState, useEffect } from "react";
import { EventFilters } from "@/components/events/event-filters";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { Event } from "@/lib/types/event";
import { Input } from "@/components/ui/input";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const { hasPermission } = usePermissions();
  
  useEffect(() => {
    fetchEvents();
  }, [regionFilter, typeFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Build query string for filters
      const queryParams = new URLSearchParams();
      if (regionFilter) queryParams.append("region", regionFilter);
      if (typeFilter) queryParams.append("type", typeFilter);
      
      const url = `/api/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from API");
      }
      
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(`Failed to load events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type: string, value: string | null) => {
    if (type === 'region') {
      setRegionFilter(value);
    } else if (type === 'type') {
      setTypeFilter(value);
    }
  };

  const filteredEvents = searchQuery
    ? events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : events;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Green Tech Events</h1>
        <p className="text-lg text-muted-foreground">
          Discover sustainable technology events across the Nordic region.
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <EventFilters onFilterChange={handleFilterChange} />
        </aside>
        
        <main>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Loading events...</p>
              </div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find events.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredEvents.map((event) => (
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
          )}
        </main>
      </div>
    </div>
  );
}