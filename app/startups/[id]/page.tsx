"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StartupProfileHeader } from "@/components/startups/startup-profile-header";
import { StartupTeam } from "@/components/startups/profile/startup-team";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobCard } from "@/components/jobs/job-card";
import { BlogCard } from "@/components/blog/blog-card";
import { StartupGallery } from "@/components/startups/startup-gallery";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Calendar, 
  Globe, 
  Users, 
  Building2, 
  Banknote, 
  Loader2, 
  Circle,
  TrendingUp
} from "lucide-react";
import { ClimateImpactDisplay } from "@/components/startups/profile/climate-impact-display";

export default function StartupProfilePage({ params }: { params: { id: string } }) {
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const response = await fetch(`/api/startups/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch startup");
        }
        const data = await response.json();
        setStartup(data);
      } catch (error) {
        console.error("Error fetching startup:", error);
        setError("Failed to load startup profile");
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold mb-2">Startup Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The startup you are looking for does not exist or has been removed.
            </p>
            <Button onClick={() => router.push("/startups")}>
              Back to Startups
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <StartupProfileHeader startup={startup} />
      
      <div className="container py-8">
        {/* Company Description */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">About {startup.name}</h2>
          <p className="text-muted-foreground">{startup.description}</p>
          
          {/* Quick Stats - Including stage information in the same grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Founded {startup.founded}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {startup.employees} employees
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              {startup.country}
            </div>
            
            {/* Stage information integrated into the grid */}
            {startup.startupStage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Circle className="h-4 w-4" />
                Stage: {startup.startupStage}
              </div>
            )}
            {startup.investmentStage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Banknote className="h-4 w-4" />
                Investment: {startup.investmentStage}
              </div>
            )}
            {startup.fundingNeeds && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Funding: {startup.fundingNeeds}
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Banknote className="h-4 w-4" />
              Funding: {startup.funding}
            </div>
            
            <a
              href={startup.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Globe className="h-4 w-4" />
              Visit Website
            </a>
          </div>
        </section>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none px-0 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            {startup.blogPosts && startup.blogPosts.length > 0 && (
              <TabsTrigger value="updates">Updates</TabsTrigger>
            )}
            {startup.jobs && startup.jobs.length > 0 && (
              <TabsTrigger value="jobs">Open Positions</TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {/* Climate Impact Section */}
            <div className="mb-6">
              {startup.climateImpacts && startup.climateImpacts.length > 0 ? (
                <ClimateImpactDisplay climateImpacts={startup.climateImpacts} />
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No climate impact data available.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Gallery Section */}
            {startup.gallery && startup.gallery.length > 0 && (
              <section className="mt-6">
                <h2 className="mb-4 text-2xl font-semibold">Gallery</h2>
                <StartupGallery images={startup.gallery} />
              </section>
            )}
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <StartupTeam startup={startup} />
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates">
            {startup.blogPosts && startup.blogPosts.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2">
                {startup.blogPosts.map((post: any) => (
                  <BlogCard key={post.id} post={post} startupSlug={startup.id} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            {startup.jobs && startup.jobs.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2">
                {startup.jobs.map((job: any) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}