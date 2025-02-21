import { NewsItem } from "../types/news";

const news: NewsItem[] = [
  {
    id: "1",
    title: "Norway Launches $100M Green Tech Fund",
    slug: "norway-launches-green-tech-fund",
    excerpt: "New government initiative to boost sustainable technology innovation across the country.",
    content: "Full article content...",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51",
    tags: ["Investment", "Government", "Green Tech"],
    publishedAt: "2024-03-15T10:00:00Z",
    region: "norway"
  },
  // Add more news items...
];

export const getRegionNews = (region: string) => {
  return news.filter(item => item.region === region);
};