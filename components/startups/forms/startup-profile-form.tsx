"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { CategorySelector } from "./category-selector";
import { TeamForm } from "./team-form";
import { GalleryUpload } from "./gallery-upload";
import { SustainabilityForm } from "./climate-impact-form";
import { usePermissions } from "@/hooks/usePermissions";

// Updated interface to match GalleryUpload component expectations
interface GalleryImage {
  file: File;
  alt: string;
  caption: string | null;
}

export function StartupProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { hasPermission } = usePermissions();

  const [formData, setFormData] = useState({
    name: "",
    website: "",
    description: "",
    founded: "",
    employees: "",
    funding: "",
    teamMembers: [] as any[],
    galleryImages: [] as GalleryImage[],
    startupStage: "",
    investmentStage: "",
    fundingNeeds: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTeamChange = (members: any[]) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: members,
    }));
  };

  const handleGalleryChange = (images: GalleryImage[]) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: images,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Handle gallery image uploads first
      const galleryUploads = await Promise.all(
        formData.galleryImages.map(async (image) => {
          console.log("Uploading image:", image);

          const uploadData = new FormData();
          uploadData.append("file", image.file);

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: uploadData,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || "Failed to upload image");
          }

          const { url } = await uploadResponse.json();
          return {
            url,
            alt: image.alt,
            caption: image.caption,
          };
        })
      );

      // Create startup with the uploaded image URLs
      const response = await fetch("/api/startups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          galleryImages: galleryUploads,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create startup");
      }

      const data = await response.json();
      console.log("Startup created successfully:", data);

      // Show success message and redirect
      setSuccess("Startup created successfully!");
      setTimeout(() => {
        router.push("/startups/dashboard");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Submit error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create startup"
      );
      // Scroll to error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="funding">Funding & Stages</TabsTrigger>
            {hasPermission("CREATE_STARTUP_CATEGORY") && (
              <TabsTrigger value="categories">Categories</TabsTrigger>
            )}
            {hasPermission("CREATE_TEAM_MEMBERS") && (
              <TabsTrigger value="team">Team</TabsTrigger>
            )}
            {hasPermission("CREATE_GALLERY") && (
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
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
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={handleChange}
                        required
                      />
                    </div>
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

                  <div className="grid gap-4 md:grid-cols-3">
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
                        placeholder="e.g. $1M"
                        value={formData.funding}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="funding">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="startupStage">Startup Stage</Label>
                      <Select
                        value={formData.startupStage}
                        onValueChange={(value) => handleSelectChange("startupStage", value)}
                      >
                        <SelectTrigger id="startupStage">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ideation">Ideation</SelectItem>
                          <SelectItem value="mvp">MVP</SelectItem>
                          <SelectItem value="beta">Beta</SelectItem>
                          <SelectItem value="growth">Growth</SelectItem>
                          <SelectItem value="scaling">Scaling</SelectItem>
                          <SelectItem value="established">Established</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="investmentStage">Investment Stage</Label>
                      <Select
                        value={formData.investmentStage}
                        onValueChange={(value) => handleSelectChange("investmentStage", value)}
                      >
                        <SelectTrigger id="investmentStage">
                          <SelectValue placeholder="Select investment stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pre-seed">Pre-seed</SelectItem>
                          <SelectItem value="seed">Seed</SelectItem>
                          <SelectItem value="series-a">Series A</SelectItem>
                          <SelectItem value="series-b">Series B</SelectItem>
                          <SelectItem value="series-c">Series C</SelectItem>
                          <SelectItem value="growth">Growth</SelectItem>
                          <SelectItem value="ipo">IPO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fundingNeeds">Funding Needs</Label>
                      <Select
                        value={formData.fundingNeeds}
                        onValueChange={(value) => handleSelectChange("fundingNeeds", value)}
                      >
                        <SelectTrigger id="fundingNeeds">
                          <SelectValue placeholder="Select funding needs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-raising">Not currently raising</SelectItem>
                          <SelectItem value="looking">Actively looking</SelectItem>
                          <SelectItem value="in-process">In funding process</SelectItem>
                          <SelectItem value="closing">Closing round</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {hasPermission("CREATE_STARTUP_CATEGORY") && (
            <TabsContent value="categories">
              <CategorySelector />
            </TabsContent>
          )}

          {hasPermission("CREATE_TEAM_MEMBERS") && (
            <TabsContent value="team">
              <TeamForm onChange={handleTeamChange} />
            </TabsContent>
          )}
          
          {hasPermission("CREATE_GALLERY") && (
            <TabsContent value="gallery">
              <GalleryUpload onChange={handleGalleryChange} />
            </TabsContent>
          )}
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          {hasPermission("STARTUP_CREATE") && (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating Profile..." : "Create Profile"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}