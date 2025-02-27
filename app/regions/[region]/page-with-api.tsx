"use client";

import { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { RegionHeader } from "@/components/regions/region-header";
import { RegionStats } from "@/components/regions/region-stats";
import { RegionStartups } from "@/components/regions/region-startups";
import { RegionNews } from "@/components/regions/region-news";
import { RegionJobs } from "@/components/regions/region-jobs";
import { RegionEvents } from "@/components/regions/region-events";
import { regions } from "@/lib/data/regions";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function generateStaticParams() {
  return regions.map((region) => ({
    region: region.slug,
  }));
}

export default function RegionPage({ params }: { params: { region: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchRegionData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/regions/${params.region}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch region data");
        }
        
        const regionData = await response.json();
        setData(regionData);
      } catch (err) {
        console.error("Error fetching region data:", err);
        setError("Failed to load region data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchRegionData();
  }, [params.region]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <button 
            onClick={() => router.refresh()}
            className="text-primary hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data || !data.region) {
    notFound();
  }

  return (
    <div>
      <RegionHeader region={data.region} regionSlug={params.region} />
      
      <div className="container py-8">
        <div className="grid gap-8">
          <RegionStats region={data.region} />
          
          <section>
            <h2 className="mb-6 text-2xl font-bold">Featured Startups</h2>
            <RegionStartups region={params.region} startups={data.startups} />
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Latest News</h2>
            <RegionNews region={params.region} news={data.news} />
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Job Opportunities</h2>
            <RegionJobs region={params.region} jobs={data.jobs} />
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Upcoming Events</h2>
            <RegionEvents region={params.region} events={data.events} />
          </section>
        </div>
      </div>
    </div>
  );
}