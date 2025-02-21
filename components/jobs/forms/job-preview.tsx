"use client";

import { JobCard } from "@/components/jobs/job-card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Job } from "@/lib/types/job";
import { usePermissions } from "@/hooks/usePermissions";

interface JobPreviewProps {
  jobData: Partial<Job>;
}

export function JobPreview({ jobData }: JobPreviewProps) {
  const previewJob: Job = {
    id: "preview",
    startupId: "preview",
    title: jobData.title || "Job Title",
    type: jobData.type || "full-time",
    experienceLevel: jobData.experienceLevel || "mid",
    location: {
      type: jobData.location?.type || "hybrid",
      city: jobData.location?.city || "",
      country: jobData.location?.country || "",
    },
    salary: {
      min: Number(jobData.salary?.min) || 0,
      max: Number(jobData.salary?.max) || 0,
      currency: jobData.salary?.currency || "EUR",
    },
    description: jobData.description || "",
    requirements: jobData.requirements?.split("\n") || [],
    responsibilities: jobData.responsibilities?.split("\n") || [],
    skills: jobData.skills?.split(",").map((s) => s.trim()) || [],
    postedAt: new Date().toISOString(),
    department: jobData.department || "",
    applicationUrl: "#",
  };

  const { hasPermission } = usePermissions();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {hasPermission("VIEW_JOBS") && (
          <Button variant="outline" type="button">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <JobCard job={previewJob} />
      </DialogContent>
    </Dialog>
  );
}
