"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { hasPermission } = usePermissions();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch job');
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch job');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete job');
      
      router.push('/startups/dashboard/profile?tab=jobs');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
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

  if (!job) return null;

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/startups/dashboard/profile?tab=jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{job.title}</CardTitle>
          </div>
          {hasPermission("EDIT_JOBS") && (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/startups/dashboard/jobs/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Job
                </Link>
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Job
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {/* Job Details */}
          <div className="space-y-6">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="mt-2 text-muted-foreground">{job.description}</p>
            </div>

            <div>
              <h3 className="font-medium">Requirements</h3>
              <ul className="mt-2 list-disc pl-4 text-muted-foreground">
                {job.requirements.map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Responsibilities</h3>
              <ul className="mt-2 list-disc pl-4 text-muted-foreground">
                {job.responsibilities.map((resp: string, index: number) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Skills</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {job.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium">Location</h3>
                <p className="mt-2 text-muted-foreground">
                  {job.location.type}
                  {job.location.city && ` - ${job.location.city}`}
                  {job.location.country && `, ${job.location.country}`}
                </p>
              </div>

              <div>
                <h3 className="font-medium">Salary Range</h3>
                <p className="mt-2 text-muted-foreground">
                  {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}