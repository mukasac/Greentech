import {
    Leaf,
    TreePine,
    Trophy,
    Droplets,
    Recycle,
    Wind,
    Fish,
    Factory,
    Truck,
    Box,
    Microscope,
    Building,
    Heart,
    ShieldCheck,
    Mountain,
    Router,
    Bird,
    Waves,
    Flower
  } from "lucide-react";
  
  // Color palette
  const colors = {
    green: "#2ecc71",        // Vibrant green for sustainability
    darkGreen: "#27ae60",    // Darker green for nature/forests
    blue: "#3498db",         // Blue for water
    darkBlue: "#2980b9",     // Darker blue for oceans
    lightBlue: "#87CEEB",    // Sky blue for air/wind
    brown: "#cd853f",        // Brown for earth/soil
    orange: "#e67e22",       // Orange for energy
    red: "#e74c3c",          // Red for warnings/alerts
    purple: "#9b59b6",       // Purple for innovation/tech
    gold: "#f1c40f",         // Gold for awards/recognition
    gray: "#7f8c8d",         // Gray for industrial
    pink: "#e84393",         // Pink for social/health
    teal: "#1abc9c"          // Teal for recycling/circular economy
  };
  
  // Interface for icon with color
  interface ColoredIcon {
    icon: any;
    color: string;
  }
  
  // Icon mappings for metric categories with colors
  export const impactMetricIcons: Record<string, ColoredIcon> = {
    "emissions-energy": { icon: Wind, color: colors.lightBlue },
    "water-resources": { icon: Droplets, color: colors.blue },
    "biodiversity-land": { icon: Mountain, color: colors.brown },
    "social-health": { icon: Heart, color: colors.pink },
    "pollution-reduction": { icon: ShieldCheck, color: colors.red },
    "other-impacts": { icon: Leaf, color: colors.green },
  };
  
  // Icon mappings for lifecycle categories with colors
  export const lifecycleIcons: Record<string, ColoredIcon> = {
    "materials-design": { icon: Box, color: colors.orange },
    "production-manufacturing": { icon: Factory, color: colors.gray },
    "supply-chain": { icon: Truck, color: colors.darkBlue },
    "use-performance": { icon: Building, color: colors.purple },
    "end-of-life": { icon: Recycle, color: colors.teal },
    "assessment-documentation": { icon: Microscope, color: colors.purple },
  };
  
  // Icons for individual metrics with colors
  export const metricIcons: Record<string, ColoredIcon> = {
    // Emissions & Energy
    co2Reduction: { icon: Wind, color: colors.lightBlue },
    energyEfficiency: { icon: Leaf, color: colors.green },
    renewableEnergyGenerated: { icon: Wind, color: colors.lightBlue },
    ghgEmissions: { icon: Factory, color: colors.gray },
    digitalSustainability: { icon: Router, color: colors.purple },
    
    // Water & Resources
    waterSaved: { icon: Droplets, color: colors.blue },
    wasteDiverted: { icon: Recycle, color: colors.teal },
    waterQualityImprovement: { icon: Waves, color: colors.darkBlue },
    resourceEfficiency: { icon: Recycle, color: colors.teal },
    plasticReduction: { icon: Recycle, color: colors.teal },
    
    // Biodiversity & Land
    biodiversityImpact: { icon: Bird, color: colors.darkGreen },
    landAreaPreserved: { icon: Mountain, color: colors.brown },
    habitatCreation: { icon: Flower, color: colors.darkGreen },
    speciesProtected: { icon: Bird, color: colors.darkGreen },
    soilHealthImprovement: { icon: Mountain, color: colors.brown },
    
    // Social & Health
    healthcareImpacts: { icon: Heart, color: colors.pink },
    socialImpactMetrics: { icon: Heart, color: colors.pink },
    
    // Carbon Footprint
    carbonCaptured: { icon: TreePine, color: colors.darkGreen },
    lifecycleCo2Reduction: { icon: TreePine, color: colors.darkGreen },
    
    // SDGs
    sdgs: { icon: Trophy, color: colors.gold },
    
    // Lifecycle
    circularity: { icon: Recycle, color: colors.teal },
    recycledMaterials: { icon: Recycle, color: colors.teal },
    wasteReduction: { icon: Recycle, color: colors.teal },
  };
  
  // Icon for certifications
  export const certificationIcon: ColoredIcon = { icon: Trophy, color: colors.gold };
  
  // Default icon if no specific icon is defined
  export const defaultIcon: ColoredIcon = { icon: Leaf, color: colors.green };
  
  // Helper function to get the appropriate icon for a metric
  export function getMetricIcon(metricKey: string): ColoredIcon {
    return metricIcons[metricKey as keyof typeof metricIcons] || defaultIcon;
  }
  
  // Helper function to get the appropriate icon for a category
  export function getCategoryIcon(categoryKey: string, type: 'metrics' | 'lifecycle'): ColoredIcon {
    if (type === 'metrics') {
      return impactMetricIcons[categoryKey as keyof typeof impactMetricIcons] || defaultIcon;
    } else {
      return lifecycleIcons[categoryKey as keyof typeof lifecycleIcons] || defaultIcon;
    }
  }
  
  // Component for rendering a colored icon
  export function ColoredIcon({ icon: Icon, color, className, size = 16 }: { 
    icon: any, 
    color: string, 
    className?: string,
    size?: number 
  }) {
    return <Icon className={className} color={color} size={size} />;
  }