"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import JobPostingForm from "@/components/jobs/forms/job-posting-form";
import { DashboardSidebar } from "@/components/startups/dashboard/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface JobEditFormProps {
  jobId: string;
}

export default function JobEditForm({ jobId }: JobEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState<any>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${jobId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch job data");
        }
        
        const data = await response.json();
        setJobData({
          id: data.id,
          title: data.title,
          type: data.type,
          experienceLevel: data.experienceLevel,
          locationType: data.location.type,
          city: data.location.city || "",
          country: data.location.country || "",
          salaryMin: data.salary?.min || 0,
          salaryMax: data.salary?.max || 0,
          currency: data.salary?.currency || "EUR",
          description: data.description,
          requirements: data.requirements.join('\n'),
          responsibilities: data.responsibilities.join('\n'),
          skills: data.skills.join(', '),
          department: data.department,
          startupId: data.startupId
        });
      } catch (error) {
        console.error("Error fetching job:", error);
        setError("Failed to load job data");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleSuccess = () => {
    setSuccess("Job updated successfully!");
    setTimeout(() => {
      router.push("/startups/dashboard/profile?tab=jobs");
    }, 2000);
  };

  const handleError = (message: string) => {
    setError(message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <DashboardSidebar />
          <main className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading job data...</span>
          </main>
        </div>
      </div>
    );
  }

  if (error && !jobData) {
    return (
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <DashboardSidebar />
          <main>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4 flex justify-center">
              <Button asChild>
                <Link href="/startups/dashboard/jobs">Return to Jobs</Link>
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardSidebar />
        
        <main>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Edit Job</h1>
            <p className="text-muted-foreground">
              Update job details
            </p>
          </div>

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

          <Card>
            <CardContent className="pt-6">
              {jobData && (
                <JobPostingForm
                  startupId={jobData.startupId}
                  onSuccess={handleSuccess}
                  onError={handleError}
                  initialData={jobData}
                  isEditing={true}
                />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}