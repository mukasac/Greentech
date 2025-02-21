import { Category } from "@/lib/types/categories";

export const circularEconomy: Category = {
  id: "circular-economy",
  name: "Circular Economy",
  description: "Solutions for sustainable resource use and waste reduction",
  subcategories: [
    {
      id: "recycling-tech",
      name: "Recycling Technology",
      description: "Advanced recycling and material recovery"
    },
    {
      id: "remanufacturing",
      name: "Remanufacturing",
      description: "Product restoration and remanufacturing solutions"
    },
    {
      id: "sharing-platforms",
      name: "Sharing Platforms",
      description: "Resource sharing and collaborative consumption"
    },
    {
      id: "product-lifecycle",
      name: "Product Lifecycle",
      description: "Lifecycle extension and circular design"
    },
    {
      id: "waste-reduction",
      name: "Waste Reduction",
      description: "Waste minimization and prevention"
    },
    {
      id: "material-innovation",
      name: "Material Innovation",
      description: "Sustainable and recyclable materials"
    }
  ]
};