import { db } from "@/lib/db";
import { StartupCreateInput, StartupUpdateInput } from "@/lib/types/api";

export async function getStartups({ category, region }: { 
  category?: string; 
  region?: string;
}) {
  const where = {
    ...(category && { mainCategory: category }),
    ...(region && { country: region }),
  };

  return db.startup.findMany({
    where,
    include: {
      team: true,
      gallery: true,
    },
  });
}

export async function getStartupById(id: string) {
  return db.startup.findUnique({
    where: { id },
    include: {
      team: true,
      gallery: true,
      jobs: true,
      blogPosts: true,
    },
  });
}

export async function createStartup(data: StartupCreateInput) {
  return db.startup.create({
    data,
  });
}

export async function updateStartup(id: string, data: StartupUpdateInput) {
  return db.startup.update({
    where: { id },
    data,
  });
}

export async function deleteStartup(id: string) {
  return db.startup.delete({
    where: { id },
  });
}