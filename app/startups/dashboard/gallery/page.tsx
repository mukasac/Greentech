"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
  created_at: string;
}

export default function GalleryManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const { data: session } = useSession(); // Get user session from NextAuth

  // const params = useParams();
  // const startupId = params?.id;

  useEffect(() => {
    // const fetchGalleryImages = async () => {
    //   try {
    //     // Fetch all gallery images since RLS is disabled
    //     const { data: galleryImages, error: galleryError } = await supabase
    //       .from("gallery")
    //       .select("*")
    //       .order("created_at", { ascending: false });

    //     if (galleryError) throw galleryError;
    //     setImages(galleryImages || []);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchGalleryImages();

    const fetchGalleryImages = async () => {
      try {
        if (!session) {
          console.error("No active session found!");
          return;
        }
        console.log("session:...... ", session);
        const userId = session.user.id; // Get logged-in user's ID
        console.log("userId:...... ", userId);
        // Get user's startups by user ID
        const { data: startups, error: startupsError } = await supabase
        .from("startups")
        .select("id")
        .eq("user_id", userId); 
        
        if (startupsError) throw startupsError;
        if (!startups.length) {
          setImages([]);
          return;
        }

        const startupIds = startups.map((s) => s.id); // Extract startup IDs
        console.log("startupIds:...... ", startupIds);
        // Fetch gallery images that belong to user's startups
        const { data: galleryImages, error: galleryError } = await supabase
          .from("gallery")
          .select("*")
          .in("startup_id", startupIds)
          .order("created_at", { ascending: false });

        if (galleryError) throw galleryError;

        setImages(galleryImages || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, [session, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-muted-foreground">
            Showcase your startup images and media
          </p>
        </div>
        {/* <Button asChild>
          <Link href={`/startups/${startupId}/gallery/add`}>
            <ImagePlus className="mr-2 h-4 w-4" />
            Add Image
          </Link>
        </Button> */}
      </div>

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
          <div className="mb-4 rounded-full bg-muted p-6">
            <ImagePlus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">No Gallery Images Yet</h2>
          <p className="mb-6 text-center text-muted-foreground">
            Add your first image to showcase your startup.
          </p>
          <Button asChild>
            <Link href={`/startups/gallery/add`}>
              <ImagePlus className="mr-2 h-4 w-4" />
              Add First Image
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-lg border bg-white shadow"
            >
              <div className="aspect-video">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                />
              </div>
              {image.caption && (
                <div className="p-4">
                  <p className="text-sm text-gray-600">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
