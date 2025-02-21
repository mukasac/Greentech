import { Event } from "../types/event";

const events: Event[] = [
  {
    id: "1",
    title: "Nordic Green Tech Summit 2024",
    slug: "nordic-green-tech-summit-2024",
    description: "Annual conference bringing together leading sustainable technology innovators.",
    type: "conference",
    date: "2024-06-15T09:00:00Z",
    location: "Oslo, Norway",
    attendees: 250,
    maxAttendees: 500,
    price: {
      amount: 299,
      currency: "EUR"
    },
    organizer: {
      name: "Innovation Norway",
      logo: "https://example.com/logo.png"
    },
    region: "norway",
    tags: ["Conference", "Networking", "Innovation"]
  },
  // Add more events...
];

export const getRegionEvents = (region: string) => {
  return events.filter(event => event.region === region);
};