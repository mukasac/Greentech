"use client";

import { useState } from "react";
import { Startup } from "@/lib/types/startup";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Globe, Users, Building2, Banknote } from "lucide-react";
import { StartupProfileHeader } from "./startup-profile-header";
import { usePermissions } from "@/hooks/usePermissions";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

interface StartupProfileProps {
  startup: Startup;
}

export function StartupProfile({ startup }: StartupProfileProps) {
  const { hasPermission } = usePermissions();
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Helper function to format location
  const formatLocation = (location: { type: string; city?: string; country: string }) => {
    const parts = [];
    if (location.type) parts.push(location.type);
    if (location.city) parts.push(location.city);
    if (location.country) parts.push(location.country);
    return parts.join(" - ");
  };

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
              {startup.team && startup.team.length > 0 && (
                <section>
                  <h2 className="mb-4 text-2xl font-semibold">Team</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {startup.team.map((member) => (
                      <Card key={member.id} className="overflow-hidden">
                        <div className="aspect-square relative">
                          <Image
                            src={member.image || "/placeholder-avatar.png"}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          {member.bio && (
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                              {member.bio}
                            </p>
                          )}
                          <div className="mt-4 flex gap-2">
                            {member.linkedin && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                  LinkedIn
                                </a>
                              </Button>
                            )}
                            {member.twitter && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                                  Twitter
                                </a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Gallery Section */}
              {startup.gallery && startup.gallery.length > 0 && (
                <section>
                  <h2 className="mb-4 text-2xl font-semibold">Gallery</h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {startup.gallery.map((image) => (
                      <div 
                        key={image.id} 
                        className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      >
                        <Image
                          src={image.url}
                          alt={image.alt || 'Gallery image'}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {image.caption && (
                          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                            <p className="text-sm text-white">{image.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Technology Section */}
              <section>
                <h2 className="mb-4 text-2xl font-semibold">Technology & Focus Areas</h2>
                <div className="flex flex-wrap gap-2">
                  {startup.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </section>

              {/* Jobs Section */}
              {startup.jobs && startup.jobs.length > 0 && hasPermission("VIEW_JOBS") && (
                <section>
                  <h2 className="mb-4 text-2xl font-semibold">Open Positions</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {startup.jobs.map((job) => (
                      <Card key={job.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{job.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {formatLocation(job.location)}
                              </p>
                            </div>
                          </div>
                          {hasPermission("APPLY_FOR_JOBS") && (
                            <Button className="mt-4" asChild>
                              <Link href={`/jobs/${job.id}`}>View Job</Link>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </main>

          <aside className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                {hasPermission("STARTUP_VIEW") && (
                  <Button className="w-full" asChild>
                    <a
                      href={startup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>
                  </Button>
                )}

                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Sustainability Impact</h3>
                  <p className="text-muted-foreground">
                    {startup.sustainability?.impact || "Sustainability information not available."}
                  </p>
                  {startup.sustainability?.sdgs && startup.sustainability.sdgs.length > 0 && (
                    <div className="mt-4">
                      <h4 className="mb-2 text-sm font-medium">SDG Goals</h4>
                      <div className="flex flex-wrap gap-2">
                        {startup.sustainability.sdgs.map((sdg) => (
                          <Badge key={sdg} variant="outline">
                            SDG {sdg}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Image Dialog */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <>
              <div className="aspect-video relative">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.alt || 'Gallery image'}
                  fill
                  className="object-contain"
                />
              </div>
              {selectedImage.caption && (
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  {selectedImage.caption}
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}