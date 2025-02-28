"use client";

import { useState, useEffect } from "react";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobCard } from "@/components/jobs/job-card";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { Job } from "@/lib/types/job";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [experienceLevelFilter, setExperienceLevelFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, [typeFilter, experienceLevelFilter, locationFilter, countryFilter]);

  const fetchJobs = async () => {
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
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError(`Failed to load jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredJobs = searchQuery
    ? jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : jobs;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Green Tech Jobs</h1>
        <p className="text-lg text-muted-foreground">
          Find your next role in sustainable technology across the Nordic region.
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <JobFilters onFilterChange={handleFilterChange} />
        </aside>
        
        <main>
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
            <div className="grid gap-6 md:grid-cols-2">
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