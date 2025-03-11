"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Search, 
  Info
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  getMetricIcon, 
  getCategoryIcon, 
  ColoredIcon, 
  certificationIcon,
  defaultIcon
} from "../utils/climate-impact-icons";

// Define TypeScript interfaces for better type safety
interface MetricInfo {
  label: string;
  unit: string;
  type: string;
  tooltip?: string; // Added tooltip field for metric explanations
}

interface MetricsCollection {
  [key: string]: MetricInfo;
}

interface Category {
  label: string;
  metrics: MetricsCollection;
}

interface CategoriesCollection {
  [key: string]: Category;
}

interface ClimateImpactFormProps {
  onSubmitType: "create" | "update";
  onSubmitId?: string;
  initialData?: {
    metrics?: Record<string, any>;
    // Flat structure instead of nested carbonFootprint
    carbonCaptured?: number;
    carbonCapturedDescription?: string;
    lifecycleCo2Reduction?: number;
    lifecycleCo2ReductionDescription?: string;
    offsetPrograms?: string;
    sdgs?: number[];
    sdgImpact?: string;
    certifications?: string[];
    awards?: string;
    lifecycle?: Record<string, any>;
  };
}

// Tooltip descriptions for metrics
const metricTooltips = {
  // Emissions & Energy
  co2Reduction: "Total greenhouse gas emissions reduced or avoided annually, measured in metric tons of CO2 equivalent. Include both direct and indirect reductions.",
  energyEfficiency: "Percentage improvement in energy usage compared to conventional alternatives or previous versions. Higher percentages indicate better efficiency.",
  renewableEnergyGenerated: "Amount of clean energy produced annually through solar, wind, hydro, or other renewable sources, measured in kilowatt-hours.",
  ghgEmissions: "Greenhouse gas emissions broken down by scope (1, 2, and 3) according to the GHG Protocol, measured in tons of CO2 equivalent.",
  digitalSustainability: "Measures taken to reduce the environmental impact of digital operations, including server efficiency, data center practices, and software optimization.",
  
  // Water & Resources
  waterSaved: "Total volume of water conserved or recycled annually compared to industry standards or previous operations, measured in liters.",
  wasteDiverted: "Amount of waste diverted from landfills through recycling, reuse, or other waste management strategies, measured in metric tons.",
  waterQualityImprovement: "Percentage improvement in water quality parameters such as pH, turbidity, dissolved oxygen, or contaminant levels.",
  resourceEfficiency: "Percentage improvement in the use of raw materials, energy, or other resources per unit of production or service.",
  plasticReduction: "Amount of plastic waste reduced or prevented annually through redesign, material substitution, or elimination, measured in metric tons.",
  
  // Biodiversity & Land
  biodiversityImpact: "Qualitative and quantitative effects on local and global biodiversity, including species diversity, habitat conditions, and ecosystem health.",
  landAreaPreserved: "Total land area conserved, preserved, or restored through conservation initiatives, measured in hectares.",
  habitatCreation: "Size and quality of habitats created or restored for wildlife, including natural corridors and protected areas.",
  speciesProtected: "Number of endangered or threatened species protected through conservation efforts or habitat protection.",
  soilHealthImprovement: "Improvement in soil quality metrics such as organic matter content, fertility, structure, or microbial activity, measured in hectares.",
  desertificationPrevention: "Area of land protected from becoming desert through sustainable land management practices.",
  ecosystemServicesValue: "Economic value of ecosystem services provided, such as carbon sequestration, water purification, or pollination.",
  
  // Social & Health
  healthcareImpacts: "Positive impacts on human health metrics, including reduced pollution exposure, improved water quality, or enhanced food security.",
  socialImpactMetrics: "Metrics related to social benefits, such as jobs created, communities supported, or quality of life improvements.",
  environmentalJusticeMetrics: "Measures of how environmental benefits and burdens are distributed across different communities, particularly marginalized ones.",
  
  // Pollution Reduction
  airQualityImprovement: "Reduction in air pollutants such as particulate matter, nitrogen oxides, or volatile organic compounds, measured in parts per million.",
  chemicalPollutionReduction: "Reduction in hazardous chemicals released to air, water, or soil, measured in metric tons.",
  noisePollutionReduction: "Reduction in noise levels, measured in decibels, in affected areas.",
  
  // Carbon specific
  carbonCaptured: "Total amount of CO2 actively sequestered or captured annually through technological or nature-based solutions, measured in metric tons.",
  lifecycleCo2Reduction: "Percentage reduction in CO2 emissions across the entire product lifecycle compared to conventional alternatives or previous versions.",
  
  // Lifecycle related
  circularity: "Percentage of materials or components that are recycled, reused, or biodegradable in your products or operations.",
  recycledMaterials: "Percentage of materials used in your products or operations that come from recycled sources.",
  wasteReduction: "Percentage reduction in waste generated compared to previous operations or industry standards.",
  supplyChainReduction: "Percentage reduction in environmental impact throughout your supply chain through optimization or better sourcing.",
  productLifespan: "Average useful life of products in years, including any extensions through repair, refurbishment, or upgrading."
};

