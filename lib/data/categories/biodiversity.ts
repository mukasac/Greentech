import { Category } from "@/lib/types/categories";

export const biodiversity: Category = {
  id: "biodiversity",
  name: "Biodiversity",
  description: "Solutions for biodiversity conservation and restoration",
  subcategories: [
    {
      id: "forest-conservation",
      name: "Forest Conservation",
      description: "Forest protection and management"
    },
    {
      id: "habitat-restoration",
      name: "Habitat Restoration",
      description: "Ecosystem restoration technologies"
    },
    {
      id: "wildlife-protection",
      name: "Wildlife Protection",
      description: "Wildlife conservation solutions"
    },
    {
      id: "biodiversity-monitoring",
      name: "Biodiversity Monitoring",
      description: "Species tracking and monitoring"
    },
    {
      id: "urban-biodiversity",
      name: "Urban Biodiversity",
      description: "City biodiversity enhancement"
    }
  ]
};