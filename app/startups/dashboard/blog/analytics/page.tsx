import { BlogAnalyticsDashboard } from "@/components/blog/analytics/blog-analytics-dashboard";

export default function BlogAnalyticsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Blog Analytics</h1>
        <p className="text-muted-foreground">
          Track your blog's performance and engagement
        </p>
      </div>
      <BlogAnalyticsDashboard />
    </div>
  );
}