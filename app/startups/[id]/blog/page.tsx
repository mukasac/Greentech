"use client";

import { BlogCard } from "@/components/blog/blog-card";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useBlogSearch } from "@/lib/hooks/use-blog-search";
import { usePagination } from "@/lib/hooks/use-pagination";

// This would come from your data layer
const mockPosts = [
  {
    id: "1",
    startupId: "1",
    title: "Revolutionizing Solar Energy Storage",
    slug: "revolutionizing-solar-energy-storage",
    excerpt: "Learn about our latest breakthrough in solar energy storage technology...",
    content: "Full content here...",
    coverImage: "https://images.unsplash.com/photo-1509390157308-b78dfe79b8fb",
    author: {
      name: "Maria Larsson",
      role: "Head of Research",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    },
    tags: ["Solar Energy", "Innovation", "Technology"],
    publishedAt: "2024-03-15T10:00:00Z",
    status: "published",
    readTime: 5,
  },
  // Add more mock posts as needed
];

const POSTS_PER_PAGE = 9;

export default function StartupBlogPage({ params }: { params: { id: string } }) {
  const { searchQuery, setSearchQuery, filteredPosts } = useBlogSearch(mockPosts);
  const { 
    currentPage,
    pageItems,
    nextPage,
    previousPage,
    goToPage,
    startIndex,
    endIndex,
  } = usePagination({
    totalItems: filteredPosts.length,
    itemsPerPage: POSTS_PER_PAGE,
  });

  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Latest Updates</h1>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              className="pl-10" 
              placeholder="Search posts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            Subscribe to Updates
          </Button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No posts found matching your search.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => (
              <BlogCard key={post.id} post={post} startupSlug={params.id} />
            ))}
          </div>

          <div className="mt-8">
            <BlogPagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredPosts.length / POSTS_PER_PAGE)}
              pageItems={pageItems}
              onPageChange={goToPage}
              onNext={nextPage}
              onPrevious={previousPage}
            />
          </div>
        </>
      )}
    </div>
  );
}