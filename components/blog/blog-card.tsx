"use client";

import { BlogPost } from "@/lib/types/blog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

interface BlogCardProps {
  post: BlogPost;
  startupSlug?: string;
}

export function BlogCard({ post, startupSlug }: BlogCardProps) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/startups/${startupSlug}/blog/${post.slug}`}>
        <div className="aspect-video overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-6">
        <div className="flex items-center gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <Link href={`/startups/${startupSlug}/blog/${post.slug}`}>
          <h3 className="mt-4 text-xl font-semibold hover:text-primary">
            {post.title}
          </h3>
        </Link>
        <p className="mt-2 text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">{post.author.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}