import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Pencil, Trash2, Plus, ChevronDown, ChevronUp, Search,
  ArrowUpRight, Info
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClimateImpactForm } from "@/components/startups/forms/climate-impact-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  getMetricIcon, 
  getCategoryIcon, 
  ColoredIcon, 
  certificationIcon,
  defaultIcon
} from "../utils/climate-impact-icons";

// Define expanded interface for ClimateImpact
interface ClimateImpact {
  id: string;
  isActive: boolean;
  metrics: Record<string, any>;
  // Using flat fields instead of nested carbonFootprint
  carbonCaptured?: number;
  lifecycleCo2Reduction?: number;
  offsetPrograms?: string;
  sdgs: number[];
  sdgImpact?: string;
  certifications: string[];
  awards?: string;
  lifecycle: Record<string, any>;
}

interface StartupProps {
  startup: {
    id: string;
    climateImpacts: ClimateImpact[];
  };
}

// Group definitions for metrics
const impactMetricsGroups = {
  "emissions-energy": {
    label: "Emissions & Energy",
    metrics: {
      co2Reduction: { label: "CO₂ Reduction", unit: "tons/year" },
      energyEfficiency: { label: "Energy Efficiency", unit: "%" },
      renewableEnergyGenerated: { label: "Renewable Energy Generated", unit: "kWh/year" },
      ghgEmissions: { label: "GHG Emissions", unit: "tCO₂e" },
      digitalSustainability: { label: "Digital Sustainability", unit: "" },
    }
  },
  "water-resources": {
    label: "Water & Resources",
    metrics: {
      waterSaved: { label: "Water Saved", unit: "L/year" },
      wasteDiverted: { label: "Waste Diverted", unit: "tons/year" },
      waterQualityImprovement: { label: "Water Quality Improvement", unit: "%" },
      resourceEfficiency: { label: "Resource Efficiency", unit: "%" },
      plasticReduction: { label: "Plastic Reduction", unit: "tons/year" },
    }
  },
  "biodiversity-land": {
    label: "Biodiversity & Land",
    metrics: {
      biodiversityImpact: { label: "Biodiversity Impact", unit: "" },
      landAreaPreserved: { label: "Land Area Preserved/Restored", unit: "hectares" },
      habitatCreation: { label: "Habitat Creation", unit: "area" },
      speciesProtected: { label: "Species Protected", unit: "count" },
      soilHealthImprovement: { label: "Soil Health Improvement", unit: "hectares" },
      desertificationPrevention: { label: "Desertification Prevention", unit: "area" },
      ecosystemServicesValue: { label: "Ecosystem Services Value", unit: "currency" },
    }
  },
  "social-health": {
    label: "Social & Health",
    metrics: {
      healthcareImpacts: { label: "Healthcare Impacts", unit: "" },
      socialImpactMetrics: { label: "Social Impact Metrics", unit: "" },
      environmentalJusticeMetrics: { label: "Environmental Justice Metrics", unit: "" },
    }
  },
  "pollution-reduction": {
    label: "Pollution Reduction",
    metrics: {
      airQualityImprovement: { label: "Air Quality Improvement", unit: "ppm" },
      chemicalPollutionReduction: { label: "Chemical Pollution Reduction", unit: "tons/year" },
      noisePollutionReduction: { label: "Noise Pollution Reduction", unit: "dB" },
    }
  },
  "other-impacts": {
    label: "Other Impacts",
    metrics: {
      climateResilienceContribution: { label: "Climate Resilience Contribution", unit: "" },
      circularEconomyContribution: { label: "Circular Economy Contribution", unit: "tons" },
      sustainableFoodProduction: { label: "Sustainable Food Production", unit: "tons/year" },
      foodWasteReduction: { label: "Food Waste Reduction", unit: "tons/year" },
      oceanHealthImpact: { label: "Ocean Health Impact", unit: "" },
      technologyTransfer: { label: "Technology Transfer", unit: "" },
      sustainableTransportationImpact: { label: "Sustainable Transportation Impact", unit: "CO₂e" },
      urbanSustainabilityMetrics: { label: "Urban Sustainability Metrics", unit: "" },
      greenBuildingImpact: { label: "Green Building Impact", unit: "kWh" },
      sustainableAgricultureImpact: { label: "Sustainable Agriculture Impact", unit: "CO₂e" },
    }
  },
};

