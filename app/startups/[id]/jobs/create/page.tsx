"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import  JobPostingForm  from "@/components/jobs/forms/job-posting-form";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Create a server action URL that includes the startup ID
  const getActionUrl = () => `/api/jobs/create?startupId=${startupId}`;

  // Setup an event listener for the custom form submission event
  useEffect(() => {
    const handleFormSubmission = async (event: any) => {
      if (!event.detail) return;
      
      setIsSubmitting(true);
      setError(null);
      setJobData(event.detail);

      try {
        // Format the data
        const requirements = event.detail.requirements
          .split('\n')
          .filter((req: string) => req.trim().length > 0);
        
        const responsibilities = event.detail.responsibilities
          .split('\n')
          .filter((resp: string) => resp.trim().length > 0);
        
        const skills = event.detail.skills
          .split(',')
          .map((skill: string) => skill.trim())
          .filter((skill: string) => skill.length > 0);

        const jobData = {
          title: event.detail.title,
          type: event.detail.type,
          experienceLevel: event.detail.experienceLevel,
          location: {
            type: event.detail.locationType,
            city: event.detail.city || null,
            country: event.detail.country,
          },
          salary: {
            min: event.detail.salaryMin,
            max: event.detail.salaryMax,
            currency: event.detail.currency,
          },
          description: event.detail.description,
          requirements,
          responsibilities,
          skills,
          department: event.detail.department,
          startup: {
            id: startupId
          },
          applicationUrl: `${window.location.origin}/jobs/apply/${startupId}/${Date.now()}`,
          status: "active",
        };

        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to create job posting");
        }

        setSuccess("Job posted successfully!");
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push(`/startups/${startupId}/jobs`);
        }, 2000);
      } catch (error) {
        console.error("Job posting error:", error);
        setError(error instanceof Error ? error.message : "Failed to create job posting");
      } finally {
        setIsSubmitting(false);
      }
    };

    window.addEventListener('jobFormSubmit', handleFormSubmission);
    return () => window.removeEventListener('jobFormSubmit', handleFormSubmission);
  }, [startupId, router]);

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
              The startup you are trying to create a job for does not exist or you dont have access to it.
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
            action={getActionUrl()}
            isSubmitting={isSubmitting}
            startupId={startupId}
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