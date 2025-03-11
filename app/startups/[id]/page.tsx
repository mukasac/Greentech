"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StartupProfileHeader } from "@/components/startups/startup-profile-header";
import { StartupTeam } from "@/components/startups/profile/startup-team";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobCard } from "@/components/jobs/job-card";
import { BlogCard } from "@/components/blog/blog-card";
import { StartupGallery } from "@/components/startups/startup-gallery";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import { 
  Calendar, 
  Globe, 
  Users, 
  Building2, 
  Banknote, 
  Loader2, 
  Circle,
  TrendingUp,
  BarChart,
  Leaf,
  Workflow,
  ShieldCheck,
  CloudCog,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Droplets, 
  Recycle,
  TreePine,
  Wind,
  Factory,
  Timer,
  GaugeCircle,
  Sparkles,
  FileBadge,
  PackageOpen,
  Mountain,
  Bug,
  Sprout,
  Trees,
  Heart,
  Info,
  ExternalLink
} from "lucide-react";
import { ClimateImpactDisplay } from "@/components/startups/profile/climate-impact-display";
import { type ClimateImpact } from "@/lib/types/startup";
import { ReactNode } from "react";

// Helper component for rendering badges list
const BadgeList = ({ items, icon: Icon, color }: { items: string[], icon: React.ElementType, color: string }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {items.filter(item => item !== null && item !== undefined && item !== "").map((item) => (
        <Badge key={item} variant="outline" className="flex items-center gap-1 text-xs p-1.5">
          <Icon className="h-3.5 w-3.5" style={{ color }} />
          <span className="truncate max-w-[150px] sm:max-w-full">{item}</span>
        </Badge>
      ))}
    </div>
  );
};

// Define types for metric data
interface Metric {
  key: string;
  label: string;
  value: string | number;
  unit: string;
}