// Group definitions for lifecycle
const lifecycleGroups = {
  "materials-design": {
    label: "Materials & Design",
    metrics: {
      circularity: { label: "Circularity", unit: "%" },
      recycledMaterials: { label: "Recycled Materials", unit: "%" },
      repairabilityScore: { label: "Repairability Score", unit: "%" },
      designForDisassembly: { label: "Design for Disassembly", unit: "%" },
      biodegradableMaterials: { label: "Biodegradable Materials", unit: "%" },
      biomimicryImplementation: { label: "Biomimicry Implementation", unit: "" },
    }
  },
  "production-manufacturing": {
    label: "Production & Manufacturing",
    metrics: {
      manufacturingEfficiency: { label: "Manufacturing Efficiency", unit: "" },
      waterUsageInProduction: { label: "Water Usage in Production", unit: "L/unit" },
      renewableEnergyInProduction: { label: "Renewable Energy in Production", unit: "%" },
      toxicMaterialElimination: { label: "Toxic Material Elimination", unit: "%" },
      manufacturingEnergyIntensity: { label: "Manufacturing Energy Intensity", unit: "kWh/unit" },
      workerHealthSafety: { label: "Worker Health & Safety", unit: "incidents" },
      byproductValorization: { label: "By-product Valorization", unit: "%" },
      greenChemistryPrinciples: { label: "Green Chemistry Principles", unit: "count" },
    }
  },
  "supply-chain": {
    label: "Supply Chain & Distribution",
    metrics: {
      supplyChainReduction: { label: "Supply Chain Reduction", unit: "%" },
      materialSourcingEthics: { label: "Material Sourcing Ethics", unit: "%" },
      supplyChainTransparency: { label: "Supply Chain Transparency", unit: "%" },
      conflictMineralsPolicy: { label: "Conflict Minerals Policy", unit: "" },
      sustainableProcurementScore: { label: "Sustainable Procurement Score", unit: "%" },
      transportationFootprint: { label: "Transportation Footprint", unit: "CO₂e/unit" },
      logisticsOptimization: { label: "Logistics Optimization", unit: "%" },
    }
  },
  "use-performance": {
    label: "Product Use & Performance",
    metrics: {
      productLifespan: { label: "Product Lifespan", unit: "years" },
      productCarbonFootprint: { label: "Product Carbon Footprint", unit: "CO₂e/unit" },
      waterFootprintOfProduct: { label: "Water Footprint of Product", unit: "L/unit" },
      durabilityTestingResults: { label: "Durability Testing Results", unit: "" },
      plannedObsolescenceAvoidance: { label: "Planned Obsolescence Avoidance", unit: "" },
    }
  },
  "end-of-life": {
    label: "End-of-Life & Circularity",
    metrics: {
      wasteReduction: { label: "Waste Reduction", unit: "%" },
      endOfLifeRecoveryRate: { label: "End-of-Life Recovery Rate", unit: "%" },
      takeBackPrograms: { label: "Take-Back Programs", unit: "" },
      remanufacturingCapability: { label: "Remanufacturing Capability", unit: "%" },
      upcyclingPotential: { label: "Upcycling Potential", unit: "%" },
      extendedProducerResponsibility: { label: "Extended Producer Responsibility", unit: "" },
    }
  },
  "assessment-documentation": {
    label: "Assessment & Documentation",
    metrics: {
      lcaResults: { label: "Life Cycle Assessment Results", unit: "" },
      productEnvironmentalFootprint: { label: "Product Environmental Footprint", unit: "" },
      digitalProductPassport: { label: "Digital Product Passport", unit: "" },
      materialPassport: { label: "Material Passport", unit: "" },
      socialLCAMetrics: { label: "Social LCA Metrics", unit: "" },
      description: { label: "Lifecycle Description", unit: "" },
    }
  },
};

