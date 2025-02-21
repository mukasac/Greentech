import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Plus, ImagePlus, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface GallerySectionProps {
  startup: any; // Replace with proper type
}

export function GallerySection({ startup }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<any>(null);

  if (!startup?.gallery?.length) {
    return (
      <Card className="mt-6">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 rounded-full bg-muted p-6">
            <ImagePlus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">No Gallery Images Yet</h2>
          <p className="mb-6 text-center text-muted-foreground">
            Add your first image to showcase your startup.
          </p>
          <Button asChild>
            <Link href={`/startups/${startup.id}/gallery/add`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery</h2>
        <Button asChild>
          <Link href={`/startups/${startup.id}/gallery/add`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Image
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {startup.gallery.map((image: any) => (
          <Card key={image.id} className="overflow-hidden">
            <div 
              className="aspect-video cursor-pointer relative group"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary" asChild>
                  <Link href={`/startups/${startup.id}/gallery/${image.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm font-medium">{image.alt}</p>
              {image.caption && (
                <p className="text-sm text-muted-foreground mt-1">{image.caption}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <>
              <DialogTitle>{selectedImage.alt}</DialogTitle>
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  className="h-full w-full object-contain"
                />
              </div>
              {selectedImage.caption && (
                <DialogDescription>
                  {selectedImage.caption}
                </DialogDescription>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}