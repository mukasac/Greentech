export type EventType = "conference" | "workshop" | "hackathon" | "networking" | "webinar";

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
}