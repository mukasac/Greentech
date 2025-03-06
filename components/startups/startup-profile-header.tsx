import { Startup } from "@/lib/types/startup";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface StartupProfileHeaderProps {
  startup: Startup;
}

export function StartupProfileHeader({ startup }: StartupProfileHeaderProps) {
  const DEFAULT_LOGO = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1974&auto=format&fit=crop";
  const DEFAULT_COVER = "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80";
  
  return (
    <div className="relative mb-12 sm:mb-16">
      {/* Custom profile cover image with fixed height */}
      <div className="h-32 sm:h-40 md:h-48 w-full overflow-hidden rounded-b-lg">
        <Image
          src={startup.profileImage || DEFAULT_COVER}
          alt={`${startup.name} cover`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      
      {/* Centered logo and company information */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 sm:-bottom-16 flex flex-col items-center space-y-4">
        {/* Logo container */}
        <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 overflow-hidden rounded-xl border-4 border-background shadow-md bg-background">
          <Image
            src={startup.logo || DEFAULT_LOGO}
            alt={startup.name || "Startup logo"}
            width={112}
            height={112}
            className="h-full w-full object-contain"
          />
        </div>
        
        {/* Company name and tags below logo */}
        <div className="flex flex-col items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
            {startup.name}
          </h1>
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mt-2">
            {startup.tags?.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="shadow text-xs sm:text-sm px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}