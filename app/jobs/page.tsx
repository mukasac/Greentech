import { JobFilters } from "@/components/jobs/job-filters";
import { JobCard } from "@/components/jobs/job-card";
import { jobs } from "@/lib/data/jobs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function JobsPage() {
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
          />
        </div>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <JobFilters />
        </aside>
        
        <main>
          <div className="grid gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}