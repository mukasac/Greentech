import { notFound } from "next/navigation";
import { RegionContent } from "@/components/regions/region-content";
import { RegionService } from "@/lib/services/region-service";

export async function generateStaticParams() {
  const regions = await RegionService.getAllRegions();
  return regions.map((region) => ({
    region: region.slug,
  }));
}

export default async function RegionPage({ params }: { params: { region: string } }) {
  try {
    // Get all region data using the service
    const { region, startups, news, events, jobs } = await RegionService.getRegionData(params.region);
    
    if (!region) {
      notFound();
    }

    // Pass all data to the client component
    return (
      <RegionContent 
        region={region}
        startups={startups}
        news={news}
        events={events}
        jobs={jobs}
        regionSlug={params.region}
      />
    );
  } catch (error) {
    console.error(`Error in RegionPage for ${params.region}:`, error);
    notFound();
  }
}