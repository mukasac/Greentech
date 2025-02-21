"use client";

import { useState, useEffect } from "react";
import { BlogPost } from "@/lib/types/blog";

export function useBlogSearch(posts: BlogPost[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter((post) => {
      const searchableText = [
        post.title,
        post.excerpt,
        post.author.name,
        ...post.tags,
      ].join(" ").toLowerCase();
      
      return searchableText.includes(query);
    });

    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  return {
    searchQuery,
    setSearchQuery,
    filteredPosts,
  };
}