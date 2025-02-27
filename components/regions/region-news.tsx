"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { NewsItem } from "@/lib/types/news";
import { usePermissions } from "@/hooks/usePermissions";

interface RegionNewsProps {
  region: string;
  news: NewsItem[];
}

export function RegionNews({ region, news }: RegionNewsProps) {
  const { hasPermission } = usePermissions();

  if (!news || news.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No news available for this region.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <Card key={item.id}>
            <div className="aspect-video overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {item.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {new Date(item.publishedAt).toLocaleDateString()}
                </span>
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
          </Card>
        ))}
      </div>

      <div className="text-center">
        {hasPermission("VIEW_LATEST_NEWS") && (
          <Button variant="outline" asChild>
            <Link href={`/news?region=${region}`}>
              View All News
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}