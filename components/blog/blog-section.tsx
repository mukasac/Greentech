"use client";

import { BlogPost } from "@/lib/types/blog";
import { BlogCard } from "./blog-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface BlogSectionProps {
  startupId: string;
  posts: BlogPost[];
}

export function BlogSection({ startupId, posts }: BlogSectionProps) {
  if (!posts?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No blog posts yet.</p>
      </div>
    );
  }

  // Show only the latest 3 posts
  const latestPosts = posts.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Latest Updates</h2>
        <Button variant="ghost" asChild>
          <Link href={`/startups/${startupId}/blog`}>
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {latestPosts.map((post) => (
          <BlogCard key={post.id} post={post} startupSlug={startupId} />
        ))}
      </div>
    </div>
  );
}