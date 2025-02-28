"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SlugBasedEditRedirect({ params }: { params: { slug: string } }) {
  const router = useRouter();
  
  useEffect(() => {
    // This is a redirect handler for slug-based edit URLs
    // It will fetch the region ID from the slug and redirect to the ID-based edit URL
    
    const fetchRegionId = async () => {
      try {
        // Try to get the region ID from the slug
        const response = await fetch(`/api/regions/${params.slug}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.region && data.region.id) {
            // Redirect to the ID-based edit URL
            router.replace(`/admin/regions/${data.region.id}/edit`);
            return;
          }
        }
        
        // If we can't find the region or there's any error, redirect back to regions list
        console.error("Couldn't find region ID for slug:", params.slug);
        router.replace("/admin/regions");
      } catch (error) {
        console.error("Error in slug redirect:", error);
        router.replace("/admin/regions");
      }
    };
    
    fetchRegionId();
  }, [params.slug, router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Redirecting to editor...</p>
      </div>
    </div>
  );
}