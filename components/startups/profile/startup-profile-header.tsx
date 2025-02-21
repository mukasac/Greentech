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
    <div className="border-b bg-background">
      <div className="container py-6">
        <div className="flex items-start gap-6">
          {/* Logo */}
          <div className="h-24 w-24 overflow-hidden rounded-lg border bg-white p-2">
            <img
              src={startup.logo}
              alt={startup.name}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Main Info */}
          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-2xl font-bold">{startup.name}</h1>
              <p className="mt-1 text-muted-foreground">
                {startup.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  {new URL(startup.website).hostname}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{startup.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Founded {startup.founded}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{startup.employees} employees</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{startup.mainCategory.replace("-", " ")}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {hasPermission("STARTUP_VIEW") && (
              <Button asChild>
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
