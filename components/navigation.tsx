// components/navigation.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { Leaf, UserCog } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePermissions } from "@/hooks/usePermissions";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Norway",
    href: "/regions/norway",
    description:
      "Explore green tech innovations and sustainable initiatives in Norway.",
  },
  {
    title: "Sweden",
    href: "/regions/sweden",
    description:
      "Discover Sweden's leading sustainable technology projects and policies.",
  },
  {
    title: "Denmark",
    href: "/regions/denmark",
    description:
      "Learn about Denmark's green energy solutions and circular economy.",
  },
  {
    title: "Finland",
    href: "/regions/finland",
    description:
      "Stay updated with Finland's cleantech advancements and research.",
  },
  {
    title: "Iceland",
    href: "/regions/iceland",
    description:
      "Explore Iceland's renewable energy and sustainable practices.",
  },
];

export function Navigation() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { hasPermission } = usePermissions();

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
      });
      router.push("/auth");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-10 flex h-16 items-center w-screen overflow-hidden">
        <Link href="/" className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="font-bold">GreenTech Nordics</span>
        </Link>

        <NavigationMenu className="mx-6">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Regions</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 fixed p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] z-50"
                    style={{
                      zIndex: 100,
                      position: "fixed",
                      background: "black",
                    }}>
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/startups" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Startups
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/events" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Events
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/news" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  News
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/jobs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Jobs
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto mr-10 flex items-center space-x-4">
          <ModeToggle />
        </div>

        <div className="flex items-center space-x-4">
          {status === "unauthenticated" ? (
            <Link href="/auth">
              <button className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                Login
              </button>
            </Link>
          ) : status === "authenticated" && session?.user ? (
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger className="focus:outline-none">
                        <Avatar className="h-8 w-8 bg-slate-600">
                          <AvatarFallback>
                            {getInitials(session.user.name || session.user.email)}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{session.user.name || session.user.email}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/startups/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {hasPermission("ADMIN_ACCESS") && (
                <Link href="/roles/roleManagement">
                  <button className="flex items-center justify-center p-2 text-white rounded-md hover:bg-slate-700 transition-colors">
                    <UserCog className="h-5 w-5" />
                  </button>
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";