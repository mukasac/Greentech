"use client";

import { Startup } from "@/lib/types/startup";
import { StartupCard } from "@/components/startups/startup-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";

interface RegionStartupsProps {
  region: string;
  startups: Startup[];
}

export function RegionStartups({ region, startups }: RegionStartupsProps) {
  const { hasPermission } = usePermissions();

  if (!startups || startups.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No startups found in this region.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {startups.map((startup) => (
          <StartupCard key={startup.id} startup={startup} />
        ))}
      </div>
      
      <div className="text-center">
        {hasPermission('STARTUP_VIEW') && (
        <Button variant="outline" asChild>
          <Link href={`/startups?region=${region}`}>
            View All Startups
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        )}
      </div>
    </div>
  );
}