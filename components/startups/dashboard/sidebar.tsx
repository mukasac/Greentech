"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";

import {
  BarChart,
  Building2,
  FileText,
  Image,
  Settings,
  Users,
  Briefcase,
  PenLine,
  LayoutDashboard,
} from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { hasPermission } = usePermissions();

  const items = [
    {
      title: "Dashboard",
      href: "/startups/dashboard",
      icon: LayoutDashboard,
      permission: "STARTUP_VIEW",
    },
    {
      title: "Profile",
      href: "/startups/dashboard/profile",
      icon: Building2,
      permission: "STARTUP_VIEW",
    },
    {
      title: "Team",
      href: "/startups/dashboard/team",
      icon: Users,
      permission: "VIEW_TEAM_MEMBERS",
    },
    {
      title: "Jobs",
      href: "/startups/dashboard/jobs",
      icon: Briefcase,
      permission: "VIEW_JOBS",
    },
    {
      title: "Gallery",
      href: "/startups/dashboard/gallery",
      icon: Image,
      permission: "VIEW_GALLERY",
    },
    {
      title: "Blog",
      href: "/startups/dashboard/blog",
      icon: PenLine,
      permission: "VIEW_BLOG",
    },
    {
      title: "Analytics",
      href: "/startups/dashboard/analytics",
      icon: BarChart,
      permission: "STARTUP_VIEW",
    },
    {
      title: "Documents",
      href: "/startups/dashboard/documents",
      icon: FileText,
      permission: "STARTUP_VIEW",
    },
    {
      title: "Settings",
      href: "/startups/dashboard/settings",
      icon: Settings,
      permission: "STARTUP_VIEW",
    },
  ];
  
  return (
    <nav className="grid items-start gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        // Skip items that the user doesn't have permission for
        if (item.permission && !hasPermission(item.permission)) {
          return null;
        }
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}