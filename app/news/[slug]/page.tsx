// app/news/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/lib/types/news";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsItem();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

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
      <div className="container px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-8">
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="mx-auto max-w-3xl">
          <Skeleton className="mb-3 h-8 w-3/4" />
          <div className="mb-4 flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="mb-6 h-48 md:h-64 w-full" />
          <div className="space-y-3">
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
      <div className="container px-4 py-4 md:py-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-3 text-xl md:text-2xl font-bold">
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
    <div className="container px-4 py-4 md:py-8">
      <div className="mb-4 md:mb-8">
        <Button variant="ghost" size="sm" asChild className="px-2 h-8">
          <Link href="/news">
            <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            <span className="text-sm">Back to News</span>
          </Link>
        </Button>
      </div>
      
      <article className="mx-auto max-w-3xl">
        <div className="mb-4 md:mb-6">
          <div className="mb-3 md:mb-4 flex flex-wrap gap-1 md:gap-2">
            {newsItem.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs md:text-sm px-1.5 py-0.5 md:px-2 md:py-1">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mb-3 md:mb-4 text-2xl md:text-4xl font-bold leading-tight">{newsItem.title}</h1>
          
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 md:h-4 md:w-4" />
              <span>{new Date(newsItem.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 md:h-4 md:w-4" />
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
        </div>
        
        <div className="mb-4 md:mb-8 overflow-hidden rounded-lg">
          <div className="relative aspect-[16/9] max-w-md mx-auto">
            <Image
              src={newsItem.image}
              alt={newsItem.title}
              fill
              sizes="(max-width: 768px) 100vw, 450px"
              priority
              className="object-cover"
            />
          </div>
        </div>
        
        <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none dark:prose-invert">
          {newsItem.content.split('\n').map((paragraph, index) => (
            <p key={index} className="my-3 md:my-4 text-sm md:text-base">{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}