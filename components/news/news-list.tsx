// components/news/news-list.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import { NewsItem } from "@/lib/types/news";
import { usePermissions } from "@/hooks/usePermissions";

interface NewsListProps {
  region?: string;
  category?: string;
  limit?: number;
}

export function NewsList({ region, category, limit = 6 }: NewsListProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { hasPermission } = usePermissions();

  useEffect(() => {
    fetchNews();
  }, [region, category, limit]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      let url = '/api/news';
      const params = new URLSearchParams();
      
      if (region) params.append('region', region);
      if (category) params.append('category', category);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      
      let data = await response.json();
      
      // Apply limit if specified
      if (limit > 0) {
        data = data.slice(0, limit);
      }
      
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        <span>Loading news...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-muted-foreground">No news articles found.</p>
      </div>
    );
  }

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