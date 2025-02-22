// components/startups/sections/GallerySection.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ImagePlus } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GalleryImage } from "@/lib/types/startup";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GallerySectionProps {
  startup: any;
}

export function GallerySection({ startup }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const { hasPermission } = usePermissions();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/startups/${startup.id}/gallery/${imageId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete image');
      
      // Refresh the page to show updated gallery
      window.location.reload();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!startup?.gallery) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ImagePlus className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No Gallery Images</p>
          <p className="text-sm text-muted-foreground">Add images to showcase your startup</p>
          {hasPermission("MANAGE_GALLERY") && (
            <Button className="mt-4" asChild>
              <Link href={`/startups/${startup.id}/gallery/add`}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Image
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gallery</h2>
        {hasPermission("MANAGE_GALLERY") && (
          <Button asChild>
            <Link href={`/startups/${startup.id}/gallery/add`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {startup.gallery.map((image: GalleryImage) => (
          <div 
            key={image.id} 
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={image.url}
              alt={image.alt || 'Gallery image'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {hasPermission("MANAGE_GALLERY") && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => setSelectedImage(image)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="space-y-4">
              <div className="aspect-video relative">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.alt || 'Gallery image'}
                  fill
                  className="object-contain"
                />
              </div>
              <Button asChild className="w-full">
                <Link href={`/startups/${startup.id}/gallery/${selectedImage.id}/edit`}>
                  Edit Image Details
                </Link>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}