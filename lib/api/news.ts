import { db } from "@/lib/db";
import { NewsCreateInput } from "@/lib/types/api";

export async function getNews({ region, category }: {
  region?: string;
  category?: string;
}) {
  const where = {
    ...(region && { region }),
    ...(category && { category }),
  };

  return db.news.findMany({
    where,
    orderBy: { publishedAt: "desc" },
  });
}

export async function createNews(data: NewsCreateInput) {
  return db.news.create({
    data,
  });
}

export async function getNewsBySlug(slug: string) {
  return db.news.findUnique({
    where: { slug },
  });
}