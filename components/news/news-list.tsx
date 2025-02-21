"use client";

import { NewsItem } from "@/lib/types/news";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";

// Mock data - replace with actual data fetching
const news: NewsItem[] = [
  {
    id: "1",
    title: "Norway Launches $100M Green Tech Fund",
    slug: "norway-launches-green-tech-fund",
    excerpt:
      "New government initiative to boost sustainable technology innovation across the country.",
    content: "Full article content...",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51",
    tags: ["Investment", "Government", "Green Tech"],
    publishedAt: "2024-03-15T10:00:00Z",
    region: "norway",
  },
  // Add more news items...
];

export function NewsList() {
  const { hasPermission } = usePermissions();

  return (
    <div className="grid gap-6">
      {news.map((item) => (
        <Card key={item.id}>
          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            <CardContent className="p-6">
              <div className="mb-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="mb-2 text-2xl font-semibold">{item.title}</h3>
              <p className="mb-4 text-muted-foreground">{item.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                </div>
                {hasPermission("VIEW_LATEST_NEWS") && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/news/${item.slug}`}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
            <div className="relative aspect-video md:aspect-auto">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
