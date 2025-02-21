import { Category } from "@/lib/types/categories";

export const environmentalMonitoring: Category = {
  id: "environmental-monitoring",
  name: "Environmental Monitoring",
  description: "Advanced solutions for environmental tracking and analysis",
  subcategories: [
    {
      id: "air-quality",
      name: "Air Quality Monitoring",
      description: "Air pollution tracking and analysis systems"
    },
    {
      id: "soil-monitoring",
      name: "Soil Health Monitoring",
      description: "Soil quality and composition analysis"
    },
    {
      id: "biodiversity-tracking",
      name: "Biodiversity Tracking",
      description: "Wildlife and ecosystem monitoring solutions"
    },
    {
      id: "remote-sensing",
      name: "Remote Sensing",
      description: "Satellite and aerial environmental monitoring"
    },
    {
      id: "water-quality",
      name: "Water Quality Monitoring",
      description: "Water pollution and quality tracking systems"
    }
  ]
};