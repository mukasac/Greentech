// app/regions/[region]/page.tsx
import { notFound } from "next/navigation";
import { RegionHeader } from "@/components/regions/region-header";
import { RegionService } from "@/lib/services/region-service";
import { RegionInitiatives } from "@/components/regions/ecosystem/region-initiatives";
import { RegionPartners } from "@/components/regions/ecosystem/region-partners";
import { RegionInvestments } from "@/components/regions/ecosystem/region-investments";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Briefcase, Calendar } from "lucide-react";

export async function generateStaticParams() {
  const regions = await RegionService.getAllRegions();
  return regions.map((region) => ({
    region: region.slug,
  }));
}

export default async function RegionPage({ params }: { params: { region: string } }) {
  try {
    // Get region data using the service
    const { region } = await RegionService.getRegionData(params.region);
    
    if (!region) {
      notFound();
    }

    // Single statistics section
    const stats = region.stats || { startups: 0, openJobs: 0, upcomingEvents: 0 };

    return (
      <div>
        {/* Region Header with Hero Image */}
        <RegionHeader region={region} regionSlug={params.region} />
        
        <div className="container py-8">
          {/* Single Region Statistics Section */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                    <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{stats.startups || 40}</div>
                    <div className="text-muted-foreground">Active Startups</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
                    <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{stats.openJobs || 80}</div>
                    <div className="text-muted-foreground">Open Positions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-3">
                    <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{stats.upcomingEvents || 30}</div>
                    <div className="text-muted-foreground">Upcoming Events</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Integrated Ecosystem Content */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Ecosystem Overview</h2>
            
            {/* Initiatives Section */}
            {region.initiatives && region.initiatives.length > 0 && (
              <div className="mb-16">
                <RegionInitiatives initiatives={region.initiatives} />
              </div>
            )}
            
            {/* Partners Section */}
            {region.ecosystemPartners && region.ecosystemPartners.length > 0 && (
              <div className="mb-16">
                <RegionPartners partners={region.ecosystemPartners} />
              </div>
            )}
            
            {/* Investments Section */}
            <div className="mb-16">
              <RegionInvestments region={region} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error in RegionPage for ${params.region}:`, error);
    notFound();
  }
}