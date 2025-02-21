import { Category } from "@/lib/types/categories";

export const energyEfficiency: Category = {
  id: "energy-efficiency",
  name: "Energy Efficiency",
  description: "Solutions for optimizing energy usage and reducing consumption",
  subcategories: [
    {
      id: "smart-grid",
      name: "Smart Grid",
      description: "Intelligent power distribution and management"
    },
    {
      id: "building-efficiency",
      name: "Building Efficiency",
      description: "Energy-efficient building solutions"
    },
    {
      id: "industrial-efficiency",
      name: "Industrial Efficiency",
      description: "Energy optimization for industrial processes"
    },
    {
      id: "smart-lighting",
      name: "Smart Lighting",
      description: "Energy-efficient lighting solutions"
    },
    {
      id: "heat-recovery",
      name: "Heat Recovery",
      description: "Heat recovery and reuse systems"
    }
  ]
};