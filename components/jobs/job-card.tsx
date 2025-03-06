"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { Job } from "@/lib/types/job";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  // Format the job posting date
  const formattedDate = job.postedAt instanceof Date
    ? formatDistanceToNow(job.postedAt, { addSuffix: true })
    : formatDistanceToNow(new Date(job.postedAt), { addSuffix: true });

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

  // Job detail link - convert any "mock-" IDs to regular format
  const jobId = job.id.startsWith("mock-") ? job.id.replace("mock-", "") : job.id;
  const detailUrl = `/jobs/${jobId}`;

  return (
    <div className="group relative">
      {/* Make the entire card clickable */}
      <Link href={detailUrl} className="absolute inset-0 z-10" aria-hidden="true" />
      
      <Card className="overflow-hidden h-full relative border hover:border-primary/20 transition-all group-hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 bg-white border">
              {job.startup?.logo ? (
                <Image 
                  src={job.startup.logo} 
                  alt={job.startup?.name || "Company logo"}
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <Building2 className="h-6 w-6" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base mb-1 truncate">{job.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span className="truncate">{job.startup?.name || "Unknown Company"}</span>
              </div>
              
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span className="truncate">{formatLocation()}</span>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {job.type.replace('-', ' ')}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {job.experienceLevel}
                </Badge>
                <span className="text-xs text-muted-foreground ml-auto flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <div className="relative z-20">
              <Button size="sm" variant="outline" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={detailUrl}>
                  View Job <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}