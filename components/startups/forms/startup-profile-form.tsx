"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { CategorySelector } from "./category-selector";
import { TeamForm } from "./team-form";
import { GalleryUpload } from "./gallery-upload";
import { SustainabilityForm } from "./climate-impact-form";
import { usePermissions } from "@/hooks/usePermissions";
import { hasPermission } from "../../../lib/auth/utils";

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
            {hasPermission("CREATE_STARTUP_CATEGORY") && (
              <TabsTrigger value="categories">Categories</TabsTrigger>
            )}
            {hasPermission("CREATE_TEAM_MEMBERS") && (
              <TabsTrigger value="team">Team</TabsTrigger>
            )}
            {hasPermission("CREATE_GALLERY") && (
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            )}
            {/* <TabsTrigger value="sustainability">Sustainability</TabsTrigger> */}
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

          {/* <TabsContent value="sustainability">
            <SustainabilityForm />
          </TabsContent> */}
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