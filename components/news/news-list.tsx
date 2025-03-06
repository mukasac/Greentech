"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/lib/types/news";

interface NewsListProps {
  region?: string;
  category?: string;
  limit?: number;
}

export function NewsList({ region, category, limit = 6 }: NewsListProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="flex items-center justify-center py-6">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        <span>Loading news...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-muted-foreground">No news articles found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {news.map((item) => (
        <Link href={`/news/${item.slug}`} key={item.id} className="block">
          <Card className="overflow-hidden transition-colors hover:bg-muted/50 cursor-pointer">
            <div className="flex flex-row">
              {/* Image on the left for both mobile and desktop */}
              <div className="w-24 md:w-32 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
              
              {/* Content */}
              <CardContent className="flex flex-col justify-between p-3 md:p-4 flex-grow">
                {/* Tags */}
                <div>
                  <div className="mb-2 flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Title only (no excerpt) */}
                  <h3 className="font-semibold text-sm md:text-base line-clamp-2">
                    {item.title}
                  </h3>
                </div>
                
                {/* Footer: Date - Removed button since entire card is clickable */}
                <div className="flex items-center mt-auto pt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}