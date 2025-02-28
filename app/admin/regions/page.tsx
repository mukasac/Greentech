"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Search, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePermissions } from "@/hooks/usePermissions";
import { Region } from "@/lib/types/region";

// Mock data for fallback when API fails
const mockRegions: Region[] = [
  {
    id: "1",
    name: "Norway",
    slug: "norway",
    description: "Norway's green tech ecosystem",
    coverImage: "/images/regions/norway.jpg",
    stats: {
      startups: 450,
      employees: 12000,
      openJobs: 850,
      upcomingEvents: 24,
      totalInvestment: "€450M",
      updatedAt: new Date()
    },
    initiatives: [
      {
        id: "n1",
        title: "Green Hydrogen Initiative",
        description: "A nationwide program to develop hydrogen infrastructure"
      },
      {
        id: "n2",
        title: "Offshore Wind Expansion",
        description: "Investment in expanding offshore wind capacity"
      }
    ],
    ecosystemPartners: [
      {
        id: "np1",
        name: "Innovation Norway",
        logo: "/logos/innovation-norway.png",
        type: "government"
      },
      {
        id: "np2",
        name: "Oslo Science Park",
        logo: "/logos/oslo-science-park.png",
        type: "accelerator"
      }
    ]
  },
  {
    id: "2",
    name: "Sweden",
    slug: "sweden",
    description: "Sweden's green tech ecosystem",
    coverImage: "/images/regions/sweden.jpg",
    stats: {
      startups: 580,
      employees: 15000,
      openJobs: 920,
      upcomingEvents: 32,
      totalInvestment: "€620M",
      updatedAt: new Date()
    },
    initiatives: [
      {
        id: "s1",
        title: "Fossil-Free Sweden",
        description: "Initiative to make Sweden carbon neutral by 2045"
      }
    ],
    ecosystemPartners: [
      {
        id: "sp1",
        name: "Stockholm Green Capital",
        logo: "/logos/stockholm-green.png",
        type: "accelerator"
      },
      {
        id: "sp2",
        name: "KTH Royal Institute",
        logo: "/logos/kth.png",
        type: "university"
      }
    ]
  },
  {
    id: "3",
    name: "Denmark",
    slug: "denmark",
    description: "Denmark's green tech ecosystem",
    coverImage: "/images/regions/denmark.jpg",
    stats: {
      startups: 420,
      employees: 9800,
      openJobs: 780,
      upcomingEvents: 28,
      totalInvestment: "€380M",
      updatedAt: new Date()
    },
    initiatives: [
      {
        id: "d1",
        title: "Danish Wind Hub",
        description: "Supporting growth in wind energy technology"
      }
    ],
    ecosystemPartners: [
      {
        id: "dp1",
        name: "State of Green",
        logo: "/logos/state-of-green.png",
        type: "government"
      }
    ]
  },
  {
    id: "4",
    name: "Finland",
    slug: "finland",
    description: "Finland's green tech ecosystem",
    coverImage: "/images/regions/finland.jpg",
    stats: {
      startups: 380,
      employees: 8500,
      openJobs: 620,
      upcomingEvents: 22,
      totalInvestment: "€320M",
      updatedAt: new Date()
    },
    initiatives: [
      {
        id: "f1",
        title: "Circular Economy Finland",
        description: "Program to boost circular economy innovations"
      }
    ],
    ecosystemPartners: [
      {
        id: "fp1",
        name: "Business Finland",
        logo: "/logos/business-finland.png",
        type: "government"
      },
      {
        id: "fp2",
        name: "Aalto University",
        logo: "/logos/aalto.png",
        type: "university"
      }
    ]
  },
  {
    id: "5",
    name: "Iceland",
    slug: "iceland",
    description: "Iceland's green tech ecosystem",
    coverImage: "/images/regions/iceland.jpg",
    stats: {
      startups: 180,
      employees: 3200,
      openJobs: 320,
      upcomingEvents: 15,
      totalInvestment: "€120M",
      updatedAt: new Date()
    },
    initiatives: [
      {
        id: "i1",
        title: "Geothermal Excellence",
        description: "Promoting innovation in geothermal technologies"
      }
    ],
    ecosystemPartners: [
      {
        id: "ip1",
        name: "Iceland Innovation",
        logo: "/logos/iceland-innovation.png",
        type: "government"
      }
    ]
  }
];

