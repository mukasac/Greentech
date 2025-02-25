"use client";

import React from 'react';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSidebar } from "@/components/startups/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Startup, TeamMember } from "@/lib/types/startup";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function TeamDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }

    // Fetch user's startups
    const fetchStartups = async () => {
      try {
        const response = await fetch("/api/startups/user");
        if (!response.ok) {
          throw new Error("Failed to fetch startups");
        }
        const data = await response.json();
        setStartups(data);
        if (data.length > 0) {
          setSelectedStartup(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching startups:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchStartups();
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="container py-8">
        <p>Loading team dashboard...</p>
      </div>
    );
  }

  const currentStartup = startups.find(s => s.id === selectedStartup);
  const teamMembers = currentStartup?.team || [];

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardSidebar />
        
        <main>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Team Management</h1>
              <p className="text-muted-foreground">
                Manage your startup team members
              </p>
            </div>
            
            {startups.length > 0 && (
              <Button asChild>
                <Link href={`/startups/${selectedStartup}/team/add`}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Team Member
                </Link>
              </Button>
            )}
          </div>

          {startups.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <UserPlus className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="mb-2 text-xl font-semibold">No Startups Yet</h2>
                <p className="mb-6 text-center text-muted-foreground">
                  Create a startup before adding team members.
                </p>
                <Button asChild size="lg">
                  <Link href="/startups/create">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Your First Startup
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {startups.length > 1 && (
                <div className="mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <label className="mb-2 block text-sm font-medium">
                        Select Startup
                      </label>
                      <select
                        className="w-full rounded-md border p-2"
                        value={selectedStartup || ''}
                        onChange={(e) => setSelectedStartup(e.target.value)}
                      >
                        {startups.map((startup) => (
                          <option key={startup.id} value={startup.id}>
                            {startup.name}
                          </option>
                        ))}
                      </select>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Quick Access Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Access</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    {startups.map((startup) => (
                      <Link
                        key={startup.id}
                        href={`/startups/${startup.id}/team`}
                        className="group rounded-lg border p-4 transition-colors hover:bg-accent"
                      >
                        <Users className="mb-2 h-6 w-6 text-muted-foreground" />
                        <h4 className="font-medium">{startup.name} Team</h4>
                        <p className="text-sm text-muted-foreground">
                          {startup?.team?.length || 0} team members
                        </p>
                      </Link>
                    ))}
                  </CardContent>
                </Card>

                {teamMembers.length === 0 ? (
                  <Card className="col-span-2">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <div className="mb-4 rounded-full bg-muted p-6">
                        <UserPlus className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h2 className="mb-2 text-xl font-semibold">No Team Members Yet</h2>
                      <p className="mb-6 text-center text-muted-foreground">
                        Add your first team member to showcase your startup talent.
                      </p>
                      <Button asChild>
                        <Link href={`/startups/${selectedStartup}/team/add`}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add First Team Member
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  teamMembers.map((member: TeamMember) => (
                    <Card key={member.id} className="overflow-hidden">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={member.image || "/placeholder-avatar.png"}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        
                        {member.bio && (
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
                        )}
                        
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/startups/${selectedStartup}/team/${member.id}/edit`}>
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}