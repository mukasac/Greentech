"use client";

import { Job } from "@/lib/types/job";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Building2, Briefcase } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const { hasPermission } = usePermissions();

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-sm text-muted-foreground">{job.department}</p>
          </div>
          <Badge variant={job.type === "full-time" ? "default" : "secondary"}>
            {job.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            {job.experienceLevel} level
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {job.location.city}, {job.location.type}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            {job.salary.min.toLocaleString()} -{" "}
            {job.salary.max.toLocaleString()} {job.salary.currency}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Posted {new Date(job.postedAt).toLocaleDateString()}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      {hasPermission("APPLY_FOR_JOBS") && (
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={job.applicationUrl} target="_blank">
              Apply Now
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
