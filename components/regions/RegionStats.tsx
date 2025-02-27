"use client"

import { useState, useEffect } from 'react';
import { Building2, Briefcase, Calendar } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface RegionStatistics {
  startups: number;
  openJobs: number;
  upcomingEvents: number;
  employees: number;
  totalInvestment: string;
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

  if (!stats) {
    return null;
  }

  const statItems = [
    {
      icon: Building2,
      value: stats.startups,
      label: "Active Startups",
      color: "text-green-500"
    },
    {
      icon: Briefcase,
      value: stats.openJobs,
      label: "Open Positions",
      color: "text-purple-500"
    },
    {
      icon: Calendar,
      value: stats.upcomingEvents,
      label: "Upcoming Events",
      color: "text-orange-500"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-full bg-${item.color.replace('text-', '')}/10 p-3`}>
                <Icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="text-muted-foreground">{item.label}</div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}