"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  CheckCircle,
  Share,
  Heart,
  Users,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { Job } from "@/lib/types/job";

// Extended interface for startup with optional website property
interface ExtendedStartup {
  name: string;
  logo: string;
  country: string;
  website?: string;
}
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applied = searchParams.get('applied');
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [loadingSimilarJobs, setLoadingSimilarJobs] = useState(true);

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
      
      // After fetching job, fetch similar jobs
      fetchSimilarJobs(data.experienceLevel, data.id);
    } catch (error) {
      console.error("Error fetching job:", error);
      setError(error instanceof Error ? error.message : "Failed to load job");
    } finally {
      setLoading(false);
    }
  }, [params.id]);
  
  const fetchSimilarJobs = async (experienceLevel: string, currentJobId: string) => {
    try {
      setLoadingSimilarJobs(true);
      
      // Create query params based on experience level
      const params = new URLSearchParams();
      params.append('experienceLevel', experienceLevel);
      
      const response = await fetch(`/api/jobs?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch similar jobs');
      }
      
      const jobs = await response.json();
      
      // Filter out the current job and limit to 3 results
      const filtered = jobs
        .filter((job: Job) => job.id !== currentJobId)
        .slice(0, 3);
      
      setSimilarJobs(filtered);
    } catch (error) {
      console.error('Error fetching similar jobs:', error);
    } finally {
      setLoadingSimilarJobs(false);
    }
  };
  
  useEffect(() => {
    if (params.id) {
      fetchJob();
    }
  }, [params.id, fetchJob]);

  const toggleSaveJob = () => {
    setIsSaved(!isSaved);
    // Here you could implement actual saving functionality
  };

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job: ${job?.title} at ${job?.startup?.name}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Check if salary is provided (not null/undefined and not 0-0)
  const hasSalary = () => {
    if (!job?.salary) return false;
    if (job.salary.min === 0 && job.salary.max === 0) return false;
    return true;
  };

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

  // Format similar job location
  const formatSimilarJobLocation = (location: any) => {
    if (!location) return "N/A";
    
    const { type, city, country } = location;
    
    if (type === "remote") {
      return `Remote${country ? ` (${country})` : ''}`;
    }
    
    if (city && country) {
      return `${city}, ${country}`;
    }
    
    return country || 'Unknown location';
  };

  return (
    <div className="container py-8 md:py-12">
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
            <CardHeader className="border-b pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex gap-4 items-start">
                  <Avatar className="h-16 w-16 border rounded-md hidden sm:flex">
                    {job.startup?.logo ? (
                      <AvatarImage 
                        src={job.startup?.logo} 
                        alt={job.startup?.name || "Company"} 
                        className="object-contain bg-white p-1"
                      />
                    ) : (
                      <AvatarFallback className="rounded-md">
                        <Building2 className="h-8 w-8" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex gap-2 flex-wrap mb-2">
                      <Badge variant="secondary">{job.type.replace('-', ' ')}</Badge>
                      <Badge variant="outline">{job.experienceLevel}</Badge>
                      {job.location?.type && (
                        <Badge variant="outline">{job.location.type}</Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{job.title}</CardTitle>
                    
                    <div className="flex items-center text-base text-muted-foreground">
                      <Building2 className="h-4 w-4 mr-1" />
                      <span className="font-medium">{job.startup?.name || "Unknown Company"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 self-start mt-2 sm:mt-0">
                  <Button variant="outline" size="icon" onClick={toggleSaveJob}>
                    <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={shareJob}>
                    <Share className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-8 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium">{formatLocation()}</p>
                  </div>
                </div>
                
                {hasSalary() && (
                  <div className="flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium">{job.department}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium">{formattedPostedDate}</p>
                    <p className="text-sm text-muted-foreground">{timeAgo}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Description</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="whitespace-pre-line">{job.description}</p>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Requirements</h2>
                <ul className="space-y-2 ml-6">
                  {job.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Responsibilities</h2>
                <ul className="space-y-2 ml-6">
                  {job.responsibilities.map((resp: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill: string, index: number) => (
                    <Badge key={index} className="px-3 py-1">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="pt-6 border-t">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-muted-foreground">
                      <strong>{job.applicationCount}</strong> people have applied
                    </span>
                  </div>
                  
                  {daysRemaining !== null && daysRemaining > 0 && (
                    <div className="flex items-center text-amber-600">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>{daysRemaining} days remaining</span>
                    </div>
                  )}
                </div>
                
                <Button className="w-full mt-4" size="lg" asChild>
                  <Link href={`/jobs/${params.id}/apply`}>
                    Apply for this position
                  </Link>
                </Button>
                
                <div className="flex sm:hidden justify-center mt-4 gap-4">
                  <Button variant="outline" onClick={toggleSaveJob}>
                    <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="outline" onClick={shareJob}>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        
        <aside className="space-y-6">
          {/* Company Card */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg sm:text-xl">About the Company</CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="p-6 pb-4 flex items-center space-x-4">
                <div className="h-16 w-16 rounded-lg border overflow-hidden flex-shrink-0 bg-white p-1">
                  {job.startup?.logo ? (
                    <Image
                      src={job.startup.logo}
                      alt={job.startup.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100">
                      <Building2 className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{job.startup?.name}</h3>
                  <p className="text-muted-foreground">
                    {job.startup?.country}
                  </p>
                </div>
              </div>
              
              <div className="p-6 pt-2 border-t bg-muted/20 flex flex-col sm:flex-row gap-3">
                {/* Conditionally render the website button only if it exists */}
                {/* Check if startup has a website before rendering button */}
                {job.startup && (job.startup as ExtendedStartup).website && (
                  <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                    <a href={`https://${(job.startup as ExtendedStartup).website}`} target="_blank" rel="noopener noreferrer">
                      <Building2 className="mr-2 h-4 w-4" />
                      Visit Website
                    </a>
                  </Button>
                )}
                
                <Button size="sm" className="w-full sm:w-auto" asChild>
                  <Link href={`/startups/${job.startupId}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Company Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Similar Jobs Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Similar Jobs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loadingSimilarJobs ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : similarJobs.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No similar jobs found</p>
                </div>
              ) : (
                <div className="divide-y">
                  {similarJobs.map((similarJob) => (
                    <div key={similarJob.id} className="p-4">
                      <div className="mb-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold line-clamp-1">{similarJob.title}</h3>
                          <Badge variant="outline" className="ml-auto flex-shrink-0">{similarJob.type}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Building2 className="h-3.5 w-3.5 mr-1" />
                          <span className="line-clamp-1">{similarJob.startup?.name}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span className="line-clamp-1">{formatSimilarJobLocation(similarJob.location)}</span>
                      </div>
                      
                      <Button size="sm" className="w-full" variant="outline" asChild>
                        <Link href={`/jobs/${similarJob.id}`}>
                          View Job
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}