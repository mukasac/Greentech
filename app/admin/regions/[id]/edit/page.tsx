"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePermissions } from "@/hooks/usePermissions";
import { Region } from "@/lib/types/region";

export default function EditRegionPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const fetchAttempted = useRef(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    coverImage: "",
    startups: "",
    employees: "",
    openJobs: "",
    upcomingEvents: "",
    totalInvestment: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }

    if (status === "authenticated" && !hasPermission("SITE_ADMIN")) {
      router.push("/unauthorized");
      return;
    }

    // Only attempt to fetch if not already attempted
    if (status === "authenticated" && hasPermission("SITE_ADMIN") && !fetchAttempted.current) {
      fetchAttempted.current = true;
      fetchRegion();
    }
  }, [status, router, hasPermission, params.id]);

  const fetchRegion = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching region data for ID:", params.id);
      
      // For development, use mock data if API call fails
      try {
        const response = await fetch(`/api/admin/regions/${params.id}`, {
          cache: 'no-store',
          headers: {
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch region: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Received region data:", data);
        
        setRegion(data);
        
        // Populate form data from region
        setFormData({
          name: data.name || "",
          description: data.description || "",
          slug: data.slug || "",
          coverImage: data.coverImage || "",
          startups: data.stats?.startups?.toString() || "0",
          employees: data.stats?.employees?.toString() || "0",
          openJobs: data.stats?.openJobs?.toString() || "0",
          upcomingEvents: data.stats?.upcomingEvents?.toString() || "0",
          totalInvestment: data.stats?.totalInvestment || "€0"
        });
      } catch (apiError) {
        console.error("API error:", apiError);
        
        // For development purposes, use mock data if API fails
        const mockRegion = {
          id: params.id,
          name: "Region " + params.id,
          slug: "region-" + params.id,
          description: "Description for region " + params.id,
          coverImage: "/images/regions/default.jpg",
          stats: {
            startups: 100,
            employees: 5000,
            openJobs: 200,
            upcomingEvents: 15,
            totalInvestment: "€100M"
          },
          initiatives: [],
          ecosystemPartners: []
        };
        
        console.log("Using mock data:", mockRegion);
        setRegion(mockRegion);
        
        setFormData({
          name: mockRegion.name,
          description: mockRegion.description,
          slug: mockRegion.slug,
          coverImage: mockRegion.coverImage,
          startups: mockRegion.stats.startups.toString(),
          employees: mockRegion.stats.employees.toString(),
          openJobs: mockRegion.stats.openJobs.toString(),
          upcomingEvents: mockRegion.stats.upcomingEvents.toString(),
          totalInvestment: mockRegion.stats.totalInvestment
        });
        
        setError("Using mock data - API unavailable");
      }
    } catch (error) {
      console.error("Error in region edit setup:", error);
      setError("Failed to load region data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validate inputs
      const numericFields = ['startups', 'employees', 'openJobs', 'upcomingEvents'];
      numericFields.forEach(field => {
        const value = Number(formData[field as keyof typeof formData]);
        if (isNaN(value) || value < 0) {
          throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} must be a positive number`);
        }
      });
      
      // Prepare data for update
      const updatedRegion = {
        id: params.id,
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        coverImage: formData.coverImage,
        stats: {
          startups: Number(formData.startups),
          employees: Number(formData.employees),
          openJobs: Number(formData.openJobs),
          upcomingEvents: Number(formData.upcomingEvents),
          totalInvestment: formData.totalInvestment
        }
      };
      
      console.log("Submitting updated region data:", updatedRegion);
      
      // Make API call to update the region
      const response = await fetch(`/api/admin/regions/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedRegion)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update region');
      }
      
      setSuccess('Region updated successfully');
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/admin/regions');
      }, 1500);
      
    } catch (error) {
      console.error('Error updating region:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading region data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/regions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Regions
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Region: {region?.name || 'Loading...'}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && error !== "Using mock data - API unavailable" && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {error && error === "Using mock data - API unavailable" && (
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertTitle>Notice</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Region name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="region-slug"
                required
                disabled
              />
              <p className="text-sm text-muted-foreground">Slug cannot be changed as its used in URLs</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Region description"
                required
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                type="url"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <h3 className="text-lg font-medium mt-4">Region Statistics</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startups">Number of Startups</Label>
                <Input
                  id="startups"
                  type="number"
                  min="0"
                  value={formData.startups}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees</Label>
                <Input
                  id="employees"
                  type="number"
                  min="0"
                  value={formData.employees}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="openJobs">Open Jobs</Label>
                <Input
                  id="openJobs"
                  type="number"
                  min="0"
                  value={formData.openJobs}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="upcomingEvents">Upcoming Events</Label>
                <Input
                  id="upcomingEvents"
                  type="number"
                  min="0"
                  value={formData.upcomingEvents}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalInvestment">Total Investment</Label>
              <Input
                id="totalInvestment"
                value={formData.totalInvestment}
                onChange={handleChange}
                placeholder="€100M"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/regions")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}