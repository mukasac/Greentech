import { notFound } from "next/navigation";
import { RegionHeader } from "@/components/regions/region-header";
import { RegionStats } from "@/components/regions/region-stats";
import { RegionStartups } from "@/components/regions/region-startups";
import { RegionNews } from "@/components/regions/region-news";
import { RegionJobs } from "@/components/regions/region-jobs";
import { RegionEvents } from "@/components/regions/region-events";
import { regions } from "@/lib/data/regions";
// import { usePermissions } from "@/hooks/usePermissions";

export function generateStaticParams() {
  return regions.map((region) => ({
    region: region.slug,
  }));
}

export default function RegionPage({ params }: { params: { region: string } }) {
  const region = regions.find((r) => r.slug === params.region);

  if (!region) {
    notFound();
  }
  // const { hasPermission } = usePermissions();


  return (
    <div>
      <RegionHeader region={region} />
      
      <div className="container py-8">
        <div className="grid gap-8">
          <RegionStats region={region} />
          
          <section>
            <h2 className="mb-6 text-2xl font-bold">Featured Startups</h2>
            <RegionStartups region={region.slug} />
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Latest News</h2>
            <RegionNews region={region.slug} />
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Job Opportunities</h2>
            <RegionJobs region={region.slug} />
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Upcoming Events</h2>
            <RegionEvents region={region.slug} />
          </section>
        </div>
      </div>
    </div>
  );
}