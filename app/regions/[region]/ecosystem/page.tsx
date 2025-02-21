import { notFound } from "next/navigation";
import { regions } from "@/lib/data/regions";
import { RegionEcosystemHeader } from "@/components/regions/ecosystem/region-ecosystem-header";
import { RegionInitiatives } from "@/components/regions/ecosystem/region-initiatives";
import { RegionPartners } from "@/components/regions/ecosystem/region-partners";
import { RegionInvestments } from "@/components/regions/ecosystem/region-investments";

export function generateStaticParams() {
  return regions.map((region) => ({
    region: region.slug,
  }));
}

export default function RegionEcosystemPage({ params }: { params: { region: string } }) {
  const region = regions.find((r) => r.slug === params.region);

  if (!region) {
    notFound();
  }

  return (
    <div>
      <RegionEcosystemHeader region={region} />
      
      <div className="container py-8">
        <div className="grid gap-8">
          <RegionInitiatives initiatives={region.initiatives} />
          <RegionPartners partners={region.ecosystemPartners} />
          <RegionInvestments region={region} />
        </div>
      </div>
    </div>
  );
}