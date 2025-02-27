import { notFound } from "next/navigation";
import { EcosystemContent } from "@/components/regions/ecosystem/ecosystem-content";
import { RegionService } from "@/lib/services/region-service";

export async function generateStaticParams() {
  const regions = await RegionService.getAllRegions();
  return regions.map((region) => ({
    region: region.slug,
  }));
}

export default async function RegionEcosystemPage({ params }: { params: { region: string } }) {
  try {
    // Get region data using the service
    const region = await RegionService.getRegionBySlug(params.region);
    
    if (!region) {
      notFound();
    }

    return <EcosystemContent region={region} />;
  } catch (error) {
    console.error(`Error in RegionEcosystemPage for ${params.region}:`, error);
    notFound();
  }
}