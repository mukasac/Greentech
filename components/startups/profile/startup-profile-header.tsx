"use client";

import { Startup } from "@/lib/types/startup";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, Calendar, Users, Building2 } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

interface StartupProfileHeaderProps {
  startup: Startup;
}

export function StartupProfileHeader({ startup }: StartupProfileHeaderProps) {
  const { hasPermission } = usePermissions();

  return (
    <div className="border-b bg-background w-full">
      <div className="max-w-screen-xl mx-auto py-4 sm:py-6 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          {/* Logo */}
          <div className="h-16 w-16 sm:h-20 md:h-24 sm:w-20 md:w-24 overflow-hidden rounded-lg border bg-white p-1 sm:p-2 mx-auto sm:mx-0">
            <img
              src={startup.logo}
              alt={startup.name}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Main Info */}
          <div className="flex-1">
            <div className="mb-3 sm:mb-4 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold">{startup.name}</h1>
              <p className="mt-1 text-sm sm:text-base text-muted-foreground">
                {startup.description}
              </p>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  {new URL(startup.website).hostname}
                </a>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <span>{startup.country}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <span>Founded {startup.founded}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <span>{startup.employees} employees</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <span>{startup.mainCategory.replace("-", " ")}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center sm:justify-start mt-4 sm:mt-0">
            {hasPermission("STARTUP_VIEW") && (
              <Button size="sm" className="w-full sm:w-auto text-xs sm:text-sm" asChild>
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}