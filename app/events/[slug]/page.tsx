// app/events/[slug]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Banknote, 
  Building, 
  Loader2,
  ArrowLeft, 
  Share, 
  AlertCircle 
} from "lucide-react";
import Link from "next/link";
import { Event } from "@/lib/types/event";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [params.slug]);

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/slug/${params.slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Event not found");
        }
        throw new Error("Failed to fetch event");
      }
      
      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error("Error fetching event:", error);
      setError(error instanceof Error ? error.message : "Failed to load event");
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  const handleRegister = async () => {
    if (!event) return;

    try {
      setRegistering(true);
      
      // Simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRegisterSuccess(true);
    } catch (error) {
      console.error("Error registering for event:", error);
      setError("Failed to register for event");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4 md:py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container py-4 md:py-8">
        <div className="mb-4 md:mb-6">
          <Button variant="ghost" size="sm" asChild className="h-8">
            <Link href="/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-4 md:p-8 py-8 md:py-12">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="mb-4 h-10 w-10 md:h-12 md:w-12 text-red-500" />
              <h2 className="mb-2 text-lg md:text-xl font-semibold">
                {error || "Event not found"}
              </h2>
              <p className="mb-6 text-sm md:text-base text-muted-foreground">
                The event you are looking for does not exist or has been removed.
              </p>
              <Button asChild>
                <Link href="/events">Browse All Events</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();
  const registrationsClosed = isPastEvent || (event.maxAttendees && event.attendees >= event.maxAttendees);

  return (
    <div className="container py-4 md:py-8">
      <div className="mb-4 md:mb-6">
        <Button variant="ghost" size="sm" asChild className="h-8">
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-6 md:gap-8">
        {/* Main content - always full width on mobile, 2/3 on desktop */}
        <main>
          <Card>
            <CardContent className="p-4 md:p-8">
              <div className="mb-4 md:mb-6 flex flex-wrap gap-2">
                <Badge>{event.type}</Badge>
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="mb-4 text-2xl md:text-3xl font-bold">{event.title}</h1>
              
              {/* Mobile-optimized event details at the top */}
              <div className="mb-6 md:hidden space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <span className="font-medium">Date: </span>
                    <span>{eventDate.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <span className="font-medium">Time: </span>
                    <span>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <span className="font-medium">Location: </span>
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <span className="font-medium">Attendees: </span>
                    <span>
                      {event.maxAttendees 
                        ? `${event.attendees} / ${event.maxAttendees}`
                        : event.attendees}
                    </span>
                  </div>
                </div>
                
                {event.price && (
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <span className="font-medium">Price: </span>
                      <span>
                        {event.price.amount === 0 
                          ? "Free" 
                          : `${event.price.amount} ${event.price.currency}`}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <span className="font-medium">Organizer: </span>
                    <span>{event.organizer.name}</span>
                  </div>
                </div>
              </div>
              
              {/* Desktop event details grid */}
              <div className="mb-6 hidden md:grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date and Time</p>
                    <p>{eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p>{event.location}</p>
                  </div>
                </div>
                
                {event.price && (
                  <div className="flex items-center gap-2 text-sm">
                    <Banknote className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Price</p>
                      <p>
                        {event.price.amount === 0 
                          ? "Free" 
                          : `${event.price.amount} ${event.price.currency}`}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Organizer</p>
                    <p>{event.organizer.name}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6 md:mb-8">
                <h2 className="mb-2 md:mb-3 text-lg md:text-xl font-semibold">About the Event</h2>
                <div className="text-sm md:text-base text-muted-foreground whitespace-pre-line">
                  {event.description}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Share className="h-4 w-4" />
                  Share Event
                </Button>
                
                {registerSuccess ? (
                  <Alert className="max-w-md border-green-200 bg-green-50 text-green-800">
                    <AlertTitle>Registration Successful!</AlertTitle>
                    <AlertDescription>
                      You have successfully registered for this event.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="flex flex-col items-center sm:items-end gap-2">
                    <p className="text-sm text-muted-foreground">
                      {isPastEvent 
                        ? "This event has already taken place" 
                        : event.maxAttendees && event.attendees >= event.maxAttendees 
                          ? "This event is fully booked"
                          : event.maxAttendees 
                            ? `${event.attendees} / ${event.maxAttendees} attendees`
                            : `${event.attendees} attendees`}
                    </p>
                    
                    <Button 
                      onClick={handleRegister} 
                      disabled={registering || registrationsClosed ? true : undefined}
                      className="w-full sm:w-auto"
                    >
                      {registering ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : registrationsClosed ? (
                        "Registration Closed"
                      ) : (
                        "Register Now"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
        
        {/* Event details sidebar - hidden on mobile, shown on lg screens */}
        <aside className="hidden lg:block">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p>{eventDate.toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p>{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Attendees</p>
                    <p>
                      {event.maxAttendees 
                        ? `${event.attendees} / ${event.maxAttendees}`
                        : event.attendees}
                    </p>
                  </div>
                </div>
                
                {event.price && (
                  <div className="flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Price</p>
                      <p>
                        {event.price.amount === 0 
                          ? "Free" 
                          : `${event.price.amount} ${event.price.currency}`}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="border-t pt-4 mt-4">
                  <h3 className="mb-2 font-medium">Organizer</h3>
                  <div className="flex items-center gap-4">
                    {event.organizer.logo && (
                      <div className="h-10 w-10 relative">
                        <img 
                          src={event.organizer.logo} 
                          alt={event.organizer.name} 
                          className="h-full w-full object-contain" 
                        />
                      </div>
                    )}
                    <p>{event.organizer.name}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}