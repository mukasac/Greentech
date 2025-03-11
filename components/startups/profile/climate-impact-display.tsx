"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Leaf,
  Droplets,
  Recycle,
  TreePine,
  Wind,
  Factory,
  Timer,
  BarChart,
  GaugeCircle,
  Sparkles,
  Workflow,
  FileBadge,
  Globe,
  CloudCog,
  Waves,
  Gauge,
  PackageOpen,
  Mountain,
  Bug,
  Sprout,
  Trees,
  Heart,
  Users,
  Scale,
  Beaker,
  Volume2,
  Shield,
  Wheat,
  Utensils,
  Share2,
  Car,
  Building2,
  Home,
  Tractor,
  Wrench,
  Puzzle,
  Ban,
  BatteryMedium,
  Truck,
  Search,
  FileWarning,
  ShoppingCart,
  Clock,
  Trash2,
  CornerUpLeft,
  RefreshCcw,
  ArrowUpCircle,
  ShieldCheck,
  FileCheck,
  QrCode,
  FileText,
  Laptop,
  FootprintsIcon,
  Info
} from "lucide-react";
import { ClimateImpact as StartupClimateImpact } from "@/lib/types/startup";
import { ReactNode, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Keep all the existing interfaces
interface MetricInfo {
  label: string;
  unit: string;
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

interface ClimateImpactDisplayProps {
  climateImpacts?: StartupClimateImpact[];
  initialTab?: string; // Tab to display (controlled by parent component)
  standalone?: boolean; // Whether this is a standalone component or integrated with parent tabs
}

// Define metric units - keeping all original content
const metricUnits: Record<string, string> = {
  co2Reduction: "tons/year",
  waterSaved: "L/year",
  energyEfficiency: "%",
  wasteDiverted: "tons/year",
  renewableEnergyGenerated: "kWh/year",
  landAreaPreserved: "hectares",
  airQualityImprovement: "ppm",
  waterQualityImprovement: "%",
  resourceEfficiency: "%",
  plasticReduction: "tons/year",
  circularity: "%",
  recycledMaterials: "%",
  wasteReduction: "%",
  supplyChainReduction: "%",
  productLifespan: "years"
};

// Define MetricData interface for types
interface MetricData {
  key: string;
  label: string;
  value: any; // Keep as any for flexibility, but ensure we convert to string when rendering
  unit: string;
  description?: string; // Added for description field
}

// Group types for organization
interface MetricGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  categories: {
    [key: string]: MetricData[];
  };
}

// Enhanced metric icons map - specific icons for every metric type
const enhancedMetricIcons: Record<string, { icon: React.ElementType, color: string }> = {
  // Emissions & Energy
  co2Reduction: { icon: CloudCog, color: "#10b981" },
  energyEfficiency: { icon: GaugeCircle, color: "#3b82f6" },
  renewableEnergyGenerated: { icon: Wind, color: "#06b6d4" },
  ghgEmissions: { icon: Factory, color: "#6366f1" },
  digitalSustainability: { icon: Laptop, color: "#8b5cf6" },
  
  // Water & Resources
  waterSaved: { icon: Droplets, color: "#0ea5e9" },
  wasteDiverted: { icon: Recycle, color: "#10b981" },
  waterQualityImprovement: { icon: Waves, color: "#0ea5e9" },
  resourceEfficiency: { icon: Gauge, color: "#f59e0b" },
  plasticReduction: { icon: PackageOpen, color: "#10b981" },
  
  // Biodiversity & Land
  biodiversityImpact: { icon: TreePine, color: "#84cc16" },
  landAreaPreserved: { icon: Globe, color: "#84cc16" },
  habitatCreation: { icon: Mountain, color: "#84cc16" },
  speciesProtected: { icon: Bug, color: "#84cc16" },
  soilHealthImprovement: { icon: Sprout, color: "#84cc16" },
  desertificationPrevention: { icon: Mountain, color: "#84cc16" },
  ecosystemServicesValue: { icon: Trees, color: "#84cc16" },
  
  // Social & Health
  healthcareImpacts: { icon: Heart, color: "#ec4899" },
  socialImpactMetrics: { icon: Users, color: "#8b5cf6" },
  environmentalJusticeMetrics: { icon: Scale, color: "#8b5cf6" },
  
  // Pollution Reduction
  airQualityImprovement: { icon: Wind, color: "#0ea5e9" },
  chemicalPollutionReduction: { icon: Beaker, color: "#f43f5e" },
  noisePollutionReduction: { icon: Volume2, color: "#64748b" },
  
  // Other Impacts
  climateResilienceContribution: { icon: Shield, color: "#0ea5e9" },
  circularEconomyContribution: { icon: Workflow, color: "#10b981" },
  sustainableFoodProduction: { icon: Wheat, color: "#eab308" },
  foodWasteReduction: { icon: Utensils, color: "#eab308" },
  oceanHealthImpact: { icon: Waves, color: "#0ea5e9" },
  technologyTransfer: { icon: Share2, color: "#8b5cf6" },
  sustainableTransportationImpact: { icon: Car, color: "#6366f1" },
  urbanSustainabilityMetrics: { icon: Building2, color: "#6366f1" },
  greenBuildingImpact: { icon: Home, color: "#10b981" },
  sustainableAgricultureImpact: { icon: Tractor, color: "#84cc16" },
  
  // Lifecycle Metrics - Materials & Design
  circularity: { icon: Workflow, color: "#10b981" },
  recycledMaterials: { icon: Recycle, color: "#10b981" },
  repairabilityScore: { icon: Wrench, color: "#f59e0b" },
  designForDisassembly: { icon: Puzzle, color: "#f59e0b" },
  biodegradableMaterials: { icon: Leaf, color: "#84cc16" },
  biomimicryImplementation: { icon: Bug, color: "#84cc16" },
  
  // Production & Manufacturing
  manufacturingEfficiency: { icon: Factory, color: "#f59e0b" },
  waterUsageInProduction: { icon: Droplets, color: "#0ea5e9" },
  renewableEnergyInProduction: { icon: Wind, color: "#06b6d4" },
  toxicMaterialElimination: { icon: Ban, color: "#f43f5e" },
  manufacturingEnergyIntensity: { icon: BatteryMedium, color: "#f59e0b" },
  workerHealthSafety: { icon: Shield, color: "#ec4899" },
  byproductValorization: { icon: Sparkles, color: "#10b981" },
  greenChemistryPrinciples: { icon: Beaker, color: "#10b981" },
  
  // Supply Chain
  supplyChainReduction: { icon: Truck, color: "#6366f1" },
  materialSourcingEthics: { icon: Scale, color: "#8b5cf6" },
  supplyChainTransparency: { icon: Search, color: "#6366f1" },
  conflictMineralsPolicy: { icon: FileWarning, color: "#f43f5e" },
  sustainableProcurementScore: { icon: ShoppingCart, color: "#10b981" },
  transportationFootprint: { icon: Truck, color: "#6366f1" },
  logisticsOptimization: { icon: BarChart, color: "#f59e0b" },
  
  // Product Use & Performance
  productLifespan: { icon: Timer, color: "#f59e0b" },
  productCarbonFootprint: { icon: CloudCog, color: "#10b981" },
  waterFootprintOfProduct: { icon: Droplets, color: "#0ea5e9" },
  durabilityTestingResults: { icon: Timer, color: "#f59e0b" },
  plannedObsolescenceAvoidance: { icon: Clock, color: "#6366f1" },
  
  // End-of-Life & Circularity
  wasteReduction: { icon: Trash2, color: "#10b981" },
  endOfLifeRecoveryRate: { icon: Recycle, color: "#10b981" },
  takeBackPrograms: { icon: CornerUpLeft, color: "#6366f1" },
  remanufacturingCapability: { icon: RefreshCcw, color: "#10b981" },
  upcyclingPotential: { icon: ArrowUpCircle, color: "#10b981" },
  extendedProducerResponsibility: { icon: ShieldCheck, color: "#6366f1" },
  
  // Assessment & Documentation
  lcaResults: { icon: FileCheck, color: "#64748b" },
  productEnvironmentalFootprint: { icon: FootprintsIcon, color: "#10b981" },
  digitalProductPassport: { icon: QrCode, color: "#6366f1" },
  materialPassport: { icon: FileText, color: "#64748b" },
  socialLCAMetrics: { icon: Users, color: "#8b5cf6" },
  description: { icon: FileText, color: "#64748b" },
  
  // Carbon specific
  carbonCaptured: { icon: CloudCog, color: "#10b981" },
  lifecycleCo2Reduction: { icon: RefreshCcw, color: "#10b981" },
  offsetPrograms: { icon: Leaf, color: "#10b981" },
  
  // Fallback
  default: { icon: Leaf, color: "#10b981" }
};

// Tooltip descriptions for each metric
const metricTooltips: Record<string, string> = {
  // Emissions & Energy
  co2Reduction: "Total greenhouse gas emissions reduced or avoided annually, measured in metric tons of CO2 equivalent",
  energyEfficiency: "Percentage improvement in energy usage compared to conventional alternatives or previous versions",
  renewableEnergyGenerated: "Clean energy produced annually through renewable sources",
  ghgEmissions: "Total greenhouse gas emissions generated in carbon dioxide equivalent",
  digitalSustainability: "Measures to reduce digital carbon footprint and improve tech sustainability",
  
  // Water & Resources
  waterSaved: "Total volume of water conserved or recycled annually",
  wasteDiverted: "Amount of waste diverted from landfills through recycling, reuse, or other waste management strategies",
  waterQualityImprovement: "Percentage improvement in water quality parameters",
  resourceEfficiency: "Improved efficiency in resource utilization",
  plasticReduction: "Amount of plastic waste reduced or prevented annually",
  
  // Biodiversity & Land
  biodiversityImpact: "Effects on local and global biodiversity and ecosystems",
  landAreaPreserved: "Total land area conserved, preserved, or restored through environmental initiatives",
  habitatCreation: "Creation or restoration of natural habitats for wildlife",
  speciesProtected: "Number of species protected through conservation efforts",
  soilHealthImprovement: "Improvement in soil quality and health",
  desertificationPrevention: "Prevention of land degradation and desertification",
  ecosystemServicesValue: "Economic value of ecosystem services provided",
  
  // Lifecycle Metrics - Materials & Design
  circularity: "Percentage of materials or components that are recycled, reused, or biodegradable",
  recycledMaterials: "Percentage of materials used that come from recycled sources",
  wasteReduction: "Percentage reduction in waste generated compared to previous operations",
  supplyChainReduction: "Percentage reduction in emissions throughout the supply chain",
  productLifespan: "Average useful life of products in years",
  
  // Carbon specific
  carbonCaptured: "Total amount of CO2 sequestered or captured annually",
  lifecycleCo2Reduction: "Percentage reduction in CO2 emissions across the entire product lifecycle"
};

// Function to get enhanced icon for a metric
function getEnhancedMetricIcon(metricKey: string) {
  return enhancedMetricIcons[metricKey] || enhancedMetricIcons.default;
}

// Impact Metrics Categories - keeping all original content
const impactMetricsCategories: CategoriesCollection = {
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
// Lifecycle Categories - keeping all original content
const lifecycleCategories: CategoriesCollection = {
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

// Progress bar component for percentage values - simplified design
function ProgressBar({ value, colorClass = "bg-emerald-500" }: { value: number, colorClass?: string }) {
  const safeValue = Math.min(Math.max(value, 0), 100); // Ensure value is between 0-100
  
  return (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-1">
      <div 
        className={`h-2 rounded-full ${colorClass}`} 
        style={{ width: `${safeValue}%` }}
      ></div>
    </div>
  );
}

// Enhanced metric card component with tooltip and description
function MetricCard({ 
  metricKey,
  value, 
  label, 
  unit,
  description
}: { 
  metricKey: string;
  value: string | number | null | undefined; 
  label: string; 
  unit: string;
  description?: string;
}) {
  if (value === null || value === undefined) return null;
  
  const iconData = getEnhancedMetricIcon(metricKey);
  const Icon = iconData.icon;
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value));
  const isPercentage = unit === '%';
  const tooltip = metricTooltips[metricKey];
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="rounded-full p-1.5 flex-shrink-0" style={{ backgroundColor: `${iconData.color}20` }}>
          <Icon className="h-4 w-4" style={{ color: iconData.color }} />
        </div>
        <div className="flex items-center gap-1 flex-1">
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium truncate">{label}</p>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-slate-400 cursor-help flex-shrink-0" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      
      {isPercentage && !isNaN(numericValue) && (
        <ProgressBar value={numericValue} />
      )}
      
      <div className="text-lg font-semibold mt-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit ? ` ${unit}` : ''}
      </div>
      
     {/* Display the description if available */}
     {description && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

// Category card component with expandable metrics
function CategoryCard({ 
  title, 
  metrics,
  id,
}: { 
  title: string;
  metrics: MetricData[];
  id: string;
}) {
  return (
    <div id={id} className="mb-5">
      <Card className="overflow-hidden">
        <CardHeader className="p-4 pb-3 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="text-base sm:text-lg font-medium">{title}</CardTitle>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {metrics.map((metric) => (
              <MetricCard 
                key={metric.key}
                metricKey={metric.key}
                label={metric.label}
                value={metric.value}
                unit={metric.unit}
                description={metric.description}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Badge list component for certifications and SDGs
function BadgeList({ items, icon: Icon, color }: { items: string[], icon: React.ElementType, color: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.filter(item => item !== null && item !== undefined && item !== "").map((item) => (
        <Badge key={item} variant="outline" className="flex items-center gap-1 text-xs p-1.5">
          <Icon className="h-3.5 w-3.5" style={{ color: color }} />
          <span className="truncate max-w-[150px] sm:max-w-full">{item}</span>
        </Badge>
      ))}
    </div>
  );
}

// Helper to safely render any value as a React node
function renderValue(value: any): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  
  // Filter out zero values and empty strings
  if (value === 0) return undefined;
  if (typeof value === 'string' && (value === "" || value === "0" || value === "0%")) {
    return undefined;
  }
  
  if (typeof value === 'string') {
    return value.trim() === "" ? undefined : value;
  }
  
  if (typeof value === 'number') {
    return value === 0 ? undefined : String(value);
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : undefined; // Don't show "No" values
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) return undefined;
    return JSON.stringify(value);
  }
  
  if (typeof value === 'object') {
    if (Object.keys(value).length === 0) return undefined;
    return JSON.stringify(value);
  }
  
  // Fall back to string representation
  const strValue = String(value);
  return strValue.trim() === "" ? undefined : strValue;
}

export function ClimateImpactDisplay({ climateImpacts = [], initialTab = "overview", standalone = true }: ClimateImpactDisplayProps) {
  // Early return if no climate impacts
  if (!climateImpacts || climateImpacts.length === 0) {
    return null;
  }
  
  // Get the most recent active impact
  const impact = climateImpacts
    .filter(imp => imp.isActive)
    .sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

  if (!impact) return null;

  // Helper function to get a metric value, checking both the direct property and metrics object
  const getMetricValue = (key: string): any => {
    let value;
    
    // First check in the metrics object (new format)
    if (impact.metrics && typeof impact.metrics === 'object' && key in impact.metrics) {
      value = impact.metrics[key as keyof typeof impact.metrics];
    } 
    // Then check direct properties (old format)
    else if (key in impact) {
      value = impact[key as keyof typeof impact];
    } else {
      return undefined;
    }
    
    // Filter out empty values, zeroes, "0", "0%", etc.
    if (value === 0) return undefined;
    if (value === null || value === undefined) return undefined;
    if (typeof value === 'string' && (value === "" || value === "0" || value.toString() === "0%")) return undefined;
    
    return value;
  };

  // Helper function to get metric description
  const getMetricDescription = (key: string): string | undefined => {
    const descriptionKey = `${key}Description`;
    
    // Check in the metrics object (new format)
    if (impact.metrics && typeof impact.metrics === 'object' && descriptionKey in impact.metrics) {
      return impact.metrics[descriptionKey as keyof typeof impact.metrics];
    }
    
    // Check direct properties (old format)
    if (descriptionKey in impact) {
      return impact[descriptionKey as keyof typeof impact];
    }
    
    return undefined;
  };

  // Helper function to get lifecycle metric value
  const getLifecycleValue = (key: string): any => {
    if (!impact.lifecycle) return undefined;
    
    if (!(key in impact.lifecycle)) {
      return undefined;
    }
    
    const value = impact.lifecycle[key as keyof typeof impact.lifecycle];
    
    // Filter out empty values, zeroes, "0", "0%", etc.
    if (value === 0) return undefined;
    if (value === null || value === undefined) return undefined;
    if (typeof value === 'string' && (value === "" || value === "0" || value.toString() === "0%")) return undefined;
    
    return value;
  };

  // Helper function to get lifecycle metric description
  const getLifecycleDescription = (key: string): string | undefined => {
    const descriptionKey = `${key}Description`;
    
    if (!impact.lifecycle) return undefined;
    
    if (!(descriptionKey in impact.lifecycle)) {
      return undefined;
    }
    
    return impact.lifecycle[descriptionKey as keyof typeof impact.lifecycle];
  };

  // Organize metrics by category
  const collectCategoryMetrics = (
    categoryKey: string, 
    categoryData: Category, 
    valueGetter: (key: string) => any,
    descriptionGetter: (key: string) => string | undefined
  ): MetricData[] => {
    const metrics: MetricData[] = [];
    
    Object.entries(categoryData.metrics).forEach(([metricKey, metricInfo]) => {
      const value = valueGetter(metricKey);
      if (value !== undefined) {
        metrics.push({
          key: metricKey,
          label: metricInfo.label,
          value,
          unit: metricInfo.unit,
          description: descriptionGetter(metricKey)
        });
      }
    });
    
    return metrics;
  };

  // Organize impact metrics by category
  const impactMetricsByCategory: Record<string, MetricData[]> = {};
  Object.entries(impactMetricsCategories).forEach(([categoryKey, categoryData]) => {
    const metrics = collectCategoryMetrics(categoryKey, categoryData, getMetricValue, getMetricDescription);
    if (metrics.length > 0) {
      impactMetricsByCategory[categoryKey] = metrics;
    }
  });

  // Organize lifecycle metrics by category
  const lifecycleMetricsByCategory: Record<string, MetricData[]> = {};
  if (impact.lifecycle) {
    Object.entries(lifecycleCategories).forEach(([categoryKey, categoryData]) => {
      const metrics = collectCategoryMetrics(categoryKey, categoryData, getLifecycleValue, getLifecycleDescription);
      if (metrics.length > 0) {
        lifecycleMetricsByCategory[categoryKey] = metrics;
      }
    });
  }

  // Find key metrics for spotlight section
  const keyMetrics: MetricData[] = [
    { 
      key: 'co2Reduction', 
      value: getMetricValue('co2Reduction'), 
      label: 'CO₂ Reduction', 
      unit: 'tons/year',
      description: getMetricDescription('co2Reduction')
    },
    { 
      key: 'waterSaved', 
      value: getMetricValue('waterSaved'), 
      label: 'Water Saved', 
      unit: 'L/year',
      description: getMetricDescription('waterSaved')
    },
    { 
      key: 'energyEfficiency', 
      value: getMetricValue('energyEfficiency'), 
      label: 'Energy Efficiency', 
      unit: '%',
      description: getMetricDescription('energyEfficiency')
    },
    { 
      key: 'wasteDiverted', 
      value: getMetricValue('wasteDiverted'), 
      label: 'Waste Diverted', 
      unit: 'tons/year',
      description: getMetricDescription('wasteDiverted')
    },
    { 
      key: 'recycledMaterials', 
      value: getLifecycleValue('recycledMaterials'), 
      label: 'Recycled Materials', 
      unit: '%',
      description: getLifecycleDescription('recycledMaterials')
    },
    { 
      key: 'productLifespan', 
      value: getLifecycleValue('productLifespan'), 
      label: 'Product Lifespan', 
      unit: 'years',
      description: getLifecycleDescription('productLifespan')
    }
  ].filter(metric => metric.value !== undefined);

  // Check if we have SDGs or certifications
  const hasSDGs = impact.sdgs && impact.sdgs.length > 0 && impact.sdgs.some(sdg => sdg !== null && sdg !== undefined && String(sdg) !== "");
  const hasCertifications = impact.certifications && impact.certifications.length > 0 && impact.certifications.some(cert => cert !== null && cert !== undefined && String(cert) !== "");

  // Based on the initialTab prop, render the appropriate content
  switch (initialTab) {
    case "overview":
      return (
        <div className="w-full">
          {/* SDGs section if available */}
          {hasSDGs && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">UN Sustainable Development Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <BadgeList 
                  items={impact.sdgs?.filter(sdg => sdg !== null && sdg !== undefined && String(sdg) !== "").map(sdg => `SDG ${sdg}`) || []}
                  icon={FileBadge}
                  color="#3b82f6"
                />
                
                {impact.sdgImpact && impact.sdgImpact !== "" && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-3">
                    {renderValue(impact.sdgImpact)}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Impact summary with key metrics */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Impact Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {keyMetrics.slice(0, 3).map(metric => (
                  <MetricCard
                    key={metric.key}
                    metricKey={metric.key}
                    value={metric.value}
                    label={metric.label}
                    unit={metric.unit}
                    description={metric.description}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Biodiversity impact if available */}
          {getMetricValue('biodiversityImpact') && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Biodiversity Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {renderValue(getMetricValue('biodiversityImpact'))}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      );
    
    case "impact":
      // Render just impact metrics
      if (Object.keys(impactMetricsByCategory).length === 0) {
        return (
          <Card>
            <CardContent className="p-4 md:p-6 text-center">
              <p className="text-muted-foreground text-sm md:text-base">No impact metrics data available.</p>
            </CardContent>
          </Card>
        );
      }
      
      return (
        <div className="mt-2">
          {Object.entries(impactMetricsByCategory).map(([categoryKey, metrics]) => {
            const categoryLabel = impactMetricsCategories[categoryKey]?.label || categoryKey;
            
            return (
              <CategoryCard
                key={`impact-${categoryKey}`}
                id={`impact-${categoryKey}`}
                title={categoryLabel}
                metrics={metrics}
              />
            );
          })}
        </div>
      );
    
    case "lifecycle":
      // Render just lifecycle metrics
      if (Object.keys(lifecycleMetricsByCategory).length === 0) {
        return (
          <Card>
            <CardContent className="p-4 md:p-6 text-center">
              <p className="text-muted-foreground text-sm md:text-base">No lifecycle assessment data available.</p>
            </CardContent>
          </Card>
        );
      }
      
      return (
        <div className="mt-2">
          {Object.entries(lifecycleMetricsByCategory).map(([categoryKey, metrics]) => {
            const categoryLabel = lifecycleCategories[categoryKey]?.label || categoryKey;
            
            return (
              <CategoryCard
                key={`lifecycle-${categoryKey}`}
                id={`lifecycle-${categoryKey}`}
                title={categoryLabel}
                metrics={metrics}
              />
            );
          })}
        </div>
      );
    
    case "certifications":
      // Render just certifications
      return (
        <Card>
          <CardContent className="p-4">
            {hasCertifications && (
              <div className="mb-4">
                <h4 className="text-base font-medium mb-2">Recognized Standards</h4>
                <BadgeList 
                  items={impact.certifications.filter(cert => cert !== null && cert !== undefined && String(cert) !== "") || []}
                  icon={ShieldCheck}
                  color="#8b5cf6"
                />
              </div>
            )}
            
            {impact.awards && impact.awards !== "" && (
              <div>
                <h4 className="text-base font-medium mb-2">Awards & Recognition</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {renderValue(impact.awards)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      );
      
    case "carbon":
      // Render just carbon impact
      return (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {getMetricValue('carbonCaptured') && (
              <MetricCard
                metricKey="carbonCaptured"
                value={getMetricValue('carbonCaptured')}
                label="Carbon Captured"
                unit="tons/year"
                description={getMetricDescription('carbonCaptured')}
              />
            )}
            
            {getMetricValue('lifecycleCo2Reduction') && (
              <MetricCard
                metricKey="lifecycleCo2Reduction"
                value={getMetricValue('lifecycleCo2Reduction')}
                label="Lifecycle CO₂ Reduction"
                unit="%"
                description={getMetricDescription('lifecycleCo2Reduction')}
              />
            )}
          </div>
          
          {impact.offsetPrograms && impact.offsetPrograms !== "" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Offset Programs</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 text-sm text-slate-600 dark:text-slate-300">
                {renderValue(impact.offsetPrograms)}
              </CardContent>
            </Card>
          )}
        </div>
      );
      
    default:
      // By default, return the overview
      return (
        <div className="w-full">
          <Card>
            <CardContent className="p-4 md:p-6 text-center">
              <p className="text-muted-foreground text-sm md:text-base">Please select a valid tab.</p>
            </CardContent>
          </Card>
        </div>
      );
  }
}