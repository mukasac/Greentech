import { Category } from "@/lib/types/categories";

export const waterTech: Category = {
  id: "water-tech",
  name: "Water Technology",
  description: "Water management and conservation solutions",
  subcategories: [
    {
      id: "water-purification",
      name: "Water Purification",
      description: "Water treatment and purification systems"
    },
    {
      id: "wastewater-management",
      name: "Wastewater Management",
      description: "Wastewater treatment solutions"
    },
    {
      id: "ocean-cleanup",
      name: "Ocean Cleanup",
      description: "Marine pollution cleanup technologies"
    },
    {
      id: "flood-management",
      name: "Flood Management",
      description: "Flood prevention and control systems"
    },
    {
      id: "water-conservation",
      name: "Water Conservation",
      description: "Water-saving technologies"
    }
  ]
};