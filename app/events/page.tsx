"use client";

import { useState } from "react";
import { EventFilters } from "@/components/events/event-filters";
import { EventsList } from "@/components/events/events-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function EventsPage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="container py-4 md:py-8">
      <div className="mb-4 md:mb-8">
        <h1 className="mb-2 md:mb-4 text-2xl md:text-4xl font-bold tracking-tight">Green Tech Events</h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Discover sustainable technology events across the Nordic region.
        </p>
      </div>

      <div className="mb-4 md:mb-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10 w-full"
          />
        </div>
        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 sm:w-auto w-full lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsFiltersOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <EventFilters />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block sticky top-4 self-start">
          <EventFilters />
        </aside>

        <main>
          <EventsList />
        </main>
      </div>
    </div>
  );
}