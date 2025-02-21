import { Card, CardContent } from "@/components/ui/card";
import { InvestmentPieChart } from "./charts/investment-pie-chart";

const investmentData = [
  { name: "Clean Energy", value: 35 },
  { name: "Sustainable Transport", value: 25 },
  { name: "Circular Economy", value: 20 },
  { name: "Green Buildings", value: 15 },
  { name: "Other", value: 5 },
];

interface InvestmentOverviewProps {
  totalInvestment: string;
}

export function InvestmentOverview({ totalInvestment }: InvestmentOverviewProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold">
            Total Investment: {totalInvestment}
          </h3>
          <p className="text-muted-foreground">
            Investment distribution across sectors
          </p>
        </div>
        
        <InvestmentPieChart data={investmentData} />
      </CardContent>
    </Card>
  );
}