export function ClimateImpactSection({ startup }: StartupProps) {
  // Ensure we have a default empty array if climateImpacts is undefined
  const [impacts, setImpacts] = useState<ClimateImpact[]>(startup.climateImpacts || []);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/startups/climate-impact/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setImpacts(impacts.map(impact => 
        impact.id === id ? { ...impact, isActive } : impact
      ));
      
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this climate impact?')) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/startups/climate-impact/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete climate impact');

      setImpacts(impacts.filter(impact => impact.id !== id));
      toast.success('Climate impact deleted successfully');
    } catch (error) {
      toast.error('Failed to delete climate impact');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (impactId: string, section: string) => {
    const key = `${impactId}-${section}`;
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isSectionExpanded = (impactId: string, section: string) => {
    const key = `${impactId}-${section}`;
    return expandedSections[key] || false;
  };

  // Filter metrics that have values and match search term
  const filterMetrics = (impact: ClimateImpact, section: string, group: Record<string, any>) => {
    // Ensure data exists by providing defaults if not
    const data = section === 'metrics' 
      ? (impact.metrics || {}) 
      : (impact.lifecycle || {});
    
    const filteredMetrics: Record<string, any> = {};
    Object.entries(group.metrics).forEach(([key, info]: [string, any]) => {
      // Include if the metric has a value and matches search (or search is empty)
      if (
        data[key] !== undefined && 
        data[key] !== null && 
        data[key] !== '' &&
        (searchTerm === '' || info.label.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        filteredMetrics[key] = {
          ...info,
          value: data[key]
        };
      }
    });
    
    return filteredMetrics;
  };

  // Check if a group has any metrics with values
  const groupHasValues = (impact: ClimateImpact, section: string, group: Record<string, any>) => {
    const filteredMetrics = filterMetrics(impact, section, group);
    return Object.keys(filteredMetrics).length > 0;
  };

  const calculateTotalMetrics = (impact: ClimateImpact) => {
    let totalCount = 0;
    
    // Initialize metrics and lifecycle if they don't exist
    const metrics = impact.metrics || {};
    const lifecycle = impact.lifecycle || {};
    
    // Count metrics with values
    Object.values(impactMetricsGroups).forEach(group => {
      Object.keys(group.metrics).forEach(key => {
        if (metrics[key] !== undefined && metrics[key] !== null && metrics[key] !== '') {
          totalCount++;
        }
      });
    });
    
    // Count lifecycle metrics with values
    Object.values(lifecycleGroups).forEach(group => {
      Object.keys(group.metrics).forEach(key => {
        if (lifecycle[key] !== undefined && lifecycle[key] !== null && lifecycle[key] !== '') {
          totalCount++;
        }
      });
    });
    
    // Count basic data
    if (impact.carbonCaptured !== undefined) totalCount++;
    if (impact.lifecycleCo2Reduction !== undefined) totalCount++;
    if (impact.offsetPrograms) totalCount++;
    if (impact.sdgs && impact.sdgs.length > 0) totalCount++;
    if (impact.certifications && impact.certifications.length > 0) totalCount++;
    if (impact.awards) totalCount++;
    
    return totalCount;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <ColoredIcon
            icon={defaultIcon.icon}
            color={defaultIcon.color}
            className="mr-2"
            size={24}
          />
          Climate Impact
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Climate Impact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Climate Impact</DialogTitle>
            </DialogHeader>
            <ClimateImpactForm 
              onSubmitType="create"
              initialData={{
                metrics: {},
                carbonCaptured: 0,
                lifecycleCo2Reduction: 0,
                offsetPrograms: "",
                sdgs: [],
                certifications: [],
                lifecycle: {}
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {impacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Plus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Climate Impact Data</h3>
            <p className="text-muted-foreground text-center mb-6">
              Add information about your startup environmental impact and sustainability initiatives.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {impacts.map((impact) => (
            <Card key={impact.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center">
                  <ColoredIcon
                    icon={defaultIcon.icon}
                    color={defaultIcon.color}
                    className="mr-2"
                    size={20}
                  />
                  Climate Impact Report
                  <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    {calculateTotalMetrics(impact)} metrics
                  </Badge>
                  {!impact.isActive && (
                    <Badge variant="outline" className="ml-2">Draft</Badge>
                  )}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {impact.isActive ? "Active" : "Inactive"}
                    </span>
                    <Switch
                      checked={impact.isActive}
                      onCheckedChange={(checked) => handleStatusChange(impact.id, checked)}
                      disabled={isLoading}
                    />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Climate Impact</DialogTitle>
                      </DialogHeader>
                      <ClimateImpactForm 
                        onSubmitType="update"
                        onSubmitId={impact.id}
                        initialData={{
                          metrics: impact.metrics || {},
                          carbonCaptured: impact.carbonCaptured,
                          lifecycleCo2Reduction: impact.lifecycleCo2Reduction,
                          offsetPrograms: impact.offsetPrograms,
                          sdgs: impact.sdgs || [],
                          sdgImpact: impact.sdgImpact,
                          certifications: impact.certifications || [],
                          awards: impact.awards,
                          lifecycle: impact.lifecycle || {}
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleDelete(impact.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <div className="relative w-full mb-4">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search metrics..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Tabs defaultValue="overview" onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="impact">Impact Metrics</TabsTrigger>
                      <TabsTrigger value="lifecycle">Lifecycle Impact</TabsTrigger>
                      <TabsTrigger value="other">Other Data</TabsTrigger>
                    </TabsList>
                    
                    {/* Overview Tab */}
                    <TabsContent value="overview">
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Show key metrics from each category - with proper null/undefined handling */}
                        {Object.entries({
                          "CO₂ Reduction": {
                            value: impact.metrics?.co2Reduction ? `${impact.metrics.co2Reduction} tons/year` : "-",
                            metricKey: "co2Reduction"
                          },
                          "Water Saved": {
                            value: impact.metrics?.waterSaved ? `${impact.metrics.waterSaved} L/year` : "-",
                            metricKey: "waterSaved"
                          },
                          "Energy Efficiency": {
                            value: impact.metrics?.energyEfficiency ? `${impact.metrics.energyEfficiency}%` : "-",
                            metricKey: "energyEfficiency"
                          },
                          "Waste Diverted": {
                            value: impact.metrics?.wasteDiverted ? `${impact.metrics.wasteDiverted} tons/year` : "-",
                            metricKey: "wasteDiverted"
                          },
                          "Circularity": {
                            value: impact.lifecycle?.circularity ? `${impact.lifecycle.circularity}%` : "-",
                            metricKey: "circularity"
                          },
                          "Recycled Materials": {
                            value: impact.lifecycle?.recycledMaterials ? `${impact.lifecycle.recycledMaterials}%` : "-",
                            metricKey: "recycledMaterials"
                          },
                          "Carbon Captured": {
                            value: impact.carbonCaptured ? `${impact.carbonCaptured} tons/year` : "-",
                            metricKey: "carbonCaptured"
                          },
                          "SDGs": {
                            value: impact.sdgs?.length > 0 ? `${impact.sdgs.length} goals` : "-",
                            metricKey: "sdgs"
                          },
                          "Certifications": {
                            value: impact.certifications?.length > 0 ? `${impact.certifications.length} certifications` : "-",
                            metricKey: "certifications"
                          }
                        }).map(([label, data]) => (
                          <div key={label} className="bg-muted/30 p-4 rounded-lg">
                            <div className="text-sm text-muted-foreground flex items-center">
                              <ColoredIcon
                                icon={getMetricIcon(data.metricKey).icon}
                                color={getMetricIcon(data.metricKey).color}
                                className="mr-2"
                                size={16}
                              />
                              {label}
                            </div>
                            <div className="text-lg font-semibold mt-1">{data.value}</div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    {/* Impact Metrics Tab */}
                    <TabsContent value="impact">
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-4">
                          {Object.entries(impactMetricsGroups).map(([groupKey, group]) => {
                            // Only show groups that have metrics with values
                            if (!groupHasValues(impact, 'metrics', group)) return null;
                            
                            const categoryIconData = getCategoryIcon(groupKey, "metrics");
                            
                            return (
                              <Collapsible 
                                key={groupKey} 
                                open={isSectionExpanded(impact.id, `metrics-${groupKey}`)}
                                onOpenChange={() => toggleSection(impact.id, `metrics-${groupKey}`)}
                                className="border rounded-md"
                              >
                                <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
                                  <span className="font-semibold flex items-center">
                                    <ColoredIcon
                                      icon={categoryIconData.icon}
                                      color={categoryIconData.color}
                                      className="mr-2"
                                      size={20}
                                    />
                                    {group.label}
                                  </span>
                                  {isSectionExpanded(impact.id, `metrics-${groupKey}`) ? 
                                    <ChevronUp className="h-4 w-4" /> : 
                                    <ChevronDown className="h-4 w-4" />
                                  }
                                </CollapsibleTrigger>
                                <CollapsibleContent className="p-4 pt-0 border-t">
                                  <div className="grid gap-4 md:grid-cols-2">
                                    {Object.entries(filterMetrics(impact, 'metrics', group)).map(([metricKey, metric]: [string, any]) => {
                                      const metricIconData = getMetricIcon(metricKey);
                                      
                                      return (
                                        <div key={metricKey}>
                                          <span className="font-medium flex items-center">
                                            <ColoredIcon
                                              icon={metricIconData.icon}
                                              color={metricIconData.color}
                                              className="mr-2"
                                              size={16}
                                            />
                                            {metric.label}:
                                          </span>
                                          <span className="ml-6 block">
                                            {typeof metric.value === 'string' && metric.value.length > 50 
                                              ? `${metric.value.substring(0, 50)}...` 
                                              : metric.value}
                                            {metric.unit && ` ${metric.unit}`}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    {/* Lifecycle Impact Tab */}
                    <TabsContent value="lifecycle">
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-4">
                          {Object.entries(lifecycleGroups).map(([groupKey, group]) => {
                            // Only show groups that have metrics with values
                            if (!groupHasValues(impact, 'lifecycle', group)) return null;
                            
                            const categoryIconData = getCategoryIcon(groupKey, "lifecycle");
                            
                            return (
                              <Collapsible 
                                key={groupKey} 
                                open={isSectionExpanded(impact.id, `lifecycle-${groupKey}`)}
                                onOpenChange={() => toggleSection(impact.id, `lifecycle-${groupKey}`)}
                                className="border rounded-md"
                              >
                                <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
                                  <span className="font-semibold flex items-center">
                                    <ColoredIcon
                                      icon={categoryIconData.icon}
                                      color={categoryIconData.color}
                                      className="mr-2"
                                      size={20}
                                    />
                                    {group.label}
                                  </span>
                                  {isSectionExpanded(impact.id, `lifecycle-${groupKey}`) ? 
                                    <ChevronUp className="h-4 w-4" /> : 
                                    <ChevronDown className="h-4 w-4" />
                                  }
                                </CollapsibleTrigger>
                                <CollapsibleContent className="p-4 pt-0 border-t">
                                  <div className="grid gap-4 md:grid-cols-2">
                                    {Object.entries(filterMetrics(impact, 'lifecycle', group)).map(([metricKey, metric]: [string, any]) => {
                                      const metricIconData = getMetricIcon(metricKey);
                                      
                                      return (
                                        <div key={metricKey}>
                                          <span className="font-medium flex items-center">
                                            <ColoredIcon
                                              icon={metricIconData.icon}
                                              color={metricIconData.color}
                                              className="mr-2"
                                              size={16}
                                            />
                                            {metric.label}:
                                          </span>
                                          <span className="ml-6 block">
                                            {typeof metric.value === 'string' && metric.value.length > 50 
                                              ? `${metric.value.substring(0, 50)}...` 
                                              : metric.value}
                                            {metric.unit && ` ${metric.unit}`}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    {/* Other Data Tab */}
                    <TabsContent value="other">
                      <div className="space-y-6">
                        {/* Carbon Footprint Section */}
                        {(impact.carbonCaptured !== undefined || 
                          impact.lifecycleCo2Reduction !== undefined || 
                          impact.offsetPrograms) && (
                          <div className="space-y-2">
                            <h3 className="font-semibold flex items-center">
                              <ColoredIcon
                                icon={getMetricIcon("carbonCaptured").icon}
                                color={getMetricIcon("carbonCaptured").color}
                                className="mr-2"
                                size={20}
                              />
                              Carbon Footprint
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                              {impact.carbonCaptured !== undefined && impact.carbonCaptured !== null && (
                                <div>
                                  <span className="font-medium flex items-center">
                                    <ColoredIcon
                                      icon={getMetricIcon("carbonCaptured").icon}
                                      color={getMetricIcon("carbonCaptured").color}
                                      className="mr-2"
                                      size={16}
                                    />
                                    Carbon Captured:
                                  </span>
                                  <span className="ml-6 block">{impact.carbonCaptured} tons/year</span>
                                </div>
                              )}
                              {impact.lifecycleCo2Reduction !== undefined && impact.lifecycleCo2Reduction !== null && (
                                <div>
                                  <span className="font-medium flex items-center">
                                    <ColoredIcon
                                      icon={getMetricIcon("lifecycleCo2Reduction").icon}
                                      color={getMetricIcon("lifecycleCo2Reduction").color}
                                      className="mr-2"
                                      size={16}
                                    />
                                    Lifecycle CO₂ Reduction:
                                  </span>
                                  <span className="ml-6 block">{impact.lifecycleCo2Reduction}%</span>
                                </div>
                              )}
                            </div>
                            {impact.offsetPrograms && (
                              <div className="mt-2">
                                <span className="font-medium flex items-center">
                                  <ColoredIcon
                                    icon={getMetricIcon("carbonCaptured").icon}
                                    color={getMetricIcon("carbonCaptured").color}
                                    className="mr-2"
                                    size={16}
                                  />
                                  Offset Programs:
                                </span>
                                <p className="mt-1 text-sm ml-6">{impact.offsetPrograms}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* SDGs Section */}
                        {impact.sdgs && impact.sdgs.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="font-semibold flex items-center">
                              <ColoredIcon
                                icon={certificationIcon.icon}
                                color={certificationIcon.color}
                                className="mr-2"
                                size={20}
                              />
                              UN Sustainable Development Goals
                            </h3>
                            <div className="flex flex-wrap gap-2 ml-6">
                              {impact.sdgs.map((sdg) => (
                                <div key={sdg} className="rounded-full bg-primary/10 px-3 py-1 text-sm flex items-center">
                                  <ColoredIcon
                                    icon={certificationIcon.icon}
                                    color={certificationIcon.color}
                                    className="mr-1"
                                    size={12}
                                  />
                                  SDG {sdg}
                                </div>
                              ))}
                            </div>
                            {impact.sdgImpact && (
                              <div className="mt-2">
                                <span className="font-medium flex items-center">
                                  <ColoredIcon
                                    icon={certificationIcon.icon}
                                    color={certificationIcon.color}
                                    className="mr-2"
                                    size={16}
                                  />
                                  SDG Impact:
                                </span>
                                <p className="mt-1 text-sm ml-6">{impact.sdgImpact}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Certifications & Awards */}
                        {((impact.certifications && impact.certifications.length > 0) || impact.awards) && (
                          <div className="space-y-2">
                            <h3 className="font-semibold flex items-center">
                              <ColoredIcon
                                icon={certificationIcon.icon}
                                color={certificationIcon.color}
                                className="mr-2"
                                size={20}
                              />
                              Certifications & Awards
                            </h3>
                            {impact.certifications && impact.certifications.length > 0 && (
                              <div className="flex flex-wrap gap-2 ml-6">
                                {impact.certifications.map((cert) => (
                                  <div key={cert} className="rounded-full bg-secondary px-3 py-1 text-sm flex items-center">
                                    <ColoredIcon
                                      icon={certificationIcon.icon}
                                      color={certificationIcon.color}
                                      className="mr-1"
                                      size={12}
                                    />
                                    {cert}
                                  </div>
                                ))}
                              </div>
                            )}
                            {impact.awards && (
                              <div className="mt-2">
                                <span className="font-medium flex items-center">
                                  <ColoredIcon
                                    icon={certificationIcon.icon}
                                    color={certificationIcon.color}
                                    className="mr-2"
                                    size={16}
                                  />
                                  Awards:
                                </span>
                                <p className="mt-1 text-sm ml-6">{impact.awards}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}