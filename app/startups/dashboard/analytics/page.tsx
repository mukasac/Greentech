"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, PlusCircle } from "lucide-react";
import Link from "next/link";
import { StartupAnalyticsDashboard } from "@/components/startups/analytics/startup-analytics-dashboard";
import { Startup } from "@/lib/types/startup";

export default function AnalyticsDashboardPage() {
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
        <div className="flex items-center justify-center">
          <div className="text-muted-foreground">Loading analytics dashboard...</div>
        </div>
      </div>
    );
  }

  if (startups.length === 0) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 rounded-full bg-muted p-6">
              <LineChart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">No Startups Yet</h2>
            <p className="mb-6 text-center text-muted-foreground">
              Create a startup to view analytics data.
            </p>
            <Button asChild size="lg">
              <Link href="/startups/create">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Your First Startup
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <StartupAnalyticsDashboard startups={startups} />;
}