// lib/types/event.ts
export type EventType = "conference" | "workshop" | "hackathon" | "networking" | "webinar";

export type EventRegistrationStatus = "confirmed" | "cancelled" | "attended";

export interface EventRegistration {
  id: string;
  eventId: string;
  name: string;
  email: string;
  company?: string;
  registeredAt: string;
  status: EventRegistrationStatus;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: EventType;
  date: string;
  location: string;
  attendees: number;
  maxAttendees?: number;
  price?: {
    amount: number;
    currency: string;
  };
  organizer: {
    name: string;
    logo?: string;
  };
  region: string;
  tags: string[];
  registrations?: EventRegistration[];
  createdAt?: string;
  updatedAt?: string;
}