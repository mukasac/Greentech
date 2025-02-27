"use client";

import { RegionEcosystemHeader } from "@/components/regions/ecosystem/region-ecosystem-header";
import { RegionInitiatives } from "@/components/regions/ecosystem/region-initiatives";
import { RegionPartners } from "@/components/regions/ecosystem/region-partners";
import { RegionInvestments } from "@/components/regions/ecosystem/region-investments";
import { Region } from "@/lib/types/region";

interface EcosystemContentProps {
  region: Region;
}

export function EcosystemContent({ region }: EcosystemContentProps) {
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