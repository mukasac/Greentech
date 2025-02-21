"use client"
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamSection } from "@/components/startups/sections/TeamSection";
import { JobsSection } from "@/components/startups/sections/JobsSection";
import { GallerySection } from "@/components/startups/sections/GallerySection";
import { AnalyticsSection } from "@/components/startups/sections/AnalyticsSection";
import { Loader2 } from "lucide-react";

export default function StartupProfilePage() {
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!startup) return null;

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Startup Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="team" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="team">
              <TeamSection startup={startup} />
            </TabsContent>

            <TabsContent value="jobs">
              <JobsSection startup={startup} />
            </TabsContent>

            <TabsContent value="gallery">
              <GallerySection startup={startup} />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsSection startup={startup} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}