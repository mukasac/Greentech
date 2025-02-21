import { Suspense } from "react";
import { StartupsList } from "@/components/startups/startups-list";
import { StartupFilters } from "@/components/startups/startup-filters";
import { StartupSearch } from "@/components/startups/startup-search";
import { Skeleton } from "@/components/ui/skeleton";

export default function StartupsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Green Tech Startups</h1>
        <p className="text-lg text-muted-foreground">
          Discover innovative startups driving sustainability across the Nordic region.
        </p>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <StartupFilters />
        </aside>
        
        <main>
          <StartupSearch />
          <Suspense fallback={<StartupsSkeleton />}>
            <StartupsList />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function StartupsSkeleton() {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array(6).fill(null).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}