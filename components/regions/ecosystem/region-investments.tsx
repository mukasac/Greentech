"use client";

// components/regions/ecosystem/region-investments.tsx
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Region } from "@/lib/types/region";
import { LightbulbIcon, LeafIcon, BarChart4Icon, FactoryIcon, Brush } from "lucide-react";

interface RegionInvestmentsProps {
  region: Region;
}

export function RegionInvestments({ region }: RegionInvestmentsProps) {
  // Example investment distribution data - in a real app this would come from an API
  const investmentData = [
    { name: "Clean Energy", value: 35, icon: <LightbulbIcon className="h-4 w-4" /> },
    { name: "Sustainable Transport", value: 25, icon: <FactoryIcon className="h-4 w-4" /> },
    { name: "Circular Economy", value: 20, icon: <LeafIcon className="h-4 w-4" /> },
    { name: "Green Buildings", value: 15, icon: <Brush className="h-4 w-4" /> },
    { name: "Other", value: 5, icon: <BarChart4Icon className="h-4 w-4" /> },
  ];

  // Chart colors that respect light/dark mode
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded shadow-sm">
          <p className="font-medium">{payload[0].name}: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Investment Overview</h2>
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold">
              Total Investment: {region.stats?.totalInvestment || "€50M"}
            </h3>
            <p className="text-muted-foreground">
              Investment distribution across green technology sectors
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Chart */}
            <div className="h-[350px] w-full lg:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={investmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    innerRadius={60}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {investmentData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Investment breakdown */}
            <div className="w-full lg:w-1/2">
              <h4 className="font-medium text-lg mb-4">Sector Breakdown</h4>
              <div className="space-y-4">
                {investmentData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1/2 flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span>{item.name}</span>
                    </div>
                    <div className="w-1/2">
                      <div className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full w-full">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${item.value}%`, 
                            backgroundColor: COLORS[index % COLORS.length] 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs">
                        <span>0%</span>
                        <span>{item.value}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}