"use client";
import { Region } from "@/lib/types/region";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";


interface RegionHeaderProps {
  region: Region;
}

export function RegionHeader({ region }: RegionHeaderProps) {
  const { hasPermission } = usePermissions();

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-cover bg-center" style={{ 
        backgroundImage: `url(${region.coverImage})` 
      }}>
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      <div className="container relative py-24">
        <div className="max-w-2xl">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {region.name}
          </h1>
          <p className="mb-8 text-lg text-gray-300">
            {region.description}
          </p>
          <div className="flex flex-wrap gap-4">
            {hasPermission('STARTUP_CREATE') && (
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href={`/startups/create?region=${region.slug}`}>
                Launch Your Startup
              </Link>
            </Button>
             )}
            {/* <Button variant="outline" size="lg" className="bg-white/10 text-white hover:bg-white/20">
              <Link href={`/regions/${region.slug}/ecosystem`}>
                Explore Ecosystem
              </Link>
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}