export default function AdminRegionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { hasPermission, isSiteAdmin } = usePermissions();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [usedMockData, setUsedMockData] = useState(false);
  
  // Add ref to prevent multiple fetches
  const fetchAttempted = useRef(false);

  useEffect(() => {
    // Redirect if not authenticated or doesn't have admin permission
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }

    if (status === "authenticated" && !hasPermission("SITE_ADMIN")) {
      router.push("/unauthorized");
      return;
    }

    // Only fetch regions if authenticated, has permission, and not already attempted
    if (status === "authenticated" && hasPermission("SITE_ADMIN") && !fetchAttempted.current) {
      fetchAttempted.current = true; // Set flag to prevent multiple fetches
      fetchRegions();
    }
  }, [status, router, hasPermission]);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsedMockData(false);
      
      console.log("Fetching regions data...");
      const response = await fetch("/api/admin/regions", {
        cache: 'no-store',
        headers: {
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch regions: ${response.status} ${response.statusText}`);
      }
      
      let data = await response.json();
      
      // If data is empty or not an array, use mock data
      if (!Array.isArray(data) || data.length === 0) {
        console.warn("API returned empty or invalid data, using mock data instead.");
        data = mockRegions;
        setUsedMockData(true);
      }
      
      console.log("Received regions data:", data.length, "regions");
      setRegions(data);
    } catch (error) {
      console.error("Error fetching regions:", error);
      setError(`Failed to load regions: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Fallback to mock data
      console.log("Falling back to mock data due to error");
      setRegions(mockRegions);
      setUsedMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      // If we're using mock data, just simulate a refresh
      if (usedMockData) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        setSuccess("Region statistics refreshed successfully (mock data)");
        setTimeout(() => setSuccess(null), 3000);
        setRefreshing(false);
        return;
      }
      
      console.log("Refreshing region statistics...");
      const response = await fetch("/api/admin/regions/refresh-stats", {
        method: "POST",
        cache: 'no-store',
        headers: {
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to refresh region statistics: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Refresh result:", result);
      
      setSuccess("Region statistics refreshed successfully");
      setTimeout(() => setSuccess(null), 3000);
      
      // Refetch regions to get updated data
      await fetchRegions();
    } catch (error) {
      console.error("Error refreshing region statistics:", error);
      setError(`Failed to refresh region statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredRegions = searchQuery
    ? regions.filter(
        (region) =>
          region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          region.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : regions;

  if (status === "loading") {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Region Management</h1>
          <p className="text-muted-foreground">
            Manage region data and statistics
          </p>
          {usedMockData && (
            <p className="text-amber-600 font-medium mt-1">
              Using mock data - API data unavailable
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={refreshStats}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Stats
              </>
            )}
          </Button>
          
          <Button asChild>
            <Link href="/admin/regions/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Region
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Regions</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search regions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredRegions.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No regions found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Startups</TableHead>
                  <TableHead>Open Jobs</TableHead>
                  <TableHead>Upcoming Events</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegions.map((region) => (
                  <TableRow key={region.id}>
                    <TableCell className="font-medium">{region.name}</TableCell>
                    <TableCell>{region.slug}</TableCell>
                    <TableCell>{region.stats.startups}</TableCell>
                    <TableCell>{region.stats.openJobs}</TableCell>
                    <TableCell>{region.stats.upcomingEvents}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/regions/${region.slug}`} title="View region">
                            <Search className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/admin/regions/${region.id}/edit`} title="Edit region">
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}