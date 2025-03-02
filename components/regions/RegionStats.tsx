"use client";

// components/regions/RegionStats.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Briefcase, Calendar } from 'lucide-react';

interface RegionStatistics {
  startups: number;
  openJobs: number;
  upcomingEvents: number;
  employees?: number;
  totalInvestment?: string;
}

interface RegionStatsProps {
  regionSlug: string;
}

export default function RegionStats({ regionSlug }: RegionStatsProps) {
  const [stats, setStats] = useState<RegionStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegionStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/regions/${regionSlug}/stats`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch region statistics');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching region statistics:', error);
        setError('Could not load statistics at this time');
      } finally {
        setLoading(false);
      }
    };

    if (regionSlug) {
      fetchRegionStats();
    }
  }, [regionSlug]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse flex items-center gap-4">
              <div className="rounded-full bg-primary/10 h-12 w-12"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Default values if stats not available
  const defaultStats = {
    startups: 40,
    openJobs: 80,
    upcomingEvents: 30
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
              <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-3xl font-bold">{displayStats.startups}</div>
              <div className="text-muted-foreground">Active Startups</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
              <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-3xl font-bold">{displayStats.openJobs}</div>
              <div className="text-muted-foreground">Open Positions</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-3">
              <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="text-3xl font-bold">{displayStats.upcomingEvents}</div>
              <div className="text-muted-foreground">Upcoming Events</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}