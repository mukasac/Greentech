"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Users, View, Clock, Send } from "lucide-react";

const data = [
  { date: "2024-03-01", views: 45, applications: 12 },
  { date: "2024-03-02", views: 52, applications: 15 },
  { date: "2024-03-03", views: 61, applications: 18 },
  { date: "2024-03-04", views: 48, applications: 14 },
  { date: "2024-03-05", views: 55, applications: 16 },
];

const stats = [
  {
    title: "Total Views",
    value: "2,345",
    icon: View,
    change: "+12%",
  },
  {
    title: "Applications",
    value: "145",
    icon: Send,
    change: "+8%",
  },
  {
    title: "Candidates",
    value: "89",
    icon: Users,
    change: "+5%",
  },
  {
    title: "Avg. Time to Apply",
    value: "2.5 days",
    icon: Clock,
    change: "-10%",
  },
];

export function JobAnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="hsl(var(--primary))" 
                  name="Views" 
                />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="hsl(var(--chart-1))" 
                  name="Applications" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}