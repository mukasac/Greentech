// app/startups/[id]/page.tsx
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
import { Calendar, Globe, Users, Building2, Banknote } from "lucide-react";
import { Loader2 } from "lucide-react";

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
            <p className="text-muted-foreground mb-4">The startup you are looking for does not exist or has been removed.</p>
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
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <main>
            <div className="space-y-8">
              {/* Company Overview */}
              <section>
                <h2 className="mb-4 text-2xl font-semibold">About {startup.name}</h2>
                <p className="text-muted-foreground">{startup.description}</p>
                
                {/* Quick Stats */}
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {startup.mainCategory.replace("-", " ")}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Banknote className="h-4 w-4" />
                    Funding: {startup.funding}
                  </div>
                </div>
              </section>

              {/* Team Section */}
              <section>
                <h2 className="mb-4 text-2xl font-semibold">Team</h2>
                <StartupTeam startup={startup} />
              </section>

              {/* Gallery Section */}
              {startup.gallery && startup.gallery.length > 0 && (
                <section>
                  <h2 className="mb-4 text-2xl font-semibold">Gallery</h2>
                  <StartupGallery images={startup.gallery} />
                </section>
              )}

              {/* Blog Posts Section */}
              {startup.blogPosts && startup.blogPosts.length > 0 && (
                <section>
                  <h2 className="mb-4 text-2xl font-semibold">Latest Updates</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {startup.blogPosts.map((post: any) => (
                      <BlogCard key={post.id} post={post} startupSlug={startup.id} />
                    ))}
                  </div>
                </section>
              )}

              {/* Technology Section */}
              <section>
                <h2 className="mb-4 text-2xl font-semibold">Technology & Focus Areas</h2>
                <div className="flex flex-wrap gap-2">
                  {startup.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </section>

              {/* Job Listings Section */}
              {startup.jobs && startup.jobs.length > 0 && (
                <section>
                  <h2 className="mb-4 text-2xl font-semibold">
                    Open Positions
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {startup.jobs.map((job: any) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </main>

          <aside className="space-y-6">
            {/* Quick Links & Website Button */}
            <Card>
              <CardContent className="pt-6">
                <Button asChild className="w-full">
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Sustainability Impact */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-4 text-lg font-semibold">
                  Sustainability Impact
                </h3>
                <p className="text-muted-foreground">
                  {startup.sustainability?.impact || "Sustainability information not available."}
                </p>
                {startup.sustainability?.sdgs && startup.sustainability.sdgs.length > 0 && (
                  <div className="mt-4">
                    <h4 className="mb-2 text-sm font-medium">SDG Goals</h4>
                    <div className="flex flex-wrap gap-2">
                      {startup.sustainability.sdgs.map((sdg: string | number) => (
                        <Badge key={sdg} variant="outline">
                          SDG {sdg}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}