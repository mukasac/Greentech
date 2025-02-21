"use client";

import { Startup, GalleryImage } from "@/lib/types/startup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Globe, Users, Building2, Banknote } from "lucide-react";
import { jobs } from "@/lib/data/jobs";
import { getStartupBlogPosts } from "@/lib/data/blog-posts";
import { JobCard } from "@/components/jobs/job-card";
import { StartupProfileHeader } from "./startup-profile-header";
import { StartupGallery } from "./startup-gallery";
import { TeamSection } from "./team/team-section";
import { BlogSection } from "@/components/blog/blog-section";
import { usePermissions } from "@/hooks/usePermissions";

interface StartupProfileProps {
  startup: Startup;
}

export function StartupProfile({ startup }: StartupProfileProps) {
  const startupJobs = jobs.filter((job) => job.startupId === startup.id);
  const blogPosts = getStartupBlogPosts(startup.id);
  const { hasPermission } = usePermissions();

  return (
    <div>
      <StartupProfileHeader startup={startup} />

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <main>
            <div className="space-y-8">
              <section>
                <h2 className="mb-4 text-2xl font-semibold">About</h2>
                <p className="text-muted-foreground">{startup.description}</p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold">Team</h2>
                <TeamSection startup={startup} />
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold">Gallery</h2>
                {/* Ensuring gallery is always an array */}
                <StartupGallery images={startup.gallery} />
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold">Blog & Updates</h2>
                <BlogSection startupId={startup.id} posts={blogPosts} />
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold">Technology</h2>
                <div className="flex flex-wrap gap-2">
                  {startup.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </section>

              {startupJobs.length > 0 && (
                <section>
                  <h2 className="mb-4 text-2xl font-semibold">
                    Open Positions
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {startupJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </main>

          <aside className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Founded {startup.founded}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{startup.employees} employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{startup.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{startup.mainCategory.replace("-", " ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                    <span>Funding: {startup.funding}</span>
                  </div>
                </div>

                <div className="mt-6">
                  {hasPermission("STARTUP_VIEW") && (
                    <Button asChild className="w-full">
                      <a
                        href={startup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-4 text-lg font-semibold">
                  Sustainability Impact
                </h3>
                <p className="text-muted-foreground">
                  {startup.sustainability.impact}
                </p>
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-medium">SDG Goals</h4>
                  <div className="flex flex-wrap gap-2">
                    {startup.sustainability.sdgs.map((sdg: string) => (
                      <Badge key={sdg} variant="outline">
                        SDG {sdg}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}