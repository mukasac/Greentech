// lib/types/news.ts
export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
  region: string;
  source?: string;
  authorId?: string;
  publishedAt: string;
  updatedAt: string;
}