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
  const [showFullDescription, setShowFullDescription] = useState(false);
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
            <p className="text-muted-foreground mb-4 text-center">
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
      
      <div className="container py-6 md:py-8 px-4 md:px-6 mx-auto">
        {/* Company Description */}
        <section className="mb-6 md:mb-8">
          <h2 className="mb-3 md:mb-4 text-xl md:text-2xl font-semibold">About </h2>
          {startup.description && (
            <div className="text-muted-foreground text-sm md:text-base">
              {startup.description.split(" ").length > 40 ? (
                <p>
                  {showFullDescription 
                    ? startup.description 
                    : `${startup.description.split(" ").slice(0, 40).join(" ")}...`}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary ml-1 inline-flex align-baseline"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? "Show Less" : "Read More"}
                  </Button>
                </p>
              ) : (
                <p>{startup.description}</p>
              )}
            </div>
          )}
          
          {/* Quick Stats - Grid layout with 3 items per row on mobile */}
          <div className="mt-4 md:mt-6 grid grid-cols-3 gap-y-3 gap-x-2 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="truncate">Founded {startup.founded}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm text-muted-foreground">
              <Users className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="truncate">{startup.employees} employees</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm text-muted-foreground">
              <Globe className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="truncate">{startup.country}</span>
            </div>
            
            {/* Stage information integrated into the grid */}
            {startup.startupStage && (
              <div className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm text-muted-foreground">
                <Circle className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span className="truncate">Stage: {startup.startupStage}</span>
              </div>
            )}
            {startup.investmentStage && (
              <div className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm text-muted-foreground">
                <Banknote className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span className="truncate">Investment: {startup.investmentStage}</span>
              </div>
            )}
            {startup.fundingNeeds && (
              <div className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm text-muted-foreground">
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span className="truncate">Funding: {startup.fundingNeeds}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm text-muted-foreground">
              <Banknote className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="truncate">Funding: {startup.funding}</span>
            </div>
            
            <a
              href={startup.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm text-primary hover:underline"
            >
              <Globe className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="truncate">Visit Website</span>
            </a>
          </div>
        </section>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none px-0 mb-4 md:mb-6 overflow-x-auto">
            <TabsTrigger value="overview" className="text-sm md:text-base">Overview</TabsTrigger>
            <TabsTrigger value="team" className="text-sm md:text-base">Team</TabsTrigger>
            {startup.blogPosts && startup.blogPosts.length > 0 && (
              <TabsTrigger value="updates" className="text-sm md:text-base">Updates</TabsTrigger>
            )}
            {startup.jobs && startup.jobs.length > 0 && (
              <TabsTrigger value="jobs" className="text-sm md:text-base">Open Positions</TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab - Centered content for PC screens */}
          <TabsContent value="overview">
            <div className="md:flex md:flex-col md:items-center">
              {/* Climate Impact Section */}
              <div className="mb-4 md:mb-6 md:max-w-5xl lg:max-w-6xl w-full">
                {startup.climateImpacts && startup.climateImpacts.length > 0 ? (
                  <ClimateImpactDisplay climateImpacts={startup.climateImpacts} />
                ) : (
                  <Card>
                    <CardContent className="p-4 md:p-6 text-center">
                      <p className="text-muted-foreground text-sm md:text-base">No climate impact data available.</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Gallery Section */}
              {startup.gallery && startup.gallery.length > 0 && (
                <section className="mt-4 md:mt-6 md:max-w-5xl lg:max-w-6xl w-full">
                  <h2 className="mb-3 md:mb-4 text-xl md:text-2xl font-semibold">Gallery</h2>
                  <StartupGallery images={startup.gallery} />
                </section>
              )}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <StartupTeam startup={startup} />
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates">
            {startup.blogPosts && startup.blogPosts.length > 0 && (
              <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
                {startup.blogPosts.map((post: any) => (
                  <BlogCard key={post.id} post={post} startupSlug={startup.id} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            {startup.jobs && startup.jobs.length > 0 && (
              <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
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