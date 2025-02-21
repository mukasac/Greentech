import { ApplicationTracking } from "@/components/jobs/applications/application-tracking";
import { JobAnalyticsDashboard } from "@/components/jobs/analytics/job-analytics-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function JobApplicationsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <p className="text-muted-foreground">
          Track and manage applications for this position
        </p>
      </div>

      <Tabs defaultValue="applications">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="applications" className="mt-6">
          <ApplicationTracking />
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
          <JobAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}