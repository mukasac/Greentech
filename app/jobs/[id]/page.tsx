"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Banknote, 
  Clock, 
  Loader2, 
  AlertCircle,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { Job } from "@/lib/types/job";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applied = searchParams.get('applied');
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching job with ID:", params.id);
      const response = await fetch(`/api/jobs/${params.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Job not found");
        }
        throw new Error("Failed to fetch job");
      }
      
      const data = await response.json();
      console.log("Job data fetched:", data);
      setJob(data);
    } catch (error) {
      console.error("Error fetching job:", error);
      setError(error instanceof Error ? error.message : "Failed to load job");
    } finally {
      setLoading(false);
    }
  }, [params.id]);
  
  useEffect(() => {
    if (params.id) {
      fetchJob();
    }
  }, [params.id, fetchJob]);

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Job not found. The job listing may have been removed or expired."}
          </AlertDescription>
        </Alert>
        
        <div className="mt-6 text-center">
          <Button asChild>
            <Link href="/jobs">View All Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  // At this point 'job' is definitely not null, so we can safely use it
  
  // Format the job posting date
  const postedDate = job.postedAt instanceof Date
    ? job.postedAt
    : new Date(job.postedAt);
    
  const formattedPostedDate = format(postedDate, 'MMMM d, yyyy');
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
  
  // Calculate days until expiry if expiresAt exists
  let daysRemaining = null;
  if (job.expiresAt) {
    const expiryDate = job.expiresAt instanceof Date
      ? job.expiresAt
      : new Date(job.expiresAt);
    
    const diffTime = expiryDate.getTime() - new Date().getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  // Format location
  const formatLocation = () => {
    if (!job.location) return "N/A";
    
    const { type, city, country } = job.location;
    
    if (type === "remote") {
      return `Remote${country ? ` (${country})` : ''}`;
    }
    
    if (city && country) {
      return `${city}, ${country}`;
    }
    
    return country || 'Unknown location';
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
      </div>
      
      {applied && (
        <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Application Submitted</AlertTitle>
          <AlertDescription>
            Your application has been successfully submitted. The hiring team will review it shortly.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <main>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary">{job.type.replace('-', ' ')}</Badge>
                <Badge variant="outline">{job.experienceLevel}</Badge>
                {job.location?.type && (
                  <Badge variant="outline">{job.location.type}</Badge>
                )}
              </div>
              
              <CardTitle className="text-2xl sm:text-3xl">{job.title}</CardTitle>
              
              <div className="flex items-center text-muted-foreground mt-1">
                <Building2 className="h-4 w-4 mr-1" />
                <span>{job.startup?.name || "Unknown Company"}</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="whitespace-pre-line">{job.description}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Requirements</h2>
                <ul className="list-disc pl-6 space-y-1">
                  {job.requirements.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Responsibilities</h2>
                <ul className="list-disc pl-6 space-y-1">
                  {job.responsibilities.map((resp: string, index: number) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill: string, index: number) => (
                    <Badge key={index}>{skill}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button className="w-full" size="lg" asChild>
                  <Link href={`/jobs/${params.id}/apply`}>
                    Apply for this position
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        
        <aside>
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p>{formatLocation()}</p>
                  <p className="text-sm text-muted-foreground">{job.location?.type} position</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Department</h3>
                  <p>{job.department}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Banknote className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Salary</h3>
                  {job.salary ? (
                    <p>
                      {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                    </p>
                  ) : (
                    <p>Competitive</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Posted</h3>
                  <p>{formattedPostedDate}</p>
                  <p className="text-sm text-muted-foreground">{timeAgo}</p>
                </div>
              </div>
              
              {daysRemaining !== null && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Application Deadline</h3>
                    <p>
                      {daysRemaining > 0 
                        ? `${daysRemaining} days remaining` 
                        : "Application deadline has passed"}
                    </p>
                  </div>
                </div>
              )}
              
              {job.startup && (
                <div className="pt-4 mt-4 border-t">
                  <h3 className="font-medium mb-2">About the Company</h3>
                  <div className="flex items-center gap-3 mb-2">
                    {job.startup.logo && (
                      <div className="h-10 w-10 rounded overflow-hidden bg-background">
                        {/* Use next/image in production */}
                        <img
                          src={job.startup.logo}
                          alt={job.startup.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{job.startup.name}</p>
                      <p className="text-sm text-muted-foreground">{job.startup.country}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-2" size="sm" asChild>
                    <Link href={`/startups/${job.startupId}`}>
                      View Company Profile
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}