"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { View, ThumbsUp, MessageSquare, Share2 } from "lucide-react";

const viewsData = [
  { date: "2024-03-01", views: 245, shares: 12, comments: 8 },
  { date: "2024-03-02", views: 352, shares: 15, comments: 10 },
  { date: "2024-03-03", views: 461, shares: 18, comments: 15 },
  { date: "2024-03-04", views: 548, shares: 25, comments: 20 },
  { date: "2024-03-05", views: 655, shares: 30, comments: 25 },
];

const trafficSourceData = [
  { name: "Direct", value: 40 },
  { name: "Social", value: 30 },
  { name: "Search", value: 20 },
  { name: "Referral", value: 10 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

const stats = [
  {
    title: "Total Views",
    value: "12,345",
    icon: View,
    change: "+12%",
  },
  {
    title: "Engagement Rate",
    value: "8.5%",
    icon: ThumbsUp,
    change: "+3%",
  },
  {
    title: "Comments",
    value: "234",
    icon: MessageSquare,
    change: "+15%",
  },
  {
    title: "Shares",
    value: "567",
    icon: Share2,
    change: "+7%",
  },
];

export function BlogAnalyticsDashboard() {
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Views Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewsData}>
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
                    dataKey="shares" 
                    stroke="hsl(var(--chart-1))" 
                    name="Shares" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="comments" 
                    stroke="hsl(var(--chart-2))" 
                    name="Comments" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {trafficSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}