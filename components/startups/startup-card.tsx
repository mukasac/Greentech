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
import { Calendar, Globe, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface StartupCardProps {
  startup: Startup;
}

const DEFAULT_LOGO = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1974&auto=format&fit=crop";

export function StartupCard({ startup }: StartupCardProps) {
  if (!startup) return null;

  // Check if the startup has been claimed (has a userId associated with it)
  const isClaimed = Boolean(startup.userId);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <Link href={`/startups/${startup.id}`}>
          <div className="aspect-video overflow-hidden rounded-md relative">
            <Image
              src={startup.logo || DEFAULT_LOGO}
              alt={startup.name || "Startup logo"}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold hover:text-primary">{startup.name}</h3>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Founded {startup.founded}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {startup.employees} employees
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            {startup.country}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {startup.tags?.slice(0, 3).map((tag, index) => (
            <Badge key={`${tag}-${index}`} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        
        {!isClaimed && (
          <Button variant="outline" asChild>
            <Link href={`/startups/${startup.id}/claim`}>
              Claim Startup
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}