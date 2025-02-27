// app/admin/events/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Search, Eye, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Event } from "@/lib/types/event";
import { Badge } from "@/components/ui/badge";

// Sample mock data in case the API fails
const mockEvents: Event[] = [
  {
    id: "mock-1",
    title: "Nordic Green Tech Summit 2024",
    slug: "nordic-green-tech-summit-2024",
    description: "Annual conference bringing together leading sustainable technology innovators.",
    type: "conference",
    date: new Date().toISOString(),
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
  {
    id: "mock-2",
    title: "Sustainable Solutions Workshop",
    slug: "sustainable-solutions-workshop",
    description: "Hands-on workshop exploring practical sustainability approaches.",
    type: "workshop",
    date: new Date().toISOString(),
    location: "Stockholm, Sweden",
    attendees: 50,
    maxAttendees: 60,
    price: {
      amount: 99,
      currency: "EUR",
    },
    organizer: {
      name: "Green Solutions",
      logo: "https://example.com/logo2.png",
    },
    region: "sweden",
    tags: ["Workshop", "Sustainability", "Innovation"],
  },
];

export default function AdminEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [usesMockData, setUsesMockData] = useState(false);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Redirect if not authenticated or doesn't have admin permission
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }

    if (status === "authenticated" && !hasPermission("SITE_ADMIN")) {
      router.push("/unauthorized");
      return;
    }

    // Fetch events only if authenticated and has permission
    if (status === "authenticated" && !hasFetchedRef.current) {
      hasFetchedRef.current = true; // Set flag to prevent multiple fetches
      fetchEvents();
    }
  }, [status, router, hasPermission]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setUsesMockData(false);
      
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
      
      // Check if data is empty or not an array
      if (!Array.isArray(data) || data.length === 0) {
        console.log("No events data found or invalid format, using mock data");
        setEvents(mockEvents);
        setUsesMockData(true);
      } else {
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events");
      
      // Use mock data as fallback
      setEvents(mockEvents);
      setUsesMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      // If using mock data, just simulate deletion
      if (usesMockData) {
        setEvents(events.filter(event => event.id !== eventId));
        setSuccess("Event deleted successfully (mock)");
        return;
      }
      
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      setSuccess("Event deleted successfully");
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event");
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

  if (status === "loading") {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events Management</h1>
          <p className="text-muted-foreground">
            Manage events for the platform
          </p>
          {usesMockData && (
            <p className="text-amber-600 font-medium mt-1">
              Using mock data - API data unavailable
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {loading ? (
            <Button variant="outline" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
          ) : (
            <Button variant="outline" onClick={() => {
              hasFetchedRef.current = false;
              fetchEvents();
            }}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          )}
          
          {hasPermission("CREATE_EVENTS") && (
            <Button asChild>
              <Link href="/admin/events/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Events</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No events found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.type}</Badge>
                    </TableCell>
                    <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/events/${event.slug}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {hasPermission("UPDATE_EVENTS") && (
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/admin/events/${event.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        {hasPermission("DELETE_EVENTS") && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}