"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import JobPostingForm from "@/components/jobs/forms/job-posting-form";
import { DashboardSidebar } from "@/components/startups/dashboard/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Startup } from "@/lib/types/startup";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function CreateJobPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [selectedStartupId, setSelectedStartupId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await fetch("/api/startups/user");
        if (!response.ok) {
          throw new Error("Failed to fetch startups");
        }
        const data = await response.json();
        setStartups(data);
        if (data.length > 0) {
          setSelectedStartupId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching startups:", error);
        setError("Failed to load your startups");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchStartups();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="container py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth");
    return null;
  }

  // Show message if user has no startups
  if (startups.length === 0) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="mb-2 text-xl font-semibold">No Startups Found</h2>
            <p className="text-muted-foreground mb-6">
              You need to create a startup before posting jobs.
            </p>
            <button
              className="text-primary hover:underline"
              onClick={() => router.push("/startups/create")}
            >
              Create a Startup
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSuccess = () => {
    setSuccess("Job posted successfully!");
    setTimeout(() => {
      // Redirect to profile page with jobs tab selected
      router.push("/startups/dashboard/profile?tab=jobs");
    }, 2000);
  };

  const handleError = (message: string) => {
    setError(message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentStartup = startups.find(s => s.id === selectedStartupId);

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardSidebar />
        
        <main>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Post a New Job</h1>
            <p className="text-muted-foreground">
              Create a new job posting for your startup
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

          {startups.length > 1 && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label>Select Startup</Label>
                  <Select 
                    value={selectedStartupId} 
                    onValueChange={setSelectedStartupId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a startup" />
                    </SelectTrigger>
                    <SelectContent>
                      {startups.map((startup) => (
                        <SelectItem key={startup.id} value={startup.id}>
                          {startup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedStartupId && (
            <Card>
              <CardContent className="pt-6">
                <JobPostingForm
                  startupId={selectedStartupId}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}