export default function StartupProfilePage({ params }: { params: { id: string } }) {
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Separate state variables for main and subtabs
  const [mainTab, setMainTab] = useState("overview");
  const [sustainabilitySubTab, setSustainabilitySubTab] = useState("impact");
  
  // New state for showing all metrics
  const [showAllMetrics, setShowAllMetrics] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const response = await fetch(`/api/startups/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch startup");
        }
        const data = await response.json();
        setStartup(data);
      } catch (error) {
        console.error("Error fetching startup:", error);
        setError("Failed to load startup profile");
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
    
    // Check if the user is on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [params.id]);

  // Function to get a small set of key metrics for spotlight section
  const getKeyClimateMetrics = (): Metric[] => {
    if (!startup?.climateImpacts || startup.climateImpacts.length === 0) {
      return [];
    }
    
    // Get the most recent active impact
    const impact = startup.climateImpacts
      .filter((imp: any) => imp.isActive)
      .sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      
    if (!impact) return [];
    
    // Helper function to get metric value
    const getMetricValue = (key: string, fromLifecycle = false): string | number | undefined => {
      let value;
      
      if (fromLifecycle) {
        // Check in lifecycle object
        if (impact.lifecycle && key in impact.lifecycle) {
          value = impact.lifecycle[key];
        }
      } else {
        // First check in metrics object (new format)
        if (impact.metrics && typeof impact.metrics === 'object' && key in impact.metrics) {
          value = impact.metrics[key];
        } 
        // Then check direct properties (old format)
        else if (key in impact) {
          value = impact[key];
        }
      }
      
      // Filter out empty values
      if (value === 0 || value === null || value === undefined) return undefined;
      if (typeof value === 'string' && (value === "" || value === "0" || value.toString() === "0%")) return undefined;
      
      return value;
    };
    
    // Create an array of potential metrics
    const potentialMetrics: Metric[] = [
      { key: 'co2Reduction', label: 'CO₂ Reduction', value: getMetricValue('co2Reduction') as string | number, unit: 'tons/year' },
      { key: 'waterSaved', label: 'Water Saved', value: getMetricValue('waterSaved') as string | number, unit: 'L/year' },
      { key: 'energyEfficiency', label: 'Energy Efficiency', value: getMetricValue('energyEfficiency') as string | number, unit: '%' },
      { key: 'wasteDiverted', label: 'Waste Diverted', value: getMetricValue('wasteDiverted') as string | number, unit: 'tons/year' },
      { key: 'recycledMaterials', label: 'Recycled Materials', value: getMetricValue('recycledMaterials', true) as string | number, unit: '%' },
      { key: 'productLifespan', label: 'Product Lifespan', value: getMetricValue('productLifespan', true) as string | number, unit: 'years' },
      { key: 'carbonCaptured', label: 'Carbon Captured', value: getMetricValue('carbonCaptured') as string | number, unit: 'tons/year' },
      { key: 'plasticReduction', label: 'Plastic Reduction', value: getMetricValue('plasticReduction') as string | number, unit: 'tons/year' },
      { key: 'circularEconomyContribution', label: 'Circular Economy', value: getMetricValue('circularEconomyContribution') as string | number, unit: 'tons' }
    ].filter(metric => metric.value !== undefined) as Metric[];
    
    // Filter out metrics with no values and return up to 3
    return potentialMetrics.slice(0, 3);
  };

  // Function to get metric icon color
  const getMetricIconColor = (metricKey: string): string => {
    const iconMap: Record<string, string> = {
      co2Reduction: "#10b981",
      waterSaved: "#0ea5e9",
      energyEfficiency: "#3b82f6",
      wasteDiverted: "#10b981",
      recycledMaterials: "#10b981",
      productLifespan: "#f59e0b",
      carbonCaptured: "#10b981",
      plasticReduction: "#10b981",
      circularEconomyContribution: "#10b981"
    };
    
    return iconMap[metricKey] || "#10b981";
  };

  // Function to get metric icon component
  const getMetricIcon = (metricKey: string, color: string): ReactNode => {
    const iconMap: Record<string, () => ReactNode> = {
      co2Reduction: () => <CloudCog className="h-4 w-4" style={{ color }} />,
      waterSaved: () => <Droplets className="h-4 w-4" style={{ color }} />,
      energyEfficiency: () => <GaugeCircle className="h-4 w-4" style={{ color }} />,
      wasteDiverted: () => <Recycle className="h-4 w-4" style={{ color }} />,
      recycledMaterials: () => <Recycle className="h-4 w-4" style={{ color }} />,
      productLifespan: () => <Timer className="h-4 w-4" style={{ color }} />,
      carbonCaptured: () => <CloudCog className="h-4 w-4" style={{ color }} />,
      plasticReduction: () => <PackageOpen className="h-4 w-4" style={{ color }} />,
      circularEconomyContribution: () => <Workflow className="h-4 w-4" style={{ color }} />
    };
    
    const IconComponent = iconMap[metricKey] || (() => <Leaf className="h-4 w-4" style={{ color }} />);
    return IconComponent();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold mb-2">Startup Not Found</h2>
            <p className="text-muted-foreground mb-4 text-center">
              The startup you are looking for does not exist or has been removed.
            </p>
            <Button onClick={() => router.push("/startups")}>
              Back to Startups
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper function to determine if the climate impact has specific metrics
  const hasClimateMetric = (metricType: string) => {
    if (!startup.climateImpacts || startup.climateImpacts.length === 0) return false;
    
    const impact = startup.climateImpacts
      .filter((imp: any) => imp.isActive)
      .sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      
    if (!impact) return false;

    // Check for SDGs
    if (metricType === "sdgs") {
      return impact.sdgs && 
             impact.sdgs.length > 0 && 
             impact.sdgs.some((sdg: any) => sdg !== null && sdg !== undefined && sdg !== "");
    }
    
    // Check different types of metrics
    switch (metricType) {
      case "impact":
        return Object.entries(impact).some(([key, value]) => 
          ["co2Reduction", "waterSaved", "wasteDiverted", "energyEfficiency"].includes(key) && 
          value !== null && value !== undefined && value !== "" && value !== 0
        );
      case "lifecycle":
        return impact.lifecycle && Object.keys(impact.lifecycle).length > 0;
      case "certifications":
        return impact.certifications && impact.certifications.length > 0 &&
          impact.certifications.some((cert: any) => cert !== null && cert !== undefined && cert !== "");
      case "carbon":
        return impact.carbonCaptured || 
          (impact.lifecycle && impact.lifecycle.lifecycleCo2Reduction) || 
          (impact.offsetPrograms && impact.offsetPrograms !== "");
      default:
        return false;
    }
  };

  // Switch to a specific subtab and ensure main tab is set to sustainability
  const navigateToSubtab = (subtab: string) => {
    setMainTab("sustainability");
    setSustainabilitySubTab(subtab);
    
    // Reset all metrics view when changing tabs
    setShowAllMetrics(false);
  };
  
  // Function to show all metrics and tabs
  const handleViewAllMetrics = () => {
    setMainTab("sustainability");
    setShowAllMetrics(true);
  };

  return (
    <div>
      {/* Full-width header on all screens - no divider */}
      <div className="w-full">
        <StartupProfileHeader startup={startup} />
      </div>
      
      <div className="py-6 md:py-8">
        {/* Company Description - Full width with no container on desktop */}
        <div className="px-4 md:px-6 lg:px-8">
          <section className="mb-6 md:mb-8">
            <h2 className="mb-3 md:mb-4 text-xl md:text-2xl font-semibold">About </h2>
            {startup.description && (
              <div className="text-muted-foreground text-sm md:text-base">
                {startup.description.split(" ").length > 40 ? (
                  <p>
                    {showFullDescription 
                      ? startup.description 
                      : `${startup.description.split(" ").slice(0, 40).join(" ")}...`}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary ml-1 inline-flex align-baseline"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                    >
                      {showFullDescription ? "Show Less" : "Read More"}
                    </Button>
                  </p>
                ) : (
                  <p>{startup.description}</p>
                )}
              </div>
            )}
            
            {/* Quick Stats - Grid layout with 3 items per row on mobile */}
            <div className="mt-4 md:mt-6 grid grid-cols-3 gap-y-3 gap-x-2 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
              <div className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span className="truncate">Founded {startup.founded}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm text-muted-foreground">
                <Users className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span className="truncate">{startup.employees} employees</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm text-muted-foreground">
                <Globe className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span className="truncate">{startup.country}</span>
              </div>

              {/* Stage information integrated into the grid */}
              {startup.startupStage && (
                <div className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm text-muted-foreground">
                  <Circle className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="truncate">Stage: {startup.startupStage}</span>
                </div>
              )}
              {startup.investmentStage && (
                <div className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm text-muted-foreground">
                  <Banknote className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="truncate">Investment: {startup.investmentStage}</span>
                </div>
              )}
              {startup.fundingNeeds && (
                <div className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm text-muted-foreground">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="truncate">Funding: {startup.fundingNeeds}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm text-muted-foreground">
                <Banknote className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span className="truncate">Funding: {startup.funding}</span>
              </div>
              
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm text-primary hover:underline"
              >
                <Globe className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span className="truncate">Visit Website</span>
              </a>
            </div>
          </section>
        </div>
        
        {/* Single divider line between sections */}
        <div className="w-full h-px bg-border mt-6 mb-0"></div>

        {/* Responsive Tabs Navigation - Full width on all screens */}
        <Tabs 
          value={mainTab} 
          onValueChange={setMainTab} 
          className="w-full"
        >
          {/* Mobile Tabs - Horizontal Layout (visible only on small screens) */}
          <div className="md:hidden px-4 mb-4 mt-6">
            <TabsList className="w-full justify-start border-b rounded-none px-0 overflow-x-auto">
              <TabsTrigger 
                value="overview" 
                className="text-sm"
                onClick={() => setShowAllMetrics(false)}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="sustainability" 
                className="text-sm"
                onClick={() => setShowAllMetrics(false)}
              >
                Sustainability Metrics
              </TabsTrigger>
              <TabsTrigger value="team" className="text-sm">Team</TabsTrigger>
              {startup.blogPosts && startup.blogPosts.length > 0 && (
                <TabsTrigger value="updates" className="text-sm">Updates</TabsTrigger>
              )}
              {startup.jobs && startup.jobs.length > 0 && (
                <TabsTrigger value="jobs" className="text-sm">Open Positions</TabsTrigger>
              )}
            </TabsList>
          </div>
          
          {/* Desktop Layout - Grid with vertical tabs directly at edge */}
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-6">
            {/* Sidebar with vertical tabs (hidden on mobile, flush with edge on desktop) */}
            <div className="hidden md:block md:col-span-3 lg:col-span-2">
              <div className="sticky top-4 pt-6">
                <TabsList className="flex flex-col h-auto w-full rounded-r-md rounded-l-none p-0 space-y-1 border-r">
                  <TabsTrigger 
                    value="overview" 
                    className="justify-start text-base px-6 py-2 h-auto data-[state=active]:bg-background rounded-none text-left"
                    onClick={() => setShowAllMetrics(false)}
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="sustainability" 
                    className="justify-start text-base px-6 py-2 h-auto data-[state=active]:bg-background rounded-none text-left"
                    onClick={() => setShowAllMetrics(false)}
                  >
                    Sustainability Metrics
                  </TabsTrigger>
                  
                  {/* Now we'll create a nested menu for sustainability subcategories that's always visible when parent is active */}
                  {startup.climateImpacts && startup.climateImpacts.length > 0 && (
                    <div className={`pl-4 space-y-1 mt-1 transition-all duration-200 ${mainTab === "sustainability" ? 'block' : 'hidden'}`}>
                      {/* View All Metrics Option */}
                      <div 
                        className={`justify-start text-sm px-2 py-1.5 h-auto rounded-none text-left w-full border-l-2 
                          cursor-pointer transition-colors
                          ${showAllMetrics 
                            ? 'border-l-primary text-primary' 
                            : 'border-l-transparent hover:text-primary hover:border-l-primary/50'}`}
                        onClick={() => setShowAllMetrics(true)}
                      >
                        <div className="flex items-center">
                          <div className="rounded-full p-1 mr-2" style={{ backgroundColor: "#10b98120" }}>
                            <BarChart className="h-3 w-3" style={{ color: "#10b981" }} />
                          </div>
                          <span>All Metrics</span>
                        </div>
                      </div>
                        
                      {/* Sub-tab for impact metrics */}
                      {hasClimateMetric("impact") && !showAllMetrics && (
                        <div 
                          className={`justify-start text-sm px-2 py-1.5 h-auto rounded-none text-left w-full border-l-2 
                            cursor-pointer transition-colors
                            ${sustainabilitySubTab === "impact" && !showAllMetrics 
                              ? 'border-l-primary text-primary' 
                              : 'border-l-transparent hover:text-primary hover:border-l-primary/50'}`}
                          onClick={() => {
                            setSustainabilitySubTab("impact");
                            setShowAllMetrics(false);
                          }}
                        >
                          <div className="flex items-center">
                            <div className="rounded-full p-1 mr-2" style={{ backgroundColor: "#10b98120" }}>
                              <Leaf className="h-3 w-3" style={{ color: "#10b981" }} />
                            </div>
                            <span>Impact Metrics</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Sub-tab for lifecycle assessment */}
                      {hasClimateMetric("lifecycle") && !showAllMetrics && (
                        <div 
                          className={`justify-start text-sm px-2 py-1.5 h-auto rounded-none text-left w-full border-l-2 
                            cursor-pointer transition-colors
                            ${sustainabilitySubTab === "lifecycle" && !showAllMetrics 
                              ? 'border-l-primary text-primary' 
                              : 'border-l-transparent hover:text-primary hover:border-l-primary/50'}`}
                          onClick={() => {
                            setSustainabilitySubTab("lifecycle");
                            setShowAllMetrics(false);
                          }}
                        >
                          <div className="flex items-center">
                            <div className="rounded-full p-1 mr-2" style={{ backgroundColor: "#0ea5e920" }}>
                              <Workflow className="h-3 w-3" style={{ color: "#0ea5e9" }} />
                            </div>
                            <span>Lifecycle Assessment</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Sub-tab for certifications */}
                      {hasClimateMetric("certifications") && !showAllMetrics && (
                        <div 
                          className={`justify-start text-sm px-2 py-1.5 h-auto rounded-none text-left w-full border-l-2 
                            cursor-pointer transition-colors
                            ${sustainabilitySubTab === "certifications" && !showAllMetrics 
                              ? 'border-l-primary text-primary' 
                              : 'border-l-transparent hover:text-primary hover:border-l-primary/50'}`}
                          onClick={() => {
                            setSustainabilitySubTab("certifications");
                            setShowAllMetrics(false);
                          }}
                        >
                          <div className="flex items-center">
                            <div className="rounded-full p-1 mr-2" style={{ backgroundColor: "#8b5cf620" }}>
                              <ShieldCheck className="h-3 w-3" style={{ color: "#8b5cf6" }} />
                            </div>
                            <span>Certifications</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Sub-tab for carbon impact */}
                      {hasClimateMetric("carbon") && !showAllMetrics && (
                        <div 
                          className={`justify-start text-sm px-2 py-1.5 h-auto rounded-none text-left w-full border-l-2 
                            cursor-pointer transition-colors
                            ${sustainabilitySubTab === "carbon" && !showAllMetrics 
                              ? 'border-l-primary text-primary' 
                              : 'border-l-transparent hover:text-primary hover:border-l-primary/50'}`}
                          onClick={() => {
                            setSustainabilitySubTab("carbon");
                            setShowAllMetrics(false);
                          }}
                        >
                          <div className="flex items-center">
                            <div className="rounded-full p-1 mr-2" style={{ backgroundColor: "#10b98120" }}>
                              <CloudCog className="h-3 w-3" style={{ color: "#10b981" }} />
                            </div>
                            <span>Carbon Impact</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <TabsTrigger 
                    value="team" 
                    className="justify-start text-base px-6 py-2 h-auto data-[state=active]:bg-background rounded-none text-left"
                  >
                    Team
                  </TabsTrigger>
                  {startup.blogPosts && startup.blogPosts.length > 0 && (
                    <TabsTrigger 
                      value="updates" 
                      className="justify-start text-base px-6 py-2 h-auto data-[state=active]:bg-background rounded-none text-left"
                    >
                      Updates
                    </TabsTrigger>
                  )}
                  {startup.jobs && startup.jobs.length > 0 && (
                    <TabsTrigger 
                      value="jobs" 
                      className="justify-start text-base px-6 py-2 h-auto data-[state=active]:bg-background rounded-none text-left"
                    >
                      Open Positions
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>
            </div>

            {/* Main content area with padding matching the About section */}
            <div className="col-span-1 md:col-span-9 lg:col-span-10">
              <div className="px-4 md:px-6 lg:px-8 pt-6 md:pt-6">
              {/* Overview Tab Content */}
              <TabsContent value="overview">
                <div className="flex flex-col items-start">
                  {/* Climate Impact Section - WITH VIEW ALL METRICS BUTTON */}
                  <div className="mb-6 md:mb-8 w-full">
                    {startup.climateImpacts && startup.climateImpacts.length > 0 ? (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-medium flex items-center justify-between">
                            <span>Climate Impact</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-sm text-primary flex items-center gap-1"
                              onClick={handleViewAllMetrics}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <ClimateImpactDisplay climateImpacts={startup.climateImpacts} initialTab="overview" standalone={false} />
                        </CardContent>
                        <CardFooter className="pt-0 pb-4 px-4 flex justify-center">
                          <Button 
                            variant="outline"
                            onClick={handleViewAllMetrics}
                            className="w-full sm:w-auto text-sm flex items-center gap-1.5"
                          >
                            <BarChart className="h-4 w-4" />
                            <span>View Complete Sustainability Metrics</span>
                          </Button>
                        </CardFooter>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="p-4 md:p-6 text-center">
                          <p className="text-muted-foreground text-sm md:text-base">No climate impact data available.</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
{/* Team Section Preview */}
{startup.team && startup.team.length > 0 && (
  <div className="mb-6 md:mb-8 w-full">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Team</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm text-primary flex items-center gap-1"
            onClick={() => setMainTab("team")}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {startup.team.slice(0, 3).map((member: any) => (
            <div key={member.id || member.name} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center overflow-hidden relative">
                  {member.avatar && member.avatar.trim() !== "" ? (
                    <Image 
                      src={member.avatar} 
                      alt={member.name || 'Team member'}
                      width={56}
                      height={56}
                      className="object-cover"
                      unoptimized={!member.avatar.startsWith('http')} // Skip optimization for non-HTTP URLs
                    />
                  ) : (
                    <Users className="h-7 w-7 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm">{member.name}</h3>
                <p className="text-xs text-muted-foreground">{member.role}</p>
                {member.linkedin && (
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline mt-1 flex items-center gap-1"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      {startup.team.length > 3 && (
        <CardFooter className="pt-0 pb-4 px-4 flex justify-center">
          <Button 
            variant="outline"
            onClick={() => setMainTab("team")}
            className="w-full sm:w-auto text-sm flex items-center gap-1.5"
          >
            <Users className="h-4 w-4" />
            <span>View Full Team</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  </div>
)}
{/* Updates Section Preview */}
{startup.blogPosts && startup.blogPosts.length > 0 && (
  <div className="mb-6 md:mb-8 w-full">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Latest Updates</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm text-primary flex items-center gap-1"
            onClick={() => setMainTab("updates")}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {startup.blogPosts.slice(0, 2).map((post: any) => (
            <div key={post.id} className="p-3 border rounded-lg">
              <div className="flex justify-between mb-1">
                <h3 className="font-medium text-sm truncate">{post.title}</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {post.excerpt || post.content.slice(0, 120) + '...'}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4 px-4 flex justify-center">
        <Button 
          variant="outline"
          onClick={() => setMainTab("updates")}
          className="w-full sm:w-auto text-sm flex items-center gap-1.5"
        >
          <FileBadge className="h-4 w-4" />
          <span>View All Updates</span>
        </Button>
      </CardFooter>
    </Card>
  </div>
)}
{/* Jobs Section Preview */}
{startup.jobs && startup.jobs.length > 0 && (
  <div className="mb-6 md:mb-8 w-full">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Open Positions</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm text-primary flex items-center gap-1"
            onClick={() => setMainTab("jobs")}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {startup.jobs.slice(0, 2).map((job: any) => (
            <div key={job.id} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-sm">{job.title}</h3>
                <Badge variant="outline" className="ml-2 text-xs">
                  {job.location || "Remote"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{job.type || "Full-time"}</span>
                {job.salary && (
                  <>
                    <span>•</span>
                    <span>{job.salary}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4 px-4 flex justify-center">
        <Button 
          variant="outline"
          onClick={() => setMainTab("jobs")}
          className="w-full sm:w-auto text-sm flex items-center gap-1.5"
        >
          <Building2 className="h-4 w-4" />
          <span>View All Open Positions</span>
        </Button>
      </CardFooter>
    </Card>
  </div>
)}
{/* Gallery Section - Always shown if available */}
{startup.gallery && startup.gallery.length > 0 && (
  <section className="mb-6 md:mb-8 md:max-w-5xl lg:max-w-6xl w-full">
    <h2 className="mb-3 md:mb-4 text-xl md:text-2xl font-semibold">Gallery</h2>
    <StartupGallery images={startup.gallery} />
  </section>
)}
                </div>
              </TabsContent>

              {/* Sustainability Metrics Tab Content */}
              <TabsContent value="sustainability">
                <div className="flex flex-col items-start w-full">
                  <h2 className="mb-4 text-xl md:text-2xl font-semibold">Climate Impact</h2>
                  
                  {/* Mobile Tabs for Sustainability Subcategories (only shown on mobile) */}
                  <div className="md:hidden mb-6 w-full">
                    <Tabs
                      value={showAllMetrics ? "all" : sustainabilitySubTab}
                      onValueChange={(val) => {
                        if (val === "all") {
                          setShowAllMetrics(true);
                        } else {
                          setShowAllMetrics(false);
                          setSustainabilitySubTab(val);
                        }
                      }}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-2 gap-2">
                        <TabsTrigger
                          value="all"
                          className="flex items-center justify-start h-auto p-3 text-left"
                        >
                          <div className="rounded-full p-1.5 mr-2" style={{ backgroundColor: "#10b98120" }}>
                            <BarChart className="h-4 w-4" style={{ color: "#10b981" }} />
                          </div>
                          <div>
                            <span className="font-medium block">All Metrics</span>
                          </div>
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </TabsTrigger>
                        
                        {hasClimateMetric("impact") && (
                          <TabsTrigger
                            value="impact"
                            className="flex items-center justify-start h-auto p-3 text-left"
                          >
                            <div className="rounded-full p-1.5 mr-2" style={{ backgroundColor: "#10b98120" }}>
                              <Leaf className="h-4 w-4" style={{ color: "#10b981" }} />
                            </div>
                            <div>
                              <span className="font-medium block">Impact Metrics</span>
                            </div>
                            <ChevronRight className="ml-auto h-4 w-4" />
                          </TabsTrigger>
                        )}
                        
                        {hasClimateMetric("lifecycle") && (
                          <TabsTrigger
                            value="lifecycle"
                            className="flex items-center justify-start h-auto p-3 text-left"
                          >
                            <div className="rounded-full p-1.5 mr-2" style={{ backgroundColor: "#0ea5e920" }}>
                              <Workflow className="h-4 w-4" style={{ color: "#0ea5e9" }} />
                            </div>
                            <div>
                              <span className="font-medium block">Lifecycle</span>
                            </div>
                            <ChevronRight className="ml-auto h-4 w-4" />
                          </TabsTrigger>
                        )}
                        
                        {hasClimateMetric("certifications") && (
                          <TabsTrigger
                            value="certifications"
                            className="flex items-center justify-start h-auto p-3 text-left"
                          >
                            <div className="rounded-full p-1.5 mr-2" style={{ backgroundColor: "#8b5cf620" }}>
                              <ShieldCheck className="h-4 w-4" style={{ color: "#8b5cf6" }} />
                            </div>
                            <div>
                              <span className="font-medium block">Certifications</span>
                            </div>
                            <ChevronRight className="ml-auto h-4 w-4" />
                          </TabsTrigger>
                        )}
                        
                        {hasClimateMetric("carbon") && (
                          <TabsTrigger
                            value="carbon"
                            className="flex items-center justify-start h-auto p-3 text-left"
                          >
                            <div className="rounded-full p-1.5 mr-2" style={{ backgroundColor: "#10b98120" }}>
                              <CloudCog className="h-4 w-4" style={{ color: "#10b981" }} />
                            </div>
                            <div>
                              <span className="font-medium block">Carbon Impact</span>
                            </div>
                            <ChevronRight className="ml-auto h-4 w-4" />
                          </TabsTrigger>
                        )}
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Display All Metrics View */}
                  {showAllMetrics && startup.climateImpacts && startup.climateImpacts.length > 0 ? (
                    <div className="w-full space-y-8">
                      <h2 className="text-xl font-semibold mb-6">All Climate Impact Metrics</h2>
                      
                      {/* SDGs section */}
                      {hasClimateMetric("sdgs") && (
                        <Card className="w-full">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">UN Sustainable Development Goals</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {startup.climateImpacts[0].sdgs?.filter((sdg: string | null | undefined) => sdg !== null && sdg !== undefined && sdg !== "").length > 0 ? (
                              <div className="flex flex-col gap-3">
                                <BadgeList 
                                  items={startup.climateImpacts[0].sdgs?.filter((sdg: string | null | undefined) => sdg !== null && sdg !== undefined && sdg !== "").map((sdg: string) => `SDG ${sdg}`) || []}
                                  icon={FileBadge}
                                  color="#3b82f6"
                                />
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-sm">No SDG data available.</p>
                            )}
                          </CardContent>
                        </Card>
                      )}
                      
                      {/* Metrics Spotlight */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-medium">Key Metrics Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {getKeyClimateMetrics().map((metric, index) => (
                              <div 
                                key={index} 
                                className="flex flex-col p-3 border rounded-lg bg-white dark:bg-slate-800"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="rounded-full p-1.5" style={{ backgroundColor: `${getMetricIconColor(metric.key)}20` }}>
                                    {getMetricIcon(metric.key, getMetricIconColor(metric.key))}
                                  </div>
                                  <span className="text-sm font-medium">{metric.label}</span>
                                </div>
                                <div className="text-lg font-semibold mt-2">
                                  {metric.value} {metric.unit}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Impact Metrics */}
                      {hasClimateMetric("impact") && (
                        <div className="mt-8">
                          <h2 className="text-xl font-semibold mb-4">Impact Metrics</h2>
                          <ClimateImpactDisplay 
                            climateImpacts={startup.climateImpacts}
                            initialTab="impact"
                            standalone={false}
                          />
                        </div>
                      )}
                      
                      {/* Lifecycle Assessment */}
                      {hasClimateMetric("lifecycle") && (
                        <div className="mt-8">
                          <h2 className="text-xl font-semibold mb-4">Lifecycle Assessment</h2>
                          <ClimateImpactDisplay 
                            climateImpacts={startup.climateImpacts}
                            initialTab="lifecycle"
                            standalone={false}
                          />
                        </div>
                      )}
                      
                      {/* Certifications */}
                      {hasClimateMetric("certifications") && (
                        <div className="mt-8">
                          <h2 className="text-xl font-semibold mb-4">Certifications & Awards</h2>
                          <ClimateImpactDisplay 
                            climateImpacts={startup.climateImpacts}
                            initialTab="certifications"
                            standalone={false}
                          />
                        </div>
                      )}
                      
                      {/* Carbon Impact */}
                      {hasClimateMetric("carbon") && (
                        <div className="mt-8">
                          <h2 className="text-xl font-semibold mb-4">Carbon Impact</h2>
                          <ClimateImpactDisplay 
                            climateImpacts={startup.climateImpacts}
                            initialTab="carbon"
                            standalone={false}
                          />
                        </div>
                      )}
                    </div>
                  ) : sustainabilitySubTab === "impact" && startup.climateImpacts && startup.climateImpacts.length > 0 ? (
                    <div className="w-full space-y-6">
                      {/* SDGs section if available */}
                      {hasClimateMetric("sdgs") && (
                        <Card className="w-full">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">UN Sustainable Development Goals</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {startup.climateImpacts[0].sdgs?.filter((sdg: string | null | undefined) => sdg !== null && sdg !== undefined && sdg !== "").length > 0 ? (
                              <div className="flex flex-col gap-3">
                                <BadgeList 
                                  items={startup.climateImpacts[0].sdgs?.filter((sdg: string | null | undefined) => sdg !== null && sdg !== undefined && sdg !== "").map((sdg: string) => `SDG ${sdg}`) || []}
                                  icon={FileBadge}
                                  color="#3b82f6"
                                />
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-sm">No SDG data available.</p>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Key Metrics Summary */}
                      <Card className="w-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-medium">Key Metrics Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {hasClimateMetric("impact") && (
                              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="rounded-full p-1.5" style={{ backgroundColor: "#10b98120" }}>
                                    <Leaf className="h-4 w-4" style={{ color: "#10b981" }} />
                                  </div>
                                  <h3 className="font-medium">Impact Metrics</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Detailed measurements of environmental impact across various categories.
                                </p>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => navigateToSubtab("impact")}
                                >
                                  View Details
                                </Button>
                              </div>
                            )}
                            
                            {hasClimateMetric("lifecycle") && (
                              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="rounded-full p-1.5" style={{ backgroundColor: "#0ea5e920" }}>
                                    <Workflow className="h-4 w-4" style={{ color: "#0ea5e9" }} />
                                  </div>
                                  <h3 className="font-medium">Lifecycle Assessment</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Product lifecycle sustainability from materials to end-of-life.
                                </p>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => navigateToSubtab("lifecycle")}
                                >
                                  View Details
                                </Button>
                              </div>
                            )}
                            
                            {hasClimateMetric("certifications") && (
                              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="rounded-full p-1.5" style={{ backgroundColor: "#8b5cf620" }}>
                                    <ShieldCheck className="h-4 w-4" style={{ color: "#8b5cf6" }} />
                                  </div>
                                  <h3 className="font-medium">Certifications & Awards</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Recognized standards and achievements in sustainability.
                                </p>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => navigateToSubtab("certifications")}
                                >
                                  View Details
                                </Button>
                              </div>
                            )}
                            
                            {hasClimateMetric("carbon") && (
                              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="rounded-full p-1.5" style={{ backgroundColor: "#10b98120" }}>
                                    <CloudCog className="h-4 w-4" style={{ color: "#10b981" }} />
                                  </div>
                                  <h3 className="font-medium">Carbon Impact</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Carbon reduction, capture, and offset initiatives.
                                </p>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => navigateToSubtab("carbon")}
                                >
                                  View Details
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Metrics Spotlight */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-medium">Metrics Spotlight</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {getKeyClimateMetrics().map((metric, index) => (
                              <div 
                                key={index} 
                                className="flex flex-col p-3 border rounded-lg bg-white dark:bg-slate-800"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="rounded-full p-1.5" style={{ backgroundColor: `${getMetricIconColor(metric.key)}20` }}>
                                    {getMetricIcon(metric.key, getMetricIconColor(metric.key))}
                                  </div>
                                  <span className="text-sm font-medium">{metric.label}</span>
                                </div>
                                <div className="text-lg font-semibold mt-2">
                                  {metric.value} {metric.unit}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex justify-center">
                            <Button 
                              variant="outline"
                              onClick={() => handleViewAllMetrics()}
                            >
                              View All Impact Metrics
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Display Impact Metrics content when that subtab is active */}
                      <div className="mt-8">
                        <h2 className="mb-4 text-xl md:text-2xl font-semibold">Impact Metrics</h2>
                        <ClimateImpactDisplay 
                          climateImpacts={startup.climateImpacts}
                          initialTab="impact"
                          standalone={false}
                        />
                      </div>
                    </div>
                  ) : sustainabilitySubTab === "lifecycle" && startup.climateImpacts && startup.climateImpacts.length > 0 ? (
                    <div className="w-full">
                      <h2 className="mb-4 text-lg md:text-xl font-semibold">Lifecycle Assessment</h2>
                      <ClimateImpactDisplay 
                        climateImpacts={startup.climateImpacts}
                        initialTab="lifecycle"
                        standalone={false}
                      />
                    </div>
                  ) : sustainabilitySubTab === "certifications" && startup.climateImpacts && startup.climateImpacts.length > 0 ? (
                    <div className="w-full">
                      <h2 className="mb-4 text-lg md:text-xl font-semibold">Certifications & Awards</h2>
                      <ClimateImpactDisplay 
                        climateImpacts={startup.climateImpacts}
                        initialTab="certifications"
                        standalone={false}
                      />
                    </div>
                  ) : sustainabilitySubTab === "carbon" && startup.climateImpacts && startup.climateImpacts.length > 0 ? (
                    <div className="w-full">
                      <h2 className="mb-4 text-lg md:text-xl font-semibold">Carbon Impact</h2>
                      <ClimateImpactDisplay 
                        climateImpacts={startup.climateImpacts}
                        initialTab="carbon"
                        standalone={false}
                      />
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-4 md:p-6 text-center">
                        <p className="text-muted-foreground text-sm md:text-base">No climate impact data available.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Team Tab Content */}
              <TabsContent value="team">
                <StartupTeam startup={startup} />
              </TabsContent>

              {/* Updates Tab Content */}
              <TabsContent value="updates">
                <h2 className="mb-4 text-xl md:text-2xl font-semibold">Latest Updates</h2>
                {startup.blogPosts && startup.blogPosts.length > 0 ? (
                  <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
                    {startup.blogPosts.map((post: any) => (
                      <BlogCard key={post.id} post={post} startupSlug={startup.id} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-4 md:p-6 text-center">
                      <p className="text-muted-foreground text-sm md:text-base">No updates available.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Jobs Tab Content */}
              <TabsContent value="jobs">
                <h2 className="mb-4 text-xl md:text-2xl font-semibold">Open Positions</h2>
                {startup.jobs && startup.jobs.length > 0 ? (
                  <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
                    {startup.jobs.map((job: any) => {
                      // Ensure job has the startup info from the parent component
                      const jobWithStartupInfo = {
                        ...job,
                        startup: job.startup || {
                          name: startup.name,
                          logo: startup.logo
                        }
                      };
                      
                      return <JobCard key={job.id} job={jobWithStartupInfo} />;
                    })}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-4 md:p-6 text-center">
                      <p className="text-muted-foreground text-sm md:text-base">No open positions available.</p>
                    </CardContent>
                    </Card>
                )}
              </TabsContent>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  </div>
);
}