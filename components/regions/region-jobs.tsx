"use client";

import { Job } from "@/lib/types/job";
import { JobCard } from "@/components/jobs/job-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";

interface RegionJobsProps {
  region: string;
  jobs: Job[];
}

export function RegionJobs({ region, jobs }: RegionJobsProps) {
  const { hasPermission } = usePermissions();

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No open positions in this region.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      <div className="text-center">
        {hasPermission('VIEW_JOBS') && (
          <Button variant="outline" asChild>
            <Link href={`/jobs?region=${region}`}>
              View All Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}