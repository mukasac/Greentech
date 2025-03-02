"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Info,
  ArrowUpRight
} from "lucide-react";
import { ClimateImpact as StartupClimateImpact } from "@/lib/types/startup";
import { 
  getMetricIcon, 
  getCategoryIcon, 
  ColoredIcon, 
  certificationIcon,
  defaultIcon
} from "../utils/climate-impact-icons";
import { ReactNode } from "react";

// Define TypeScript interfaces for better type safety
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
}

// Define metric units
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

// Impact Metrics Categories
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

// Lifecycle Categories
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

function MetricCard({ 
  metricKey,
  value, 
  label, 
  unit 
}: { 
  metricKey: string;
  value: string | number | null | undefined; 
  label: string; 
  unit: string;
}) {
  if (value === null || value === undefined) return null;
  
  const iconData = getMetricIcon(metricKey);
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-2 flex-shrink-0">
          <ColoredIcon 
            icon={iconData.icon} 
            color={iconData.color} 
            size={18} 
          />
        </div>
        <div>
          <div className="text-lg md:text-xl font-bold">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {unit ? ` ${unit}` : ''}
          </div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
}

// Helper function to safely convert a value to string or number type
function normalizeValue(value: any): string | number | null | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  
  // Filter out zero values and empty strings
  if (value === 0) return undefined;
  if (typeof value === 'string' && (value === "" || value === "0" || value === "0%")) {
    return undefined;
  }
  
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) return undefined;
    return `${value.length} items`;
  }
  
  if (typeof value === 'object') {
    if (Object.keys(value).length === 0) return undefined;
    return '[Object]';
  }
  
  // Fall back to string representation
  const strValue = String(value);
  return strValue.trim() === "" ? undefined : strValue;
}

// Helper to safely render any value as a React node
function renderValue(value: any): ReactNode {
  if (value === null || value === undefined) {
    return null;
  }
  
  // Filter out zero values and empty strings
  if (value === 0) return null;
  if (typeof value === 'string' && (value === "" || value === "0" || value === "0%")) {
    return null;
  }
  
  if (typeof value === 'string') {
    return value.trim() === "" ? null : value;
  }
  
  if (typeof value === 'number') {
    return value === 0 ? null : String(value);
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : null; // Don't show "No" values
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return JSON.stringify(value);
  }
  
  if (typeof value === 'object') {
    if (Object.keys(value).length === 0) return null;
    return JSON.stringify(value);
  }
  
  // Fall back to string representation
  const strValue = String(value);
  return strValue.trim() === "" ? null : strValue;
}

export function ClimateImpactDisplay({ climateImpacts = [] }: ClimateImpactDisplayProps) {
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
    if (typeof value === 'string' && (value === "" || value === "0" || value === "0%")) return undefined;
    
    return value;
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
    if (typeof value === 'string' && (value === "" || value === "0" || value === "0%")) return undefined;
    
    return value;
  };

  // Group metrics by category for better organization
  const groupMetricsByCategory = () => {
    const groupedMetrics: Record<string, { label: string, metrics: Array<{ key: string, label: string, value: any, unit: string }> }> = {};
    
    // Process impact metrics
    Object.entries(impactMetricsCategories).forEach(([categoryKey, category]) => {
      const metrics: Array<{ key: string, label: string, value: any, unit: string }> = [];
      
      Object.entries(category.metrics).forEach(([metricKey, metricInfo]) => {
        const value = getMetricValue(metricKey);
        if (value !== undefined) {
          metrics.push({
            key: metricKey,
            label: metricInfo.label,
            value,
            unit: metricInfo.unit
          });
        }
      });
      
      if (metrics.length > 0) {
        groupedMetrics[categoryKey] = {
          label: category.label,
          metrics
        };
      }
    });
    
    return groupedMetrics;
  };

  // Group lifecycle metrics by category
  const groupLifecycleByCategory = () => {
    if (!impact.lifecycle) return {};
    
    const groupedMetrics: Record<string, { label: string, metrics: Array<{ key: string, label: string, value: any, unit: string }> }> = {};
    
    Object.entries(lifecycleCategories).forEach(([categoryKey, category]) => {
      const metrics: Array<{ key: string, label: string, value: any, unit: string }> = [];
      
      Object.entries(category.metrics).forEach(([metricKey, metricInfo]) => {
        const value = getLifecycleValue(metricKey);
        if (value !== undefined) {
          metrics.push({
            key: metricKey,
            label: metricInfo.label,
            value,
            unit: metricInfo.unit
          });
        }
      });
      
      if (metrics.length > 0) {
        groupedMetrics[categoryKey] = {
          label: category.label,
          metrics
        };
      }
    });
    
    return groupedMetrics;
  };

  // Filter metrics based on search term
  const filterMetrics = (category: Category, section: 'metrics' | 'lifecycle'): MetricsCollection => {
    return category.metrics;
  };

  // Check if a category has any values and matches search
  const categoryHasValues = (category: Category, section: 'metrics' | 'lifecycle'): boolean => {
    const filteredMetrics = filterMetrics(category, section);
    
    for (const [key, _] of Object.entries(filteredMetrics)) {
      const value = section === 'metrics' 
        ? getMetricValue(key) 
        : getLifecycleValue(key);
      
      if (value !== undefined) {
        return true;
      }
    }
    
    return false;
  };

  // Count the number of metrics with values
  const countMetricsWithValues = () => {
    let count = 0;
    
    // Count impact metrics
    Object.values(impactMetricsCategories).forEach(category => {
      Object.keys(category.metrics).forEach(key => {
        const value = getMetricValue(key);
        if (value !== undefined) {
          count++;
        }
      });
    });
    
    // Count lifecycle metrics
    if (impact.lifecycle) {
      Object.values(lifecycleCategories).forEach(category => {
        Object.keys(category.metrics).forEach(key => {
          const value = getLifecycleValue(key);
          if (value !== undefined) {
            count++;
          }
        });
      });
    }
    
    return count;
  };

  // The total number of metrics with values
  const totalMetrics = countMetricsWithValues();

  // Get all grouped metrics
  const groupedImpactMetrics = groupMetricsByCategory();
  const groupedLifecycleMetrics = groupLifecycleByCategory();
  
  // Are there any metrics to display?
  const hasAnyMetrics = Object.keys(groupedImpactMetrics).length > 0 || 
                        Object.keys(groupedLifecycleMetrics).length > 0 ||
                        impact.sdgs?.length > 0 || 
                        impact.certifications?.length > 0;
                        
  if (!hasAnyMetrics) return null;

  // Find key metrics for highlight section
  const keyMetrics = [
    { key: 'co2Reduction', value: getMetricValue('co2Reduction'), label: 'CO₂ Reduction', unit: 'tons/year' },
    { key: 'waterSaved', value: getMetricValue('waterSaved'), label: 'Water Saved', unit: 'L/year' },
    { key: 'energyEfficiency', value: getMetricValue('energyEfficiency'), label: 'Energy Efficiency', unit: '%' },
    { key: 'wasteDiverted', value: getMetricValue('wasteDiverted'), label: 'Waste Diverted', unit: 'tons/year' },
    { key: 'renewableEnergyGenerated', value: getMetricValue('renewableEnergyGenerated'), label: 'Renewable Energy', unit: 'kWh/year' },
    { key: 'circularity', value: getLifecycleValue('circularity'), label: 'Circularity', unit: '%' },
    { key: 'recycledMaterials', value: getLifecycleValue('recycledMaterials'), label: 'Recycled Materials', unit: '%' },
    { key: 'productLifespan', value: getLifecycleValue('productLifespan'), label: 'Product Lifespan', unit: 'years' }
  ].filter(metric => {
    // Ensure we filter out zero values, "0", "0%", etc.
    if (metric.value === undefined || metric.value === null) return false;
    
    if (typeof metric.value === 'number') {
      return metric.value !== 0;
    }
    
    if (typeof metric.value === 'string') {
      return metric.value !== "" && metric.value !== "0" && metric.value !== "0%";
    }
    
    return true;
  });

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 bg-gradient-to-b from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-950 rounded-xl">
      {/* Header with badge showing total metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-2xl font-bold flex items-center">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-2">
            <ColoredIcon 
              icon={defaultIcon.icon} 
              color={defaultIcon.color}
              size={24} 
            />
          </div>
          Climate Impact
        </h2>
        {keyMetrics.length > 0 && (
          <Badge variant="outline" className="text-xs px-2 py-1">
            {keyMetrics.length} sustainability metrics
          </Badge>
        )}
      </div>
      
      {/* Key Metrics Highlights */}
      {keyMetrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {keyMetrics.slice(0, 8).map((metric) => (
            <MetricCard
              key={metric.key}
              metricKey={metric.key}
              value={normalizeValue(metric.value)}
              label={metric.label}
              unit={metric.unit}
            />
          ))}
        </div>
      )}
      
      {/* Biodiversity Impact (if available) */}
      {getMetricValue('biodiversityImpact') && (
        <Card className="overflow-hidden border-emerald-100 dark:border-emerald-900 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 pt-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/40 dark:to-blue-950/30">
            <CardTitle className="text-lg flex items-center">
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-2">
                <ColoredIcon 
                  icon={getMetricIcon("biodiversityImpact").icon} 
                  color={getMetricIcon("biodiversityImpact").color}
                  size={18} 
                />
              </div>
              Biodiversity Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {renderValue(getMetricValue('biodiversityImpact'))}
            </p>
          </CardContent>
        </Card>
      )}

      {/* SDGs Section */}
      {impact.sdgs && impact.sdgs.length > 0 && impact.sdgs.some(sdg => sdg !== null && sdg !== undefined && sdg !== "") && (
        <Card className="overflow-hidden border-emerald-100 dark:border-emerald-900 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-0 pt-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/40 dark:to-blue-950/30">
            <CardTitle className="text-lg flex items-center">
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-2">
                <ColoredIcon 
                  icon={certificationIcon.icon} 
                  color={certificationIcon.color}
                  size={18} 
                />
              </div>
              UN Sustainable Development Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              {impact.sdgs.filter(sdg => sdg !== null && sdg !== undefined && sdg !== "").map((sdg) => (
                <Badge key={sdg} variant="outline" className="flex items-center text-sm p-2">
                  <ColoredIcon 
                    icon={certificationIcon.icon} 
                    color={certificationIcon.color} 
                    className="mr-1" 
                    size={12} 
                  />
                  SDG {sdg}
                </Badge>
              ))}
            </div>
            {impact.sdgImpact && impact.sdgImpact !== "" && (
              <p className="mt-4 text-muted-foreground">
                {renderValue(impact.sdgImpact)}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Certifications & Awards */}
      {((impact.certifications && impact.certifications.length > 0 && impact.certifications.some(cert => cert !== null && cert !== undefined && cert !== "")) || 
        (impact.awards && impact.awards !== "" && impact.awards !== null && impact.awards !== undefined)) && (
        <Card className="overflow-hidden border-emerald-100 dark:border-emerald-900 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-0 pt-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/40 dark:to-blue-950/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <ColoredIcon 
                  icon={certificationIcon.icon} 
                  color={certificationIcon.color}
                  size={18} 
                />
              </div>
              Certifications & Awards
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {impact.certifications && impact.certifications.length > 0 && impact.certifications.some(cert => cert !== null && cert !== undefined && cert !== "") && (
              <div className="flex flex-wrap gap-2 mb-4">
                {impact.certifications.filter(cert => cert !== null && cert !== undefined && cert !== "").map((cert) => (
                  <Badge key={cert} variant="secondary" className="flex items-center p-2">
                    <ColoredIcon 
                      icon={certificationIcon.icon} 
                      color={certificationIcon.color} 
                      className="mr-1" 
                      size={12} 
                    />
                    {cert}
                  </Badge>
                ))}
              </div>
            )}
            {impact.awards && impact.awards !== "" && (
              <p className="text-muted-foreground">
                {renderValue(impact.awards)}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Grouped Impact Metrics */}
      {Object.keys(groupedImpactMetrics).length > 0 && (
        <div className="space-y-8">
          <h3 className="text-xl font-semibold border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center">
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-2">
              <ColoredIcon 
                icon={getMetricIcon("co2Reduction").icon} 
                color={getMetricIcon("co2Reduction").color}
                size={20} 
              />
            </div>
            Impact Metrics
          </h3>
          
          {Object.entries(groupedImpactMetrics).map(([categoryKey, categoryData]) => {
            const categoryIconData = getCategoryIcon(categoryKey, "metrics");
            
            return (
              <div key={categoryKey} className="space-y-4">
                <h4 className="text-lg font-medium flex items-center">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-2">
                    <ColoredIcon 
                      icon={categoryIconData.icon} 
                      color={categoryIconData.color}
                      size={18} 
                    />
                  </div>
                  {categoryData.label}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryData.metrics.map((metric) => (
                    <div key={metric.key} className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-1.5 flex items-center justify-center">
                          <ColoredIcon 
                            icon={getMetricIcon(metric.key).icon} 
                            color={getMetricIcon(metric.key).color} 
                            size={14} 
                          />
                        </div>
                        <div className="font-medium text-sm">{metric.label}</div>
                      </div>
                      <div className="text-lg font-semibold">
                        {typeof metric.value === 'number' ? metric.value.toLocaleString() : renderValue(metric.value)}
                        {metric.unit ? ` ${metric.unit}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Grouped Lifecycle Metrics */}
      {Object.keys(groupedLifecycleMetrics).length > 0 && (
        <div className="space-y-8">
          <h3 className="text-xl font-semibold border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center">
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-2">
              <ColoredIcon 
                icon={getMetricIcon("circularity").icon} 
                color={getMetricIcon("circularity").color}
                size={20} 
              />
            </div>
            Lifecycle Impacts
          </h3>
          
          {Object.entries(groupedLifecycleMetrics).map(([categoryKey, categoryData]) => {
            const categoryIconData = getCategoryIcon(categoryKey, "lifecycle");
            
            // Special case for description
            if (categoryKey === "assessment-documentation" && 
                categoryData.metrics.length === 1 && 
                categoryData.metrics[0].key === "description") {
              return (
                <div key={categoryKey} className="space-y-4">
                  <h4 className="text-lg font-medium flex items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-2">
                      <ColoredIcon 
                        icon={categoryIconData.icon} 
                        color={categoryIconData.color}
                        size={18} 
                      />
                    </div>
                    Lifecycle Description
                  </h4>
                  <Card className="border-emerald-100 dark:border-emerald-900 shadow-sm">
                    <CardContent className="pt-6">
                      <p>{renderValue(categoryData.metrics[0].value)}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            }
            
            return (
              <div key={categoryKey} className="space-y-4">
                <h4 className="text-lg font-medium flex items-center">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-2">
                    <ColoredIcon 
                      icon={categoryIconData.icon} 
                      color={categoryIconData.color}
                      size={18} 
                    />
                  </div>
                  {categoryData.label}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryData.metrics
                    .filter(metric => metric.key !== "description")
                    .map((metric) => (
                      <div key={metric.key} className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-1.5 flex items-center justify-center">
                            <ColoredIcon 
                              icon={getMetricIcon(metric.key).icon} 
                              color={getMetricIcon(metric.key).color} 
                              size={14} 
                            />
                          </div>
                          <div className="font-medium text-sm">{metric.label}</div>
                        </div>
                        <div className="text-lg font-semibold">
                          {typeof metric.value === 'number' ? metric.value.toLocaleString() : renderValue(metric.value)}
                          {metric.unit ? ` ${metric.unit}` : ''}
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Carbon Footprint & Offsets Section */}
      {(
        (impact.carbonCaptured !== undefined && impact.carbonCaptured !== null && 
         ((typeof impact.carbonCaptured === 'number' && impact.carbonCaptured !== 0) || 
          (typeof impact.carbonCaptured === 'string' && impact.carbonCaptured !== "" && impact.carbonCaptured !== "0"))) || 
        (impact.lifecycleCo2Reduction !== undefined && impact.lifecycleCo2Reduction !== null && 
         ((typeof impact.lifecycleCo2Reduction === 'number' && impact.lifecycleCo2Reduction !== 0) || 
          (typeof impact.lifecycleCo2Reduction === 'string' && impact.lifecycleCo2Reduction !== "" && impact.lifecycleCo2Reduction !== "0"))) || 
        (impact.offsetPrograms && typeof impact.offsetPrograms === 'string' && impact.offsetPrograms.trim() !== "")
      ) ? (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center">
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-2">
              <ColoredIcon 
                icon={getMetricIcon("carbonCaptured").icon} 
                color={getMetricIcon("carbonCaptured").color}
                size={20} 
              />
            </div>
            Carbon Footprint & Offsets
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {impact.carbonCaptured !== undefined && impact.carbonCaptured !== null && 
             ((typeof impact.carbonCaptured === 'number' && impact.carbonCaptured !== 0) || 
              (typeof impact.carbonCaptured === 'string' && impact.carbonCaptured !== "" && impact.carbonCaptured !== "0")) && (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-2 flex items-center justify-center">
                    <ColoredIcon 
                      icon={getMetricIcon("carbonCaptured").icon} 
                      color={getMetricIcon("carbonCaptured").color} 
                      size={16} 
                    />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {typeof impact.carbonCaptured === 'number' ? 
                        impact.carbonCaptured.toLocaleString() : 
                        renderValue(impact.carbonCaptured)} tons/year
                    </div>
                    <div className="text-sm text-muted-foreground">Carbon Captured</div>
                  </div>
                </div>
              </div>
            )}
            
            {impact.lifecycleCo2Reduction !== undefined && impact.lifecycleCo2Reduction !== null && 
             ((typeof impact.lifecycleCo2Reduction === 'number' && impact.lifecycleCo2Reduction !== 0) || 
              (typeof impact.lifecycleCo2Reduction === 'string' && impact.lifecycleCo2Reduction !== "" && impact.lifecycleCo2Reduction !== "0")) && (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-2 flex items-center justify-center">
                    <ColoredIcon 
                      icon={getMetricIcon("lifecycleCo2Reduction").icon} 
                      color={getMetricIcon("lifecycleCo2Reduction").color} 
                      size={16} 
                    />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {typeof impact.lifecycleCo2Reduction === 'number' ? 
                        impact.lifecycleCo2Reduction : 
                        renderValue(impact.lifecycleCo2Reduction)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Lifecycle CO₂ Reduction</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {impact.offsetPrograms && typeof impact.offsetPrograms === 'string' && impact.offsetPrograms.trim() !== "" && (
            <Card className="border-emerald-100 dark:border-emerald-900 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <CardContent className="pt-6">
                <h4 className="font-medium mb-2 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-2">
                    <ColoredIcon 
                      icon={getMetricIcon("carbonCaptured").icon} 
                      color={getMetricIcon("carbonCaptured").color} 
                      size={16} 
                    />
                  </div>
                  Offset Programs
                </h4>
                <p className="text-muted-foreground">{renderValue(impact.offsetPrograms)}</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
      
      {/* Mobile-friendly bottom padding */}
      <div className="h-6 sm:h-8 md:h-10"></div>
    </div>
  );
}