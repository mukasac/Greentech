"use client";

import { useState } from "react";
import { StartupImage } from "@/lib/types/startup";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface StartupGalleryProps {
  images: StartupImage[];
}

export function StartupGallery({ images }: StartupGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<StartupImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => {
              setSelectedImage(image);
              setCurrentIndex(index);
            }}
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            <img
              src={image.url}
              alt={image.alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {image.caption && (
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-sm text-white">{image.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog
        open={selectedImage !== null}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl">
          <div className="relative aspect-video">
            <img
              src={images[currentIndex]?.url}
              alt={images[currentIndex]?.alt}
              className="h-full w-full object-contain"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {images[currentIndex]?.caption && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {images[currentIndex].caption}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}