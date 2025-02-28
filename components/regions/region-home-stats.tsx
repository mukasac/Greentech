"use client";

import { useEffect, useState } from 'react';
import { Building2, Briefcase, Calendar } from 'lucide-react';

interface RegionStatistics {
  startups: number;
  openPositions: number;
  upcomingEvents: number;
}

interface RegionStatsProps {
  regionId: string; // The ID of the region to fetch stats for
}

export default function RegionHomeStats({ regionId }: RegionStatsProps) {
  const [stats, setStats] = useState<RegionStatistics>({
    startups: 0,
    openPositions: 0,
    upcomingEvents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegionStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/regions/${regionId}/statistics`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch region statistics');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching region statistics:', error);
        // You could set default values or show an error state here
      } finally {
        setLoading(false);
      }
    };

    if (regionId) {
      fetchRegionStats();
    }
  }, [regionId]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <div className="flex items-center gap-4">
          <Building2 className="h-6 w-6 text-green-500" />
          <div>
            <div className="text-3xl font-bold">{loading ? '...' : stats.startups}</div>
            <div className="text-muted-foreground">Active Startups</div>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <div className="flex items-center gap-4">
          <Briefcase className="h-6 w-6 text-purple-500" />
          <div>
            <div className="text-3xl font-bold">{loading ? '...' : stats.openPositions}</div>
            <div className="text-muted-foreground">Open Positions</div>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <div className="flex items-center gap-4">
          <Calendar className="h-6 w-6 text-orange-500" />
          <div>
            <div className="text-3xl font-bold">{loading ? '...' : stats.upcomingEvents}</div>
            <div className="text-muted-foreground">Upcoming Events</div>
          </div>
        </div>
      </div>
    </div>
  );
}