"use client";

import { useState } from "react";
import { Startup } from "@/lib/types/startup";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StartupProfileHeader } from "./startup-profile-header";
import { usePermissions } from "@/hooks/usePermissions";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GalleryImage } from "@/lib/types/startup";
import { ClimateImpactDisplay } from "./profile/climate-impact-display";

interface StartupProfileProps {
  startup: Startup;
}

export function StartupProfile({ startup }: StartupProfileProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const { hasPermission } = usePermissions();

  // Helper function to format location
  const formatLocation = (location: { type: string; city?: string; country: string }) => {
    const parts = [];
    if (location.type) parts.push(location.type);
    if (location.city) parts.push(location.city);
    if (location.country) parts.push(location.country);
    return parts.join(" - ");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <StartupProfileHeader startup={startup} />
      
      <div className="w-full flex justify-center">
        <div className="py-4 sm:py-6 md:py-8 px-4 sm:px-6 w-full max-w-screen-xl">
          <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-[2fr_1fr]">
            <main>
              <div className="space-y-6 md:space-y-8">
                {/* Climate Impact Section */}
                <section>
                  <h2 className="mb-3 md:mb-4 text-xl md:text-2xl font-semibold">Climate Impact</h2>
                  {startup.climateImpacts && startup.climateImpacts.length > 0 ? (
                    <ClimateImpactDisplay climateImpacts={startup.climateImpacts} />
                  ) : (
                    <Card>
                      <CardContent className="p-4 md:p-6 text-center">
                        <p className="text-sm md:text-base text-muted-foreground">No climate impact data available.</p>
                      </CardContent>
                    </Card>
                  )}
                </section>

                {/* Team Section */}
                {startup.team && startup.team.length > 0 && (
                  <section>
                    <h2 className="mb-3 md:mb-4 text-xl md:text-2xl font-semibold">Team</h2>
                    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {startup.team.map((member) => (
                        <Card key={member.id} className="overflow-hidden">
                          <div className="aspect-square relative">
                            <Image
                              src={member.image || "/placeholder-avatar.png"}
                              alt={member.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                            />
                          </div>
                          <CardContent className="p-3 sm:p-4">
                            <h3 className="font-semibold text-base">{member.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">{member.role}</p>
                            {member.bio && (
                              <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-3">
                                {member.bio}
                              </p>
                            )}
                            <div className="mt-3 flex flex-wrap gap-2">
                              {member.linkedin && (
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs sm:text-sm" asChild>
                                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                    LinkedIn
                                  </a>
                                </Button>
                              )}
                              {member.twitter && (
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs sm:text-sm" asChild>
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
                    <h2 className="mb-3 md:mb-4 text-xl md:text-2xl font-semibold">Gallery</h2>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-3 md:grid-cols-4">
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
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          />
                          {image.caption && (
                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-2 sm:p-4 opacity-0 transition-opacity group-hover:opacity-100">
                              <p className="text-xs sm:text-sm text-white line-clamp-2">{image.caption}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Jobs Section */}
                {startup.jobs && startup.jobs.length > 0 && hasPermission("VIEW_JOBS") && (
                  <section>
                    <h2 className="mb-3 md:mb-4 text-xl md:text-2xl font-semibold">Open Positions</h2>
                    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2">
                      {startup.jobs.map((job) => (
                        <Card key={job.id}>
                          <CardContent className="p-4 md:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <h3 className="text-base md:text-lg font-semibold">{job.title}</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  {formatLocation(job.location)}
                                </p>
                              </div>
                            </div>
                            {hasPermission("APPLY_FOR_JOBS") && (
                              <Button className="mt-3 w-full sm:w-auto" size="sm" asChild>
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

            <aside className="space-y-4 md:space-y-6 order-first lg:order-last mb-6 lg:mb-0">
              <Card>
                <CardContent className="p-4 md:p-6">
                  {hasPermission("STARTUP_VIEW") && (
                    <Button className="w-full text-sm md:text-base" asChild>
                      <a
                        href={startup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </a>
                    </Button>
                  )}

                  <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
                    <h3 className="text-base md:text-lg font-semibold">Sustainability Impact</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {startup.sustainability?.impact || "Sustainability information not available."}
                    </p>
                    {startup.sustainability?.sdgs && startup.sustainability.sdgs.length > 0 && (
                      <div className="mt-3 md:mt-4">
                        <h4 className="mb-2 text-xs sm:text-sm font-medium">SDG Goals</h4>
                        <div className="flex flex-wrap gap-2">
                          {startup.sustainability.sdgs.map((sdg) => (
                            <Badge key={sdg} variant="outline" className="text-xs">
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
      </div>

      {/* Image Dialog */}
      <Dialog 
        open={selectedImage !== null} 
        onOpenChange={(open) => {
          if (!open) setSelectedImage(null);
        }}
      >
        <DialogContent className="max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-4 sm:mx-auto">
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
                <p className="mt-2 text-center text-xs sm:text-sm text-muted-foreground">
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