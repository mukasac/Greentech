import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, MapPin, Calendar } from "lucide-react";
import Link from "next/link";

interface JobsSectionProps {
  startup: any; // Replace with proper type
}

export function JobsSection({ startup }: JobsSectionProps) {
  if (!startup?.jobs?.length) {
    return (
      <Card className="mt-6">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 rounded-full bg-muted p-6">
            <Briefcase className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">No Job Postings Yet</h2>
          <p className="mb-6 text-center text-muted-foreground">
            Create your first job posting to attract talent.
          </p>
          <Button asChild>
            <Link href={`/startups/${startup.id}/jobs/create`}>
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Postings</h2>
        <Button asChild>
          <Link href={`/startups/${startup.id}/jobs/create`}>
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {startup.jobs.map((job: any) => (
          <Card key={job.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    <Badge>{job.type}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location.city}, {job.location.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/startups/${startup.id}/jobs/${job.id}/applications`}>
                      View Applications
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/startups/${startup.id}/jobs/${job.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{job.description}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}