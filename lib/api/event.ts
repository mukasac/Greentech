import { db } from "@/lib/db";
import { EventCreateInput } from "@/lib/types/api";

export async function getEvents({ region, type }: {
  region?: string;
  type?: string;
}) {
  const where = {
    ...(region && { region }),
    ...(type && { type }),
  };

  return db.event.findMany({
    where,
    orderBy: { date: "asc" },
  });
}

export async function createEvent(data: EventCreateInput) {
  return db.event.create({
    data,
  });
}

export async function getEventBySlug(slug: string) {
  return db.event.findUnique({
    where: { slug },
  });
}