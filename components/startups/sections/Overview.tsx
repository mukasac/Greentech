// components/startups/sections/Overview.tsx
"use client";

import { Startup } from "@/lib/types/startup";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  Globe, 
  Briefcase, 
  FileText, 
  Eye,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";

interface OverviewProps {
  startup: Startup;
}

export function Overview({ startup }: OverviewProps) {
  const { hasPermission } = usePermissions();

  const stats = [
    {
      title: "Team Members",
      value: startup.team.leadership?.length || 0,
      icon: Users,
      link: "/startups/dashboard/team",
      permission: "VIEW_TEAM_MEMBERS"
    },
    {
      title: "Active Jobs",
      value: startup.jobs?.length || 0,
      icon: Briefcase,
      link: "/startups/dashboard/jobs",
      permission: "VIEW_JOBS"
    },
    {
      title: "Gallery Items",
      value: startup.gallery?.length || 0,
      icon: ImageIcon,
      link: "/startups/dashboard/gallery",
      permission: "VIEW_GALLERY"
    },
    {
      title: "Documents",
      value: "0", // Add this once we have documents implementation
      icon: FileText,
      link: "/startups/dashboard/documents",
      permission: "VIEW_DOCUMENTS"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          if (!hasPermission(stat.permission)) return null;
          
          return (
            <Link key={stat.title} href={stat.link}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">{stat.title}</h3>
                    </div>
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Company Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-lg font-medium">Company Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>Founded {startup.founded}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{startup.employees} employees</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>{startup.country}</span>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{startup.mainCategory}</Badge>
                    {startup.categories?.map((category) => (
                      <Badge key={category} variant="secondary">{category}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium">Sustainability Impact</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {startup.sustainability?.impact || "No impact statement provided."}
              </p>
              {startup.sustainability?.sdgs && startup.sustainability.sdgs.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-medium">SDG Goals</h4>
                  <div className="flex flex-wrap gap-2">
                    {startup.sustainability.sdgs.map((sdg) => (
                      <Badge key={sdg} variant="outline">SDG {sdg}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-lg font-medium">Technology & Focus Areas</h3>
          <div className="flex flex-wrap gap-2">
            {startup.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}