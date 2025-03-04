"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Startup } from "@/lib/types/startup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditStartupPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Startup>>({
    name: "",
    description: "",
    website: "",
    founded: "",
    employees: "",
    funding: "",
    mainCategory: "renewable-energy",
    country: "norway",
    tags: [],
    startupStage: "",
    investmentStage: "",
    fundingNeeds: "",
  });

  // Define options for dropdown selects
  const startupStageOptions = [
    { value: "MVP", label: "MVP" },
    { value: "Prototype", label: "Prototype" },
    { value: "Market Ready", label: "Market Ready" },
    { value: "Scaling", label: "Scaling" },
    { value: "Mature", label: "Mature" }
  ];

  const investmentStageOptions = [
    { value: "Pre-seed", label: "Pre-seed" },
    { value: "Seed", label: "Seed" },
    { value: "Series A", label: "Series A" },
    { value: "Series B", label: "Series B" },
    { value: "Series C+", label: "Series C+" },
    { value: "Growth", label: "Growth" }
  ];

  const fundingNeedsOptions = [
    { value: "Looking for funding", label: "Looking for funding" },
    { value: "Not currently raising", label: "Not currently raising" },
    { value: "Self-funded", label: "Self-funded" },
    { value: "Profitable", label: "Profitable" }
  ];

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/startups/${params.id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch startup");
        }
        
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching startup:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch startup");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartup();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

    try {
      const response = await fetch(`/api/startups/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update startup");
      }

      setSuccess("Startup updated successfully!");
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/startups/${params.id}`);
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error("Error updating startup:", error);
      setError(error instanceof Error ? error.message : "Failed to update startup");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading startup details...</div>;
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/startups/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Startup Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="founded">Founded Year</Label>
                  <Input
                    id="founded"
                    type="number"
                    value={formData.founded}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="employees">Number of Employees</Label>
                  <Input
                    id="employees"
                    value={formData.employees}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funding">Total Funding</Label>
                  <Input
                    id="funding"
                    value={formData.funding}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Add Stage Fields Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Company Stage</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="startupStage">Startup Stage</Label>
                    <Select
                      value={formData.startupStage || ""}
                      onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, startupStage: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select startup stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {startupStageOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="investmentStage">Investment Stage</Label>
                    <Select
                      value={formData.investmentStage || ""}
                      onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, investmentStage: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select investment stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {investmentStageOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fundingNeeds">Funding Needs</Label>
                    <Select
                      value={formData.fundingNeeds || ""}
                      onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, fundingNeeds: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select funding needs" />
                      </SelectTrigger>
                      <SelectContent>
                        {fundingNeedsOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" asChild>
                  <Link href={`/startups/${params.id}`}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}