// lib/utils/regions-utils.ts
import { regions } from "@/lib/data/regions";
import { startups } from "@/lib/data/startups";
import { getRegionNews } from "@/lib/data/news";
import { getRegionEvents } from "@/lib/data/events";
import { jobs } from "@/lib/data/jobs";

export function getRegionData(regionSlug: string) {
  const region = regions.find((r) => r.slug === regionSlug);
  if (!region) return null;

  // Filter startups by region
  const regionStartups = startups.filter(
    (startup) => startup.country.toLowerCase() === regionSlug
  ).slice(0, 3);

  // Get region news
  const regionNews = getRegionNews(regionSlug);

  // Get region events
  const regionEvents = getRegionEvents(regionSlug);

  // Filter jobs by region
  const regionJobs = jobs
    .filter((job) => job.location.country.toLowerCase() === regionSlug)
    .slice(0, 3);

  return {
    region,
    startups: regionStartups,
    news: regionNews,
    events: regionEvents,
    jobs: regionJobs,
  };
}