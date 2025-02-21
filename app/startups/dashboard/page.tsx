// app/startups/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSidebar } from "@/components/startups/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, BarChart, Building2, Users, Briefcase, Image } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Startup } from "@/lib/types/startup";

export default function StartupDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

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
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardSidebar />
        
        <main>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Startup Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your green tech startup profile and activities
              </p>
            </div>
            <Button asChild>
              <Link href="/startups/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Startup
              </Link>
            </Button>
          </div>

          {startups.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
                <h2 className="mb-2 text-xl font-semibold">No Startups Yet</h2>
                <p className="mb-6 text-center text-muted-foreground">
                  You have not created any startup profiles yet. Start by creating your first green tech startup.
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
            <div className="grid gap-6">
              {startups.map((startup) => (
                <Card key={startup.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 overflow-hidden rounded-lg border bg-white p-2">
                          <img
                            src={startup.logo || "/placeholder-logo.png"}
                            alt={startup.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{startup.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Created on {new Date(startup.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/startups/${startup.id}`}>
                            View Profile
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/startups/${startup.id}/edit`}>
                            Edit Profile
                          </Link>
                        </Button>
                      </div>
                    </div>

                    
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}