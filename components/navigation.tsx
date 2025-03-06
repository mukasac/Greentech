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
import { Leaf, UserCog, Menu, X } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const regions: { title: string; href: string; description: string }[] = [
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
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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

  // Navigation links used in both desktop and mobile
  const navLinks = [
    { label: "Startups", href: "/startups" },
    { label: "Events", href: "/events" },
    { label: "News", href: "/news" },
    { label: "Jobs", href: "/jobs" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
          <span className="font-bold text-sm sm:text-base">GreenTech Nordics</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Regions</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {regions.map((region) => (
                    <ListItem
                      key={region.title}
                      title={region.title}
                      href={region.href}
                    >
                      {region.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link href={link.href} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {link.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] sm:w-[350px]">
            <div className="flex flex-col gap-6 pt-6">
              <Link 
                href="/" 
                className="flex items-center space-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Leaf className="h-5 w-5 text-green-600" />
                <span className="font-bold">GreenTech Nordics</span>
              </Link>
              
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <h3 className="mb-2 font-semibold text-lg">Regions</h3>
                  <div className="space-y-1 pl-1">
                    {regions.map((region) => (
                      <Link 
                        key={region.title} 
                        href={region.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-muted-foreground hover:text-foreground"
                      >
                        {region.title}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 font-medium hover:bg-accent rounded-md"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <ModeToggle />

          {status === "unauthenticated" ? (
            <Link href="/auth">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-sm">
                Login
              </Button>
            </Link>
          ) : status === "authenticated" && session?.user ? (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger className="focus:outline-none">
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 bg-slate-600">
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
                  
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
      
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