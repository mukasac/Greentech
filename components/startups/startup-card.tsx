"use client";

import { Startup } from "@/lib/types/startup";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePermissions } from "@/hooks/usePermissions";

interface StartupCardProps {
  startup: Startup;
}

const DEFAULT_LOGO = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1974&auto=format&fit=crop";

export function StartupCard({ startup }: StartupCardProps) {
  const { hasPermission } = usePermissions();
  
  if (!startup) return null;

  return (
    <Link href={`/startups/${startup.id}`} className="block h-full w-full max-w-[95%] mx-auto sm:max-w-full group">
      <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col items-center">
            <div className="h-24 sm:h-28 md:h-32 w-full overflow-hidden rounded-md relative">
              <Image
                src={startup.logo || DEFAULT_LOGO}
                alt={startup.name || "Startup logo"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-3 sm:mt-4 text-center w-full">
              <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary line-clamp-1">{startup.name}</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-2 px-3 sm:px-4">
          {/* Main stats one per line */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Founded {startup.founded}</span>
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <Globe className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{startup.country}</span>
            </div>
          </div>
          
          <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-1 sm:gap-2">
            {startup.tags?.slice(0, 3).map((tag, index) => (
              <Badge 
                key={`${tag}-${index}`}
                variant="secondary"
                className="text-xs px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-3 sm:pt-4 flex flex-col items-center px-3 sm:px-4">
          <div className="w-full flex justify-center gap-2">
            {hasPermission("CLAIM_STARTUP") && (
              <Button
                variant="outline"
                size="sm"
                className="w-3/4 sm:w-auto text-xs sm:text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  window.location.href = `/startups/${startup.id}/claim`;
                }}
              >
                Claim Startup
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}