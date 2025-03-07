"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import JobPostingForm from "@/components/jobs/forms/job-posting-form";
import { DashboardSidebar } from "@/components/startups/dashboard/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Startup } from "@/lib/types/startup";
import { JobPreview } from "@/components/jobs/forms/job-preview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function CreateJobPage() {
  const router = useRouter();
  const params = useParams();
  const startupId = params.id as string;
  const { data: session, status } = useSession();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [jobData, setJobData] = useState<any>({});

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }

    // Fetch startup details
    const fetchStartup = async () => {
      try {
        const response = await fetch(`/api/startups/${startupId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch startup details");
        }
        const data = await response.json();
        setStartup(data);
      } catch (error) {
        console.error("Error fetching startup:", error);
        setError("Failed to load startup details");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && startupId) {
      fetchStartup();
    }
  }, [status, router, startupId]);

  // Handlers for JobPostingForm
  const handleSuccess = () => {
    setSuccess("Job posted successfully!");
    // Redirect after a short delay
    setTimeout(() => {
      router.push(`/startups/${startupId}/jobs`);
    }, 2000);
  };
  
  const handleError = (message: string) => {
    setError(message);
  };

  // Setup an event listener for the custom form submission event
  useEffect(() => {
    const handleFormSubmission = async (event: any) => {
      if (!event.detail) return;
      
      setError(null);
      setJobData(event.detail);
      
      // This part is now handled by the JobPostingForm component itself
    };

    window.addEventListener('jobFormSubmit', handleFormSubmission);
    return () => window.removeEventListener('jobFormSubmit', handleFormSubmission);
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="container py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="mb-2 text-xl font-semibold">Startup Not Found</h2>
            <p className="text-muted-foreground">
              The startup you are trying to create a job for does not exist or you do not have access to it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardSidebar />
        
        <main>
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Post a New Job</h1>
            <p className="text-muted-foreground">
              Find talented individuals passionate about sustainable technology
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Creating job for: <span className="font-medium">{startup.name}</span>
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

          <JobPostingForm 
            startupId={startupId}
            onSuccess={handleSuccess}
            onError={handleError}
          />
          
          {Object.keys(jobData).length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold">Preview</h2>
              <JobPreview jobData={jobData} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}