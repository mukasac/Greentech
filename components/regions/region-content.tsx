import { RegionHeader } from "@/components/regions/region-header";
import { RegionStartups } from "@/components/regions/region-startups";
import { RegionNews } from "@/components/regions/region-news";
import { RegionJobs } from "@/components/regions/region-jobs";
import { RegionEvents } from "@/components/regions/region-events";
import { Region } from "@/lib/types/region";
import { Startup } from "@/lib/types/startup";
import { NewsItem } from "@/lib/types/news";
import { Event } from "@/lib/types/event";
import { Job } from "@/lib/types/job";

interface RegionContentProps {
  region: Region;
  startups: Startup[];
  news: NewsItem[];
  events: Event[];
  jobs: Job[];
  regionSlug: string;
}

export function RegionContent({ 
  region, 
  startups, 
  news, 
  events, 
  jobs, 
  regionSlug 
}: RegionContentProps) {
  return (
    <div>
      <RegionHeader region={region} regionSlug={regionSlug} />
      
      <div className="container py-8">
        <div className="grid gap-8">
          <section>
            <h2 className="mb-6 text-2xl font-bold">Featured Startups</h2>
            <RegionStartups region={regionSlug} startups={startups} />
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Latest News</h2>
            <RegionNews region={regionSlug} news={news} />
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Job Opportunities</h2>
            <RegionJobs region={regionSlug} jobs={jobs} />
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Upcoming Events</h2>
            <RegionEvents region={regionSlug} events={events} />
          </section>
        </div>
      </div>
    </div>
  );
}