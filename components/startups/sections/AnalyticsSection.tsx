"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart as RechartsBarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart,
  Line,
} from "recharts";
import { View, Briefcase, Users, Eye, LineChart as LineChartIcon } from "lucide-react";

interface AnalyticsSectionProps {
  startup: {
    id: string;
    name: string;
    viewCount: number;
    team?: { length: number };
    jobs?: { length: number };
  };
}

interface AnalyticsData {
  viewsByDate: Record<string, number>;
  totalViews: number;
  jobStats: {
    jobId: string;
    title: string;
    applicationCount: number;
    viewCount: number;
  }[];
}

export function AnalyticsSection({ startup }: AnalyticsSectionProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/startups/${startup.id}/analytics`);
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [startup.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  const viewsData = data ? Object.entries(data.viewsByDate).map(([date, count]) => ({
    date,
    views: count
  })) : [];

  const jobData = data?.jobStats.map(job => ({
    title: job.title,
    applications: job.applicationCount,
    views: job.viewCount
  })) || [];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <h3 className="text-2xl font-bold">{data?.totalViews || 0}</h3>
              </div>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                <h3 className="text-2xl font-bold">{startup.team?.length || 0}</h3>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                <h3 className="text-2xl font-bold">{startup.jobs?.length || 0}</h3>
              </div>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applications</p>
                <h3 className="text-2xl font-bold">
                  {data?.jobStats.reduce((sum, job) => sum + job.applicationCount, 0) || 0}
                </h3>
              </div>
              <LineChartIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Views Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Views</CardTitle>
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
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Job Performance Chart */}
      {jobData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Job Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={jobData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="hsl(var(--primary))" name="Views" />
                  <Bar dataKey="applications" fill="hsl(var(--primary))" name="Applications" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}