// components/jobs/jobs-dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Briefcase, MapPin, Calendar, Users, Edit, Eye } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  type: string;
  status: string;
  location: {
    type: string;
    city?: string;
    country: string;
  };
  department: string;
  postedAt: string;
  applicationCount: number;
  viewCount: number;
}

export function JobsDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { hasPermission } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete job');
      
      // Refresh jobs list
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Jobs</h2>
        {hasPermission("CREATE_JOBS") && (
          <Button asChild>
            <Link href="/startups/dashboard/jobs/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Job
            </Link>
          </Button>
        )}
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No Jobs Posted</p>
            <p className="text-muted-foreground">Get started by creating your first job posting</p>
            {hasPermission("CREATE_JOBS") && (
              <Button className="mt-4" asChild>
                <Link href="/startups/dashboard/jobs/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Job
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <Badge>{job.type}</Badge>
                      <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                        {job.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.department}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location.city || job.location.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(job.postedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{job.applicationCount} Applications</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{job.viewCount} Views</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/startups/dashboard/jobs/${job.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/startups/dashboard/jobs/${job.id}/applications`}>
                      Applications
                    </Link>
                  </Button>
                  {hasPermission("EDIT_JOBS") && (
                    <>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/startups/dashboard/jobs/${job.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(job.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}