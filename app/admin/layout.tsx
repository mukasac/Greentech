// app/admin/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Newspaper, 
  Users, 
  Settings, 
  Calendar, 
  Briefcase, 
  Building,
  MapPin,    // Add this
  List,      // Add this
  BarChart, 
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redirect if not authenticated or not a site admin
    if (status === "unauthenticated") {
      router.push("/auth");
    } else if (status === "authenticated" && 
              !session?.user?.permissions?.includes("SITE_ADMIN")) {
      router.push("/unauthorized");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen">
        {/* Sidebar skeleton */}
        <div className="hidden w-64 border-r md:block">
          <div className="p-6">
            <Skeleton className="h-8 w-32" />
            <div className="mt-8 space-y-4">
              {Array(6).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </div>
        </div>
        
        {/* Main content skeleton */}
        <div className="flex-1 p-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Only render if authenticated and has admin access
  if (status !== "authenticated" || !session?.user?.permissions?.includes("ADMIN_ACCESS")) {
    return null;
  }

  const menuItems = [
    { 
      title: "Dashboard", 
      href: "/admin", 
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      exact: true
    },
    { 
      title: "News", 
      href: "/admin/news", 
      icon: <Newspaper className="mr-2 h-4 w-4" />,
      exact: false
    },
    { 
      title: "Users", 
      href: "/admin/users", 
      icon: <Users className="mr-2 h-4 w-4" />,
      exact: false
    },
    { 
      title: "Events", 
      href: "/admin/events", 
      icon: <Calendar className="mr-2 h-4 w-4" />,
      exact: false
    },
    { 
      title: "Jobs", 
      href: "/admin/jobs", 
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      exact: false
    },
    { 
      title: "Startups", 
      href: "/admin/startups", 
      icon: <Building className="mr-2 h-4 w-4" />,
      exact: false
    },
    { 
      title: "Regions", 
      href: "/admin/regions", 
      icon: <MapPin className="mr-2 h-4 w-4" />,
      exact: false,
      submenu: [
        {
          title: "All Regions",
          href: "/admin/regions",
          icon: <List className="mr-2 h-4 w-4" />,
        },
        {
          title: "Statistics",
          href: "/admin/regions/stats",
          icon: <BarChart className="mr-2 h-4 w-4" />,
        }
       
      ]
    },
    { 
      title: "Settings", 
      href: "/admin/settings", 
      icon: <Settings className="mr-2 h-4 w-4" />,
      exact: false
    },
  ];

  const isActive = (item: typeof menuItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden w-64 border-r md:block">
        <ScrollArea className="h-full">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Admin Console</h2>
            <p className="text-xs text-muted-foreground">
              Manage platform content and users
            </p>
            
            <nav className="mt-8 space-y-1.5">
              {menuItems.map((item) => (
                <Button
                  key={item.href}
                  variant={isActive(item) ? "secondary" : "ghost"}
                  size="sm"
                  asChild
                  className="w-full justify-start"
                >
                  <Link href={item.href}>
                    {item.icon}
                    {item.title}
                    {isActive(item) && (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </Link>
                </Button>
              ))}
            </nav>
            
            <div className="mt-8 pt-8 border-t">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/">Return to Site</Link>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* Mobile sidebar button */}
      <div className="md:hidden absolute top-20 left-4 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            // You could implement a mobile drawer here
            // or redirect to a separate navigation page
          }}
        >
          <LayoutDashboard className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}