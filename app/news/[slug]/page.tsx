// app/news/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, MapPin, Eye } from "lucide-react";
import Link from "next/link";
import { NewsItem } from "@/lib/types/news";
import { usePermissions } from "@/hooks/usePermissions";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check permissions
    if (!hasPermission("VIEW_LATEST_NEWS")) {
      router.push("/unauthorized");
      return;
    }

    fetchNewsItem();
  }, [params.slug, router, hasPermission]);

  const fetchNewsItem = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news/slug/${params.slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("News article not found");
        }
        throw new Error("Failed to fetch news article");
      }
      
      const data = await response.json();
      setNewsItem(data);
    } catch (error) {
      console.error("Error fetching news article:", error);
      setError(error instanceof Error ? error.message : "Failed to load news article");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="mx-auto max-w-3xl">
          <Skeleton className="mb-4 h-10 w-3/4" />
          <div className="mb-6 flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="mb-8 h-64 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="container py-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold">
            {error || "News article not found"}
          </h2>
          <Button asChild>
            <Link href="/news">Back to News</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Link>
        </Button>
      </div>
      
      <article className="mx-auto max-w-3xl">
        <div className="mb-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {newsItem.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mb-4 text-4xl font-bold">{newsItem.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(newsItem.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{newsItem.region.charAt(0).toUpperCase() + newsItem.region.slice(1)}</span>
              </div>
              {newsItem.source && (
                <div>
                  <span>Source: </span>
                  {newsItem.source.startsWith('http') ? (
                    <a 
                      href={newsItem.source} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {new URL(newsItem.source).hostname}
                    </a>
                  ) : (
                    <span>{newsItem.source}</span>
                  )}
                </div>
              )}
            </div>
            
            {hasPermission("SITE_ADMIN") && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/news/${newsItem.id}/edit`}>Edit Article</Link>
              </Button>
            )}
          </div>
        </div>
        
        <div className="mb-8 overflow-hidden rounded-lg">
          <img
            src={newsItem.image}
            alt={newsItem.title}
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {newsItem.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}