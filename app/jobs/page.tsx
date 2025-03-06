"use client";

import { useState, useEffect, useCallback } from "react";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobCard } from "@/components/jobs/job-card";
import { Input } from "@/components/ui/input";
import { Search, Loader2, ArrowUpDown, Users, Briefcase, MapPin, Building2 } from "lucide-react";
import { Job } from "@/lib/types/job";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [experienceLevelFilter, setExperienceLevelFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("recent");
  const [jobCount, setJobCount] = useState(0);

  // Fetch jobs with filters
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build query string for filters
      const queryParams = new URLSearchParams();
      if (typeFilter) queryParams.append("type", typeFilter);
      if (experienceLevelFilter) queryParams.append("experienceLevel", experienceLevelFilter);
      if (locationFilter) queryParams.append("location", locationFilter);
      if (countryFilter) queryParams.append("country", countryFilter);
      
      // Fetch jobs from API
      const url = `/api/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status}`);
      }
      
      const data = await response.json();
      setJobs(data);
      setJobCount(data.length);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError(`Failed to load jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, experienceLevelFilter, locationFilter, countryFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (type: string, value: string | null) => {
    switch (type) {
      case 'type':
        setTypeFilter(value);
        break;
      case 'experienceLevel':
        setExperienceLevelFilter(value);
        break;
      case 'location':
        setLocationFilter(value);
        break;
      case 'country':
        setCountryFilter(value);
        break;
    }
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    
    const sortedJobs = [...jobs];
    
    switch(value) {
      case 'recent':
        sortedJobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
        break;
      case 'salary-high':
        sortedJobs.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0));
        break;
      case 'salary-low':
        sortedJobs.sort((a, b) => (a.salary?.min || 0) - (b.salary?.min || 0));
        break;
      case 'name-az':
        sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-za':
        sortedJobs.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    
    setJobs(sortedJobs);
  };

  // Filter by search query
  const filteredJobs = searchQuery
    ? jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (job.startup?.name && job.startup.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : jobs;

  // Featured jobs (for banner) - just use the first 3 jobs or create specific highlighted ones
  const featuredJobs = jobs.slice(0, 3);

  return (
    <div className="container py-8 md:py-12">
      {/* Hero Banner */}
      <div className="relative mb-12 overflow-hidden rounded-xl bg-gradient-to-r from-primary/90 to-primary-foreground/90 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10"></div>
        <div className="relative z-10 px-6 py-10 md:px-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                Find Your Next Green Tech Career
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                Discover opportunities with innovative sustainable technology companies across the Nordic region.
              </p>
              <div className="relative mt-6 max-w-lg">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                <Input
                  placeholder="Search for jobs, skills, or companies..."
                  className="pl-10 py-6 text-base bg-white/90 text-black border-0 shadow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            
          </div>
        </div>
      </div>

      

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Jobs</h2>
          <p className="text-muted-foreground">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} available
          </p>
        </div>
        
        <div className="flex items-center">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="salary-high">Highest Salary</SelectItem>
              <SelectItem value="salary-low">Lowest Salary</SelectItem>
              <SelectItem value="name-az">Title (A-Z)</SelectItem>
              <SelectItem value="name-za">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside>
          <JobFilters onFilterChange={handleFilterChange} className="sticky top-4" />
        </aside>
        
        <main>
          <div className="relative w-full mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search job title, skills, or company..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Loading jobs...</p>
              </div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find job openings.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}