// app/admin/regions/stats/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";
import AdminRefreshStats from "@/components/admin/AdminRefreshStats";

interface Region {
  id: string;
  slug: string;
  name: string;
  stats: {
    startups: number;
    employees: number;
    openJobs: number;
    upcomingEvents: number;
    totalInvestment: string;
    updatedAt: string;
  }
}

export default function AdminRegionsStatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated or doesn't have admin permission
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }

    if (status === "authenticated" && !hasPermission("SITE_ADMIN")) {
      router.push("/unauthorized");
      return;
    }

    // Fetch regions with stats
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/regions");
        
        if (!response.ok) {
          throw new Error("Failed to fetch regions");
        }
        
        const data = await response.json();
        setRegions(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
        setError(error instanceof Error ? error.message : "Failed to load regions");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && hasPermission("SITE_ADMIN")) {
      fetchRegions();
    }
  }, [status, router, hasPermission]);

  if (status === "loading" || loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Error</h2>
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/regions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Regions
            </Link>
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Region Statistics Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Manage and update statistics for all regions. The statistics are used on region 
                pages to display key metrics about startups, jobs, events, and more.
              </p>
            </CardContent>
          </Card>

          <AdminRefreshStats 
            regions={regions.map(region => ({ slug: region.slug, name: region.name }))} 
          />

          <Card>
            <CardHeader>
              <CardTitle>Current Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Region</th>
                      <th className="px-4 py-2 text-right">Startups</th>
                      <th className="px-4 py-2 text-right">Jobs</th>
                      <th className="px-4 py-2 text-right">Events</th>
                      <th className="px-4 py-2 text-right">Employees</th>
                      <th className="px-4 py-2 text-left">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regions.map((region) => (
                      <tr key={region.id} className="border-b">
                        <td className="px-4 py-2 font-medium">{region.name}</td>
                        <td className="px-4 py-2 text-right">{region.stats.startups}</td>
                        <td className="px-4 py-2 text-right">{region.stats.openJobs}</td>
                        <td className="px-4 py-2 text-right">{region.stats.upcomingEvents}</td>
                        <td className="px-4 py-2 text-right">{region.stats.employees}</td>
                        <td className="px-4 py-2 text-sm text-muted-foreground">
                          {new Date(region.stats.updatedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}