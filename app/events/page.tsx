import { EventFilters } from "@/components/events/event-filters";
import { EventsList } from "@/components/events/events-list";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Green Tech Events</h1>
        <p className="text-lg text-muted-foreground">
          Discover sustainable technology events across the Nordic region.
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <EventFilters />
        </aside>
        
        <main>
          <EventsList />
        </main>
      </div>
    </div>
  );
}