// Define Impact Metrics categories
const impactMetricsCategories: CategoriesCollection = {
  "emissions-energy": {
    label: "Emissions & Energy",
    metrics: {
      co2Reduction: { label: "CO₂ Reduction", unit: "tons/year", type: "number", tooltip: metricTooltips.co2Reduction },
      energyEfficiency: { label: "Energy Efficiency Improvement", unit: "%", type: "number", tooltip: metricTooltips.energyEfficiency },
      renewableEnergyGenerated: { label: "Renewable Energy Generated", unit: "kWh/year", type: "number", tooltip: metricTooltips.renewableEnergyGenerated },
      ghgEmissions: { label: "GHG Emissions by Scope", unit: "tCO₂e", type: "number", tooltip: metricTooltips.ghgEmissions },
      digitalSustainability: { label: "Digital Sustainability", unit: "", type: "text", tooltip: metricTooltips.digitalSustainability },
    }
  },
  "water-resources": {
    label: "Water & Resources",
    metrics: {
      waterSaved: { label: "Water Saved", unit: "L/year", type: "number", tooltip: metricTooltips.waterSaved },
      wasteDiverted: { label: "Waste Diverted", unit: "tons/year", type: "number", tooltip: metricTooltips.wasteDiverted },
      waterQualityImprovement: { label: "Water Quality Improvement", unit: "%", type: "number", tooltip: metricTooltips.waterQualityImprovement },
      resourceEfficiency: { label: "Resource Efficiency", unit: "%", type: "number", tooltip: metricTooltips.resourceEfficiency },
      plasticReduction: { label: "Plastic Reduction", unit: "tons/year", type: "number", tooltip: metricTooltips.plasticReduction },
    }
  },
  "biodiversity-land": {
    label: "Biodiversity & Land",
    metrics: {
      biodiversityImpact: { label: "Biodiversity Impact", unit: "", type: "textarea", tooltip: metricTooltips.biodiversityImpact },
      landAreaPreserved: { label: "Land Area Preserved/Restored", unit: "hectares", type: "number", tooltip: metricTooltips.landAreaPreserved },
      habitatCreation: { label: "Habitat Creation", unit: "area", type: "text", tooltip: metricTooltips.habitatCreation },
      speciesProtected: { label: "Species Protected", unit: "count", type: "number", tooltip: metricTooltips.speciesProtected },
      soilHealthImprovement: { label: "Soil Health Improvement", unit: "hectares", type: "number", tooltip: metricTooltips.soilHealthImprovement },
      desertificationPrevention: { label: "Desertification Prevention", unit: "area", type: "text", tooltip: metricTooltips.desertificationPrevention },
      ecosystemServicesValue: { label: "Ecosystem Services Value", unit: "currency", type: "number", tooltip: metricTooltips.ecosystemServicesValue },
    }
  },
  "social-health": {
    label: "Social & Health",
    metrics: {
      healthcareImpacts: { label: "Healthcare Impacts", unit: "", type: "textarea", tooltip: metricTooltips.healthcareImpacts },
      socialImpactMetrics: { label: "Social Impact Metrics", unit: "", type: "textarea", tooltip: metricTooltips.socialImpactMetrics },
      environmentalJusticeMetrics: { label: "Environmental Justice Metrics", unit: "", type: "textarea", tooltip: metricTooltips.environmentalJusticeMetrics },
    }
  },
  "pollution-reduction": {
    label: "Pollution Reduction",
    metrics: {
      airQualityImprovement: { label: "Air Quality Improvement", unit: "ppm", type: "number", tooltip: metricTooltips.airQualityImprovement },
      chemicalPollutionReduction: { label: "Chemical Pollution Reduction", unit: "tons/year", type: "number", tooltip: metricTooltips.chemicalPollutionReduction },
      noisePollutionReduction: { label: "Noise Pollution Reduction", unit: "dB", type: "number", tooltip: metricTooltips.noisePollutionReduction },
    }
  },
  "other-impacts": {
    label: "Other Impacts",
    metrics: {
      climateResilienceContribution: { label: "Climate Resilience Contribution", unit: "", type: "textarea" },
      circularEconomyContribution: { label: "Circular Economy Contribution", unit: "tons", type: "number" },
      sustainableFoodProduction: { label: "Sustainable Food Production", unit: "tons/year", type: "number" },
      foodWasteReduction: { label: "Food Waste Reduction", unit: "tons/year", type: "number" },
      oceanHealthImpact: { label: "Ocean Health Impact", unit: "", type: "textarea" },
      technologyTransfer: { label: "Technology Transfer", unit: "", type: "text" },
      sustainableTransportationImpact: { label: "Sustainable Transportation Impact", unit: "CO₂e", type: "number" },
      urbanSustainabilityMetrics: { label: "Urban Sustainability Metrics", unit: "", type: "textarea" },
      greenBuildingImpact: { label: "Green Building Impact", unit: "kWh", type: "number" },
      sustainableAgricultureImpact: { label: "Sustainable Agriculture Impact", unit: "CO₂e", type: "number" },
    }
  },
};
// Define Lifecycle Sustainability Impact categories
const lifecycleCategories: CategoriesCollection = {
  "materials-design": {
    label: "Materials & Design",
    metrics: {
      circularity: { label: "Circularity", unit: "%", type: "number", tooltip: metricTooltips.circularity },
      recycledMaterials: { label: "Recycled Materials", unit: "%", type: "number", tooltip: metricTooltips.recycledMaterials },
      repairabilityScore: { label: "Repairability Score", unit: "%", type: "number" },
      designForDisassembly: { label: "Design for Disassembly", unit: "%", type: "number" },
      biodegradableMaterials: { label: "Biodegradable Materials", unit: "%", type: "number" },
      biomimicryImplementation: { label: "Biomimicry Implementation", unit: "", type: "text" },
    }
  },
  "production-manufacturing": {
    label: "Production & Manufacturing",
    metrics: {
      manufacturingEfficiency: { label: "Manufacturing Efficiency", unit: "", type: "text" },
      waterUsageInProduction: { label: "Water Usage in Production", unit: "L/unit", type: "number" },
      renewableEnergyInProduction: { label: "Renewable Energy in Production", unit: "%", type: "number" },
      toxicMaterialElimination: { label: "Toxic Material Elimination", unit: "%", type: "number" },
      manufacturingEnergyIntensity: { label: "Manufacturing Energy Intensity", unit: "kWh/unit", type: "number" },
      workerHealthSafety: { label: "Worker Health & Safety in Production", unit: "incidents", type: "number" },
      byproductValorization: { label: "By-product Valorization", unit: "%", type: "number" },
      greenChemistryPrinciples: { label: "Green Chemistry Principles Adoption", unit: "count", type: "number" },
    }
  },
  "supply-chain": {
    label: "Supply Chain & Distribution",
    metrics: {
      supplyChainReduction: { label: "Supply Chain Reduction", unit: "%", type: "number", tooltip: metricTooltips.supplyChainReduction },
      materialSourcingEthics: { label: "Material Sourcing Ethics", unit: "%", type: "number" },
      supplyChainTransparency: { label: "Supply Chain Transparency", unit: "%", type: "number" },
      conflictMineralsPolicy: { label: "Conflict Minerals Policy", unit: "", type: "text" },
      sustainableProcurementScore: { label: "Sustainable Procurement Score", unit: "%", type: "number" },
      transportationFootprint: { label: "Transportation Footprint", unit: "CO₂e/unit", type: "number" },
      logisticsOptimization: { label: "Logistics Optimization", unit: "%", type: "number" },
    }
  },
  "use-performance": {
    label: "Product Use & Performance",
    metrics: {
      productLifespan: { label: "Product Lifespan", unit: "years", type: "number", tooltip: metricTooltips.productLifespan },
      productCarbonFootprint: { label: "Product Carbon Footprint", unit: "CO₂e/unit", type: "number" },
      waterFootprintOfProduct: { label: "Water Footprint of Product", unit: "L/unit", type: "number" },
      durabilityTestingResults: { label: "Durability Testing Results", unit: "", type: "textarea" },
      plannedObsolescenceAvoidance: { label: "Planned Obsolescence Avoidance", unit: "", type: "textarea" },
    }
  },
  "end-of-life": {
    label: "End-of-Life & Circularity",
    metrics: {
      wasteReduction: { label: "Waste Reduction", unit: "%", type: "number", tooltip: metricTooltips.wasteReduction },
      endOfLifeRecoveryRate: { label: "End-of-Life Recovery Rate", unit: "%", type: "number" },
      takeBackPrograms: { label: "Take-Back Programs", unit: "", type: "textarea" },
      remanufacturingCapability: { label: "Remanufacturing Capability", unit: "%", type: "number" },
      upcyclingPotential: { label: "Upcycling Potential", unit: "%", type: "number" },
      extendedProducerResponsibility: { label: "Extended Producer Responsibility", unit: "", type: "textarea" },
    }
  },
  "assessment-documentation": {
    label: "Assessment & Documentation",
    metrics: {
      lcaResults: { label: "Life Cycle Assessment (LCA) Results", unit: "", type: "textarea" },
      productEnvironmentalFootprint: { label: "Product Environmental Footprint (PEF)", unit: "", type: "textarea" },
      digitalProductPassport: { label: "Digital Product Passport", unit: "", type: "text" },
      materialPassport: { label: "Material Passport", unit: "", type: "text" },
      socialLCAMetrics: { label: "Social LCA Metrics", unit: "", type: "textarea" },
      description: { label: "Lifecycle Description", unit: "", type: "textarea" },
    }
  },
};

const SDG_OPTIONS = Array.from({ length: 17 }, (_, i) => i + 1);

export function ClimateImpactForm({
  onSubmitType,
  onSubmitId,
  initialData = {}
}: ClimateImpactFormProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [metricDisplay, setMetricDisplay] = useState<"all" | "core" | "advanced">("core");
  
  // Initialize formData with all possible fields
  const [formData, setFormData] = useState(() => {
    const metrics: Record<string, any> = {};
    const lifecycle: Record<string, any> = {};
    
    // Initialize all impact metrics
    Object.values(impactMetricsCategories).forEach(category => {
      Object.keys(category.metrics).forEach(key => {
        metrics[key] = initialData?.metrics?.[key] ?? 
          (category.metrics[key].type === "number" ? 0 : 
           category.metrics[key].type === "textarea" ? "" : "");
        
        // Initialize description fields
        const descKey = `${key}Description`;
        metrics[descKey] = initialData?.metrics?.[descKey] ?? "";
      });
    });
    
    // Initialize all lifecycle metrics
    Object.values(lifecycleCategories).forEach(category => {
      Object.keys(category.metrics).forEach(key => {
        lifecycle[key] = initialData?.lifecycle?.[key] ?? 
          (category.metrics[key].type === "number" ? 0 : 
           category.metrics[key].type === "textarea" ? "" : "");
        
        // Initialize description fields
        const descKey = `${key}Description`;
        lifecycle[descKey] = initialData?.lifecycle?.[descKey] ?? "";
      });
    });
    
    return {
      metrics,
      // Flat carbon footprint properties instead of nested
      carbonCaptured: initialData?.carbonCaptured || 0,
      carbonCapturedDescription: initialData?.carbonCapturedDescription || "",
      lifecycleCo2Reduction: initialData?.lifecycleCo2Reduction || 0,
      lifecycleCo2ReductionDescription: initialData?.lifecycleCo2ReductionDescription || "",
      offsetPrograms: initialData?.offsetPrograms || "",
      sdgs: initialData?.sdgs || [],
      sdgImpact: initialData?.sdgImpact || "",
      certifications: initialData?.certifications || [],
      awards: initialData?.awards || "",
      lifecycle,
    };
  });

  const handleMetricsChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [field]: value
      }
    }));
  };

  const handleCarbonFootprintChange = (field: string, value: string | number) => {
    // Set directly on the root object, not in a nested carbonFootprint object
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLifecycleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      lifecycle: {
        ...prev.lifecycle,
        [field]: value
      }
    }));
  };

  const handleSDGToggle = (sdgNumber: number) => {
    setFormData(prev => {
      const sdgs = prev.sdgs.includes(sdgNumber)
        ? prev.sdgs.filter(num => num !== sdgNumber)
        : [...prev.sdgs, sdgNumber];
      return {
        ...prev,
        sdgs: sdgs.sort((a, b) => a - b)
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = onSubmitType === "create" 
        ? "/api/startups/climate-impact"
        : `/api/startups/climate-impact/${onSubmitId}`;

      const response = await fetch(url, {
        method: onSubmitType === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save climate impact data");
      }

      // Reload the page to show updated data
      window.location.reload();
    } catch (err) {
      console.error("Error saving climate impact:", err);
      setError(err instanceof Error ? err.message : "Failed to save climate impact data");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter metrics based on search term
  const filterMetrics = (category: Category): MetricsCollection => {
    if (!searchTerm) return category.metrics;
    
    const filtered: MetricsCollection = {};
    Object.entries(category.metrics).forEach(([key, value]) => {
      if (value.label.toLowerCase().includes(searchTerm.toLowerCase())) {
        filtered[key] = value;
      }
    });
    
    return filtered;
  };

  // Determine if a category has any metrics after filtering
  const categoryHasVisibleMetrics = (category: Category): boolean => {
    const filteredMetrics = filterMetrics(category);
    return Object.keys(filteredMetrics).length > 0;
  };

  // Core metrics are the ones that were in the original form
  const isCoreMetric = (metricKey: string) => {
    const coreMetrics = [
      "co2Reduction", "waterSaved", "energyEfficiency", "wasteDiverted", "biodiversityImpact",
      "circularity", "recycledMaterials", "wasteReduction", "supplyChainReduction", "description"
    ];
    return coreMetrics.includes(metricKey);
  };

  // Determine if a metric should be shown based on display mode
  const shouldShowMetric = (metricKey: string) => {
    if (metricDisplay === "all") return true;
    if (metricDisplay === "core") return isCoreMetric(metricKey);
    // For advanced, show everything except core
    return !isCoreMetric(metricKey);
  };

  // Render an individual metric field
  const renderMetricField = (
    category: string, 
    metricKey: string, 
    metricInfo: MetricInfo, 
    section: "metrics" | "lifecycle"
  ) => {
    if (!shouldShowMetric(metricKey)) return null;
    
    const value = section === "metrics" ? formData.metrics[metricKey] : formData.lifecycle[metricKey];
    const handleChange = section === "metrics" ? handleMetricsChange : handleLifecycleChange;
    
    // Get description value and handler
    const descriptionKey = `${metricKey}Description`;
    const descriptionValue = section === "metrics" ? 
      formData.metrics[descriptionKey] : 
      formData.lifecycle[descriptionKey];
    
    const metricIconData = getMetricIcon(metricKey);
    
    return (
      <div key={metricKey} className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor={metricKey} className="flex-1 flex items-center">
            <ColoredIcon 
              icon={metricIconData.icon} 
              color={metricIconData.color} 
              className="mr-2" 
              size={16} 
            />
            {metricInfo.label}
            {metricInfo.unit && <span className="text-muted-foreground ml-1">({metricInfo.unit})</span>}
          </Label>
          {metricInfo.tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{metricInfo.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {isCoreMetric(metricKey) && (
            <Badge variant="outline" className="ml-2">Core</Badge>
          )}
        </div>
        
        {metricInfo.type === "textarea" ? (
          <Textarea
            id={metricKey}
            value={value as string}
            onChange={(e) => handleChange(metricKey, e.target.value)}
            placeholder={`Enter information about ${metricInfo.label}...`}
          />
        ) : metricInfo.type === "number" ? (
          <Input
            id={metricKey}
            type="number"
            value={value as number}
            onChange={(e) => handleChange(metricKey, Number(e.target.value))}
          />
        ) : (
          <Input
            id={metricKey}
            type="text"
            value={value as string}
            onChange={(e) => handleChange(metricKey, e.target.value)}
          />
        )}
        
        {/* Add description field for each metric */}
        <div className="pt-1">
          <Label htmlFor={descriptionKey} className="text-sm text-muted-foreground mb-1">
            Description (optional)
          </Label>
          <Textarea
            id={descriptionKey}
            value={descriptionValue as string}
            onChange={(e) => handleChange(descriptionKey, e.target.value)}
            placeholder={`Add context or details about ${metricInfo.label}...`}
            className="mt-1"
            rows={2}
          />
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Impact Metrics Section with new Tab UI */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ColoredIcon 
              icon={defaultIcon.icon} 
              color={defaultIcon.color} 
              size={20} 
            />
            Impact Metrics
          </CardTitle>
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search metrics..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <RadioGroup 
              defaultValue="core" 
              className="flex space-x-4" 
              onValueChange={(value) => setMetricDisplay(value as "all" | "core" | "advanced")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="core" id="core" />
                <Label htmlFor="core">Core Metrics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced">Advanced Metrics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Metrics</Label>
              </div>
            </RadioGroup>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="emissions-energy" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-4">
              {Object.entries(impactMetricsCategories).map(([key, category]) => {
                const categoryIconData = getCategoryIcon(key, "metrics");
                return (
                  <TabsTrigger 
                    key={key} 
                    value={key} 
                    disabled={!categoryHasVisibleMetrics(category)}
                    className="flex items-center gap-1"
                  >
                    <ColoredIcon 
                      icon={categoryIconData.icon} 
                      color={categoryIconData.color} 
                      size={16} 
                    />
                    {category.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {Object.entries(impactMetricsCategories).map(([key, category]) => (
              <TabsContent key={key} value={key}>
                <div className="grid gap-6 md:grid-cols-2">
                  {Object.entries(filterMetrics(category)).map(([metricKey, metricInfo]) => 
                    renderMetricField(key, metricKey, metricInfo, "metrics")
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Carbon Footprint Section - Updated to use flat structure with colored icons and descriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ColoredIcon 
              icon={getMetricIcon("carbonCaptured").icon} 
              color={getMetricIcon("carbonCaptured").color} 
              size={20} 
            />
            Carbon Footprint
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="carbonCaptured" className="flex items-center flex-1">
                  <ColoredIcon 
                    icon={getMetricIcon("carbonCaptured").icon} 
                    color={getMetricIcon("carbonCaptured").color} 
                    className="mr-2" 
                    size={16} 
                  />
                  Carbon Captured (tons/year)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{metricTooltips.carbonCaptured}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="carbonCaptured"
                type="number"
                value={formData.carbonCaptured}
                onChange={(e) => handleCarbonFootprintChange("carbonCaptured", Number(e.target.value))}
              />
              <div className="pt-1">
                <Label htmlFor="carbonCapturedDescription" className="text-sm text-muted-foreground mb-1">
                  Description (optional)
                </Label>
                <Textarea
                  id="carbonCapturedDescription"
                  value={formData.carbonCapturedDescription}
                  onChange={(e) => handleCarbonFootprintChange("carbonCapturedDescription", e.target.value)}
                  placeholder="Add context or details about carbon capture..."
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="lifecycleCo2Reduction" className="flex items-center flex-1">
                  <ColoredIcon 
                    icon={getMetricIcon("lifecycleCo2Reduction").icon} 
                    color={getMetricIcon("lifecycleCo2Reduction").color} 
                    className="mr-2" 
                    size={16} 
                  />
                  Lifecycle CO₂ Reduction (%)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{metricTooltips.lifecycleCo2Reduction}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="lifecycleCo2Reduction"
                type="number"
                min="0"
                max="100"
                value={formData.lifecycleCo2Reduction}
                onChange={(e) => handleCarbonFootprintChange("lifecycleCo2Reduction", Number(e.target.value))}
              />
              <div className="pt-1">
                <Label htmlFor="lifecycleCo2ReductionDescription" className="text-sm text-muted-foreground mb-1">
                  Description (optional)
                </Label>
                <Textarea
                  id="lifecycleCo2ReductionDescription"
                  value={formData.lifecycleCo2ReductionDescription}
                  onChange={(e) => handleCarbonFootprintChange("lifecycleCo2ReductionDescription", e.target.value)}
                  placeholder="Add context or details about lifecycle CO₂ reduction..."
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="offsetPrograms" className="flex items-center">
              <ColoredIcon 
                icon={getMetricIcon("carbonCaptured").icon} 
                color={getMetricIcon("carbonCaptured").color} 
                className="mr-2" 
                size={16} 
              />
              Offset Programs
            </Label>
            <Textarea
              id="offsetPrograms"
              value={formData.offsetPrograms}
              onChange={(e) => handleCarbonFootprintChange("offsetPrograms", e.target.value)}
              placeholder="Describe your carbon offset programs..."
            />
          </div>
        </CardContent>
      </Card>

      {/* SDGs Section - Updated with colored icons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ColoredIcon 
              icon={certificationIcon.icon} 
              color={certificationIcon.color} 
              size={20} 
            />
            UN Sustainable Development Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {SDG_OPTIONS.map(number => (
              <div key={number} className="flex items-center space-x-2">
                <Checkbox
                  id={`sdg-${number}`}
                  checked={formData.sdgs.includes(number)}
                  onCheckedChange={() => handleSDGToggle(number)}
                />
                <Label htmlFor={`sdg-${number}`} className="flex items-center">
                  <ColoredIcon 
                    icon={certificationIcon.icon} 
                    color={certificationIcon.color} 
                    className="mr-1" 
                    size={12} 
                  />
                  SDG {number}
                </Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sdgImpact" className="flex items-center">
              <ColoredIcon 
                icon={certificationIcon.icon} 
                color={certificationIcon.color} 
                className="mr-2" 
                size={16} 
              />
              SDG Impact Description
            </Label>
            <Textarea
              id="sdgImpact"
              value={formData.sdgImpact}
              onChange={(e) => setFormData(prev => ({ ...prev, sdgImpact: e.target.value }))}
              placeholder="Describe your contribution to the selected SDGs..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Certifications & Awards - Updated with colored icons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ColoredIcon 
              icon={certificationIcon.icon} 
              color={certificationIcon.color} 
              size={20} 
            />
            Certifications & Awards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="certifications" className="flex items-center">
              <ColoredIcon 
                icon={certificationIcon.icon} 
                color={certificationIcon.color} 
                className="mr-2" 
                size={16} 
              />
              Certifications (comma-separated)
            </Label>
            <Input
              id="certifications"
              value={formData.certifications.join(", ")}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                certifications: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
              }))}
              placeholder="ISO 14001, B Corp, Green Business Certified..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="awards" className="flex items-center">
              <ColoredIcon 
                icon={certificationIcon.icon} 
                color={certificationIcon.color} 
                className="mr-2" 
                size={16} 
              />
              Awards & Recognition
            </Label>
            <Textarea
              id="awards"
              value={formData.awards}
              onChange={(e) => setFormData(prev => ({ ...prev, awards: e.target.value }))}
              placeholder="List any environmental awards or recognition..."
            />
          </div>
        </CardContent>
      </Card>

     {/* Lifecycle Impact Section with Accordion UI and colored icons */}
     <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ColoredIcon 
              icon={getMetricIcon("circularity").icon} 
              color={getMetricIcon("circularity").color} 
              size={20} 
            />
            Lifecycle Sustainability Impact
          </CardTitle>
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lifecycle metrics..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <RadioGroup 
              defaultValue="core" 
              className="flex space-x-4" 
              onValueChange={(value) => setMetricDisplay(value as "all" | "core" | "advanced")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="core" id="lifecycle-core" />
                <Label htmlFor="lifecycle-core">Core Metrics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="lifecycle-advanced" />
                <Label htmlFor="lifecycle-advanced">Advanced Metrics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="lifecycle-all" />
                <Label htmlFor="lifecycle-all">All Metrics</Label>
              </div>
            </RadioGroup>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {Object.entries(lifecycleCategories).map(([key, category]) => {
              // Only show categories that have visible metrics after filtering
              if (!categoryHasVisibleMetrics(category)) return null;
              
              const categoryIconData = getCategoryIcon(key, "lifecycle");
              
              return (
                <AccordionItem key={key} value={key}>
                  <AccordionTrigger className="flex items-center">
                    <span className="flex items-center">
                      <ColoredIcon 
                        icon={categoryIconData.icon} 
                        color={categoryIconData.color} 
                        className="mr-2" 
                        size={16} 
                      />
                      {category.label}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-6 md:grid-cols-2 pt-4">
                      {Object.entries(filterMetrics(category)).map(([metricKey, metricInfo]) => 
                        renderMetricField(key, metricKey, metricInfo, "lifecycle")
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
            </Accordion>
          </CardContent>
        </Card>
  
        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
            <ColoredIcon 
              icon={defaultIcon.icon} 
              color={defaultIcon.color} 
              size={16} 
            />
            {isSubmitting ? 
              "Saving..." : 
              onSubmitType === "create" ? "Create Climate Impact" : "Update Climate Impact"
            }
          </Button>
        </div>
      </form>
    );
  }
  
  export default ClimateImpactForm;