import { Region } from "@/lib/types/region";
import { InvestmentOverview } from "./investment-overview";

interface RegionInvestmentsProps {
  region: Region;
}

export function RegionInvestments({ region }: RegionInvestmentsProps) {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Investment Overview</h2>
      <InvestmentOverview totalInvestment={region.stats.totalInvestment} />
    </section>
  );
}