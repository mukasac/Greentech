"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamSection } from "@/components/startups/sections/TeamSection";
import { JobsDashboard } from "@/components/jobs/jobs-dashboard";
import { BlogsDashboard } from "@/components/blog/blogs-dashboard";
import { GallerySection } from "@/components/startups/sections/GallerySection";
import { AnalyticsSection } from "@/components/startups/sections/AnalyticsSection";
import { ClimateImpactSection } from "@/components/startups/sections/ClimateImpactSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Settings2, ShieldAlert, BarChart } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";

export default function StartupProfilePage() {
  // Get startup ID from URL if present (for redirects after claiming)
  const searchParams = useSearchParams();
  const startupIdFromUrl = searchParams.get('startupId');
  
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { hasPermission } = usePermissions();

  useEffect(() => {
    const fetchStartupData = async () => {
      try {
        // If we have a specific startup ID from the URL, fetch that one
        const endpoint = startupIdFromUrl 
          ? `/api/startups/${startupIdFromUrl}` 
          : '/api/startups/current';
          
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch startup data');
        const data = await response.json();
        setStartup(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStartupData();
  }, [startupIdFromUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!startup) return null;

  return (
    <div className="container py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{startup.name}</CardTitle>
            <CardDescription>
              Dashboard Overview
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/startups/dashboard/settings`}>
              <Settings2 className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="climate" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="climate">Climate Impact</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="climate">
                {hasPermission("ADMIN_ACCESS") || hasPermission("STARTUP_VIEW") ? (
                  <ClimateImpactSection startup={startup} />
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <ShieldAlert className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Access Required</h3>
                      <p className="text-sm text-muted-foreground">
                        You do not have permission to view climate impact data.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="team">
                {hasPermission("VIEW_TEAM_MEMBERS") && (
                  <TeamSection startup={startup} />
                )}
              </TabsContent>

              <TabsContent value="jobs">
                {hasPermission("VIEW_JOBS") && (
                  <JobsDashboard />
                )}
              </TabsContent>

              <TabsContent value="blog">
                {hasPermission("VIEW_BLOG") && (
                  <BlogsDashboard />
                )}
              </TabsContent>

              <TabsContent value="gallery">
                {hasPermission("VIEW_GALLERY") && (
                  <GallerySection startup={startup} />
                )}
              </TabsContent>

              <TabsContent value="analytics">
                {(hasPermission("ADMIN_ACCESS") || hasPermission("VIEW_STARTUP_DASHBOARD")) ? (
                  <AnalyticsSection startup={startup} />
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Access Required</h3>
                      <p className="text-sm text-muted-foreground">
                        You dont have permission to view analytics data.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}