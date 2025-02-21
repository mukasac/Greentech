"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Trash2 } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  file?: File | null;
}

interface GalleryUploadProps {
  onChange: (images: { file: File; alt: string; caption: string | null }[]) => void;
}

export function GalleryUpload({ onChange }: GalleryUploadProps) {
  const [images, setImages] = useState<GalleryImage[]>([
    {
      id: "1",
      url: "",
      alt: "",
      caption: "",
      file: null,
    },
  ]);

  const addImage = () => {
    const newImage = {
      id: Date.now().toString(),
      url: "",
      alt: "",
      caption: "",
      file: null,
    };
    const updatedImages = [...images, newImage];
    setImages(updatedImages);
    // updateParent(updatedImages);
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter((image) => image.id !== id);
    setImages(updatedImages);
    updateParent(updatedImages);
  };

  const handleFileChange = async (id: string, file: File) => {
    const url = URL.createObjectURL(file);

    const updatedImages = images.map((image) =>
      image.id === id
        ? {
            ...image,
            url,
            file,
            alt: file.name, // Use filename as default alt text
          }
        : image
    );

    setImages(updatedImages);
    updateParent(updatedImages);
  };

  const handleChange = (
    id: string,
    field: "alt" | "caption",
    value: string
  ) => {
    const updatedImages = images.map((image) =>
      image.id === id ? { ...image, [field]: value } : image
    );
    setImages(updatedImages);
    updateParent(updatedImages);
  };

  const updateParent = (images: GalleryImage[]) => {
    const galleryData = images
      .filter(image => image.file)
      .map(image => ({
        file: image.file!,
        alt: image.alt,
        caption: image.caption || null
      }));
    onChange(galleryData);
  };


  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Gallery Images</h3>
              <Button type="button" onClick={addImage} size="sm">
                <ImagePlus className="mr-2 h-4 w-4" />
                Add Image
              </Button>
            </div>

            {images.map((image) => (
              <div key={image.id} className="space-y-4 rounded-lg border p-4">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Image</Label>
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileChange(image.id, file);
                        }
                      }}
                      required
                    />
                    {image.url && (
                      <img 
                        src={image.url} 
                        alt={image.alt}
                        className="mt-2 max-h-40 rounded-lg object-cover"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Alt Text</Label>
                    <Input
                      value={image.alt}
                      onChange={(e) => handleChange(image.id, 'alt', e.target.value)}
                      placeholder="Describe the image for accessibility"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Caption</Label>
                    <Input
                      value={image.caption || ''}
                      onChange={(e) => handleChange(image.id, 'caption', e.target.value)}
                      placeholder="Add a caption (optional)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

}
