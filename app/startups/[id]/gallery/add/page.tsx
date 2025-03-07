'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component
import { supabase } from "@/lib/supabase";

interface AddGalleryImageProps {
  params: { id: string }
}

export default function AddGalleryImagePage({ params }: AddGalleryImageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    alt: "",
    caption: "",
    file: null as File | null
  });

 
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setFormData(prev => ({ ...prev, file }));
    setError(null);
  };

  const handleSubmit2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.file) {
        throw new Error('Please select an image to upload');
      }

      // Generate a unique filename with startup path
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${params.id}/${timestamp}-${randomString}.${fileExt}`;

      // Upload to Supabase Storage with startup-specific path
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, formData.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload image');
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      // Save gallery entry to database
      const { error: dbError } = await supabase
        .from('gallery')  // Changed from startup_gallery to gallery
        .insert({
          url: publicUrl,
          alt: formData.alt || formData.file.name,
          caption: formData.caption
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save gallery entry');
      }

      setSuccess('Image added successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/startups/dashboard/gallery');
        router.refresh();
      }, 2000);

    } catch (err) {
      console.error('Error adding image:', err);
      setError(err instanceof Error ? err.message : 'Failed to add image');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    try {
      if (!formData.file) {
        throw new Error("Please select an image to upload");
      }
  
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExt = formData.file.name.split(".").pop();
      const fileName = `${params.id}/${timestamp}-${randomString}.${fileExt}`;
  
      // Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, formData.file, { cacheControl: "3600", upsert: false });
  
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Failed to upload image");
      }
  
      // Get public URL
      const { data } = supabase.storage
        .from("gallery")
        .getPublicUrl(fileName);
  
      const publicUrl = data.publicUrl;
  
      // Send to API route
      const response = await fetch(`/api/startups/${params.id}/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: publicUrl,
          alt: formData.alt || formData.file.name,
          caption: formData.caption,
        }),
      });
  
      console.log('params response...', params);
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to add image to database");
      }
  
      setSuccess("Image added successfully!");
      setTimeout(() => {
        router.push(`/startups/dashboard/profile?tab=gallery`);
        router.refresh();
      }, 2000);
    } catch (err) {
      console.error("Error adding image:", err);
  
      // Fallback: Direct Supabase Insertion if API fails
      if (err instanceof Error && err.message.includes("Failed to add image to database")) {
        try {
          // Define publicUrl here since it would be out of scope otherwise
          let publicUrl = "";
          
          // Only try to access file properties if file is not null
          if (formData.file) {
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const fileExt = formData.file.name.split(".").pop();
            const fileName = `${params.id}/${timestamp}-${randomString}.${fileExt}`;
            
            // Get the public URL (this should have been done earlier, but ensuring it's available here)
            const { data } = supabase.storage
              .from("gallery")
              .getPublicUrl(fileName);
              
            publicUrl = data.publicUrl;
          }
          
          const { error: dbError } = await supabase
            .from("gallery")
            .insert({
              url: publicUrl,
              alt: formData.alt || (formData.file ? formData.file.name : ""),
              caption: formData.caption,
              startupId: params.id,
            });
  
          if (dbError) {
            throw new Error("Failed to save gallery entry");
          }
  
          setSuccess("Image added successfully!");
          setTimeout(() => {
            router.push(`/startups/dashboard/profile?tab=gallery`);
            router.refresh();
          }, 2000);
        } catch (fallbackErr) {
          console.error("Fallback error:", fallbackErr);
          setError("Failed to save gallery entry");
        }
      } else {
        setError(err instanceof Error ? err.message : "Failed to add image");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  


  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/startups/dashboard/gallery">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Gallery Image</CardTitle>
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
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                {imagePreview && (
                  <div className="mt-2 aspect-video w-full overflow-hidden rounded-lg border">
                    {/* Replace img with Next.js Image component */}
                    <div className="relative h-full w-full">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alt">Alt Text</Label>
                <Input
                  id="alt"
                  value={formData.alt}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
                  placeholder="Describe the image for accessibility"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  value={formData.caption}
                  onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Add a caption (optional)"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/startups/dashboard/gallery">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Image"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}