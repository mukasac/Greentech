// app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Leaf, LineChart, Users, Rocket } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";
import { NewsList } from "@/components/news/news-list";

export default function Home() {
  const { data: session, status } = useSession();
  const { hasPermission } = usePermissions();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1473773508845-188df298d2d1')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container relative px-4 sm:px-6 py-12 sm:py-16 md:py-24 text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Driving Nordic Green Innovation
          </h1>
          <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-gray-300 px-4">
            Connect with the leading sustainable technology ecosystem across
            Norway, Sweden, Denmark, Finland, and Iceland.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-8">
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold">
                Sustainable Solutions
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Discover innovative green technologies and sustainable solutions
                from across the Nordic region.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold">
                Network & Collaborate
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Connect with industry leaders, startups, and researchers in the
                green technology sector.
              </p>
            </CardContent>
          </Card>
          <Card className="sm:col-span-2 md:col-span-1">
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                <LineChart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold">Market Insights</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Access comprehensive market analysis and trends in Nordic green
                technology.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="border-t bg-muted/50">
        {/* container */}
      </section>

      {/* Latest News Section */}
      {hasPermission("VIEW_LATEST_NEWS") && (
        <section className="border-t py-10 sm:py-16 px-4 sm:px-6 md:px-8">
          <div className="mb-6 sm:mb-8 flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Latest News</h2>
            <Button variant="ghost" asChild className="gap-1 sm:gap-2 text-sm sm:text-base">
              <Link href="/news">
                View All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </div>
          
          {/* News List Component that fetches data from our API */}
          <NewsList limit={3} />
        </section>
      )}
    </div>
  );
}