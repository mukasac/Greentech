// app/startups/dashboard/profile/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
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

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Settings2 } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";

export default function StartupProfilePage() {
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { hasPermission } = usePermissions();

  useEffect(() => {
    const fetchStartupData = async () => {
      try {
        const response = await fetch('/api/startups/current');
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
  }, []);

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
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              
            </TabsList>

            

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
              {hasPermission("VIEW_ANALYTICS") && (
                <AnalyticsSection startup={startup} />
              )}
            </TabsContent>

           
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}