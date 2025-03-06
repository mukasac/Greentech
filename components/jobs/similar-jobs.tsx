"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { Job } from "@/lib/types/job";

interface SimilarJobsProps {
  currentJobId: string;
  skills: string[];
  department: string;
  experienceLevel: string;
}

export function SimilarJobs({ 
  currentJobId, 
  skills, 
  department, 
  experienceLevel 
}: SimilarJobsProps) {
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarJobs = async () => {
      try {
        setLoading(true);
        
        // Create query params - in a real app you'd fetch similar jobs based on department/skills
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
        setError('Failed to load similar jobs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSimilarJobs();
  }, [currentJobId, experienceLevel]);

  // Format location
  const formatLocation = (location: any) => {
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Similar Jobs</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error || similarJobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Similar Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-6">
            {error || "No similar jobs found at the moment."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Similar Jobs</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {similarJobs.map((job) => (
            <div key={job.id} className="p-4">
              <div className="mb-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold line-clamp-1">{job.title}</h3>
                  <Badge variant="outline" className="ml-auto flex-shrink-0">{job.type}</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5 mr-1" />
                  <span className="line-clamp-1">{job.startup?.name}</span>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span className="line-clamp-1">{formatLocation(job.location)}</span>
              </div>
              
              <Button size="sm" className="w-full" variant="outline" asChild>
                <Link href={`/jobs/${job.id}`}>
                  <ExternalLink className="mr-2 h-3.5 w-3.5" />
                  View Job
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}