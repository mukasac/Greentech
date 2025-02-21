import { NewsFilters } from "@/components/news/news-filters";
import { NewsList } from "@/components/news/news-list";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function NewsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Latest News</h1>
        <p className="text-lg text-muted-foreground">
          Stay updated with the latest developments in Nordic green technology.
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search news..."
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <NewsFilters />
        </aside>
        
        <main>
          <NewsList />
        </main>
      </div>
    </div>
  );
}