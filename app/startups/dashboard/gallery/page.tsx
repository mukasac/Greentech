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
  const { data: session } = useSession(); 
  const { status } = useSession();

  // const params = useParams();
  // const startupId = params?.id;

  useEffect(() => {

    const fetchGalleryImages = async () => {
      try {
        if (status !== "authenticated") {
          return;
        }
        
        const response = await fetch("/api/gallery");
        console.log('response......', response);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setImages(data.images);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status !== "loading") {
      fetchGalleryImages();
    }
  }, [status]);

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
            Claim a Startup to showcase your gallery images and media
            {/* Add your first image to showcase your startup. */}
          </p>
          <Button asChild>
            <Link href={`/startups`}>
              <ImagePlus className="mr-2 h-4 w-4" />
              {/* Add First Image */}
              Claim Startup
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
