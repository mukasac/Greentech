"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Briefcase, 
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { Job } from "@/lib/types/job";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  // Format the job posting date
  const formattedDate = job.postedAt instanceof Date
    ? formatDistanceToNow(job.postedAt, { addSuffix: true })
    : formatDistanceToNow(new Date(job.postedAt), { addSuffix: true });

  // Format salary range
  const formatSalary = () => {
    if (!job.salary) return "Competitive";
    const { min, max, currency } = job.salary;
    
    const formatNumber = (num: number) => {
      // For thousands, show as 70k instead of 70,000
      if (num >= 1000) {
        return `${Math.round(num / 1000)}k`;
      }
      return num.toString();
    };
    
    if (min === 0 && max === 0) return "Competitive";
    if (min === max) return `${currency} ${formatNumber(min)}`;
    return `${currency} ${formatNumber(min)} - ${formatNumber(max)}`;
  };
  
  // Format location
  const formatLocation = () => {
    if (!job.location) return "N/A";
    
    const { type, city, country } = job.location;
    
    if (type === "remote") {
      return `Remote${country ? ` (${country})` : ''}`;
    }
    
    if (city && country) {
      return `${city}, ${country} (${type})`;
    }
    
    return `${country || 'Unknown'} (${type})`;
  };

  // Job detail link - convert any "mock-" IDs to regular format
  const jobId = job.id.startsWith("mock-") ? job.id.replace("mock-", "") : job.id;
  const detailUrl = `/jobs/${jobId}`;
  const applyUrl = `/jobs/${jobId}/apply`;

  return (
    <div className="group relative">
      {/* Make the entire card clickable but avoid nested links */}
      <Link href={detailUrl} className="absolute inset-0 z-10" aria-hidden="true" />
      
      <Card className="overflow-hidden h-full relative border-2 hover:border-primary/20 transition-all group-hover:scale-[1.01] group-hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{job.type.replace('-', ' ')}</Badge>
                <Badge variant="outline">{job.experienceLevel}</Badge>
              </div>
              <h3 className="font-semibold text-xl mb-1">{job.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Building2 className="h-3.5 w-3.5 mr-1" />
                <span>{job.startup?.name || "Unknown Company"}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{formatLocation()}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>Posted {formattedDate}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5 mr-1" />
              <span>{job.department}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="font-medium">Salary: {formatSalary()}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.description}
            </p>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-medium mb-1.5">Required Skills:</h4>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.slice(0, 4).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{job.skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* Apply button - positioned with higher z-index so it works over the card link */}
          <div className="mt-6 flex justify-end">
            <div className="relative z-20">
              <Button asChild>
                <Link href={applyUrl}>
                  Apply Now <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}