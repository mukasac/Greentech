// import { JobsList } from "@/components/jobs/jobs-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function StartupJobsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Listings</h1>
          <p className="text-muted-foreground">
            Manage your job postings and find great talent
          </p>
        </div>
        <Button asChild>
          <Link href="/startups/dashboard/jobs/create">
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </div>
      {/* <JobsList startupId="current-startup-id" /> */}
    </div>
  );
}