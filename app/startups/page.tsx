"use client"

import { Suspense, useState } from "react";
import { StartupsList } from "@/components/startups/startups-list";
import { StartupFilters } from "@/components/startups/startup-filters";
import { StartupSearch } from "@/components/startups/startup-search";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export default function StartupsPage() {
  return (
    <div className="bg-gradient-to-b from-green-50 to-green-50/30 min-h-screen">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Green Tech Startups</h1>
          <p className="text-lg text-muted-foreground">
            Discover innovative startups driving sustainability across the Nordic region.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          {/* Desktop filters */}
          <aside className="hidden lg:block">
            <StartupFilters />
          </aside>
          
          <main>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex-1">
                <StartupSearch />
              </div>
              
              {/* Mobile filters button */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      <span>Filters</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                    <SheetHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <SheetTitle>Filters</SheetTitle>
                        <SheetClose asChild>
                          <Button variant="ghost" size="icon">
                            <X className="h-4 w-4" />
                          </Button>
                        </SheetClose>
                      </div>
                    </SheetHeader>
                    <StartupFilters />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            <Suspense fallback={<StartupsSkeleton />}>
              <StartupsList />
            </Suspense>
          </main>
        </div>
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