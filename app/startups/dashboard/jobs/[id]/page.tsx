"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import JobPostingForm from "@/components/jobs/forms/job-posting-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch job');
        }
        
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch job');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const handleSuccess = () => {
    setSuccess("Job updated successfully!");
    
    // Navigate back after success
    setTimeout(() => {
      router.push('/startups/dashboard/profile?tab=jobs');
    }, 2000);
  };

  const handleError = (message: string) => {
    setError(message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error && !job) {
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
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Job not found</AlertDescription>
        </Alert>
      </div>
    );
  }

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
        <CardHeader>
          <CardTitle>Edit Job</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <JobPostingForm
            startupId={job.startupId}
            onSuccess={handleSuccess}
            onError={handleError}
            initialData={{
              title: job.title,
              type: job.type,
              experienceLevel: job.experienceLevel,
              locationType: job.location.type,
              city: job.location.city || '',
              country: job.location.country,
              salaryMin: job.salary.min.toString(),
              salaryMax: job.salary.max.toString(),
              currency: job.salary.currency,
              description: job.description,
              requirements: job.requirements.join('\n'),
              responsibilities: job.responsibilities.join('\n'),
              skills: job.skills.join(', '),
              department: job.department,
            }}
            isEdit={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}