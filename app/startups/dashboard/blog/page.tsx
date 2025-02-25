import { BlogCard } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function StartupBlogDashboardPage() {
  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">
            Share your startup journey and updates
          </p>
        </div>
        <Button asChild>
          <Link href="/startups/dashboard/blog/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Add blog posts grid here */}
      </div>
    </div>
  );
}