import { Category } from "@/lib/types/categories";

export const greenTransportation: Category = {
  id: "green-transportation",
  name: "Green Transportation",
  description: "Sustainable mobility and transportation solutions",
  subcategories: [
    {
      id: "electric-vehicles",
      name: "Electric Vehicles",
      description: "Electric cars, trucks, and mobility solutions"
    },
    {
      id: "hydrogen-vehicles",
      name: "Hydrogen Vehicles",
      description: "Hydrogen fuel cell transportation"
    },
    {
      id: "sustainable-aviation",
      name: "Sustainable Aviation",
      description: "Green aviation technologies and solutions"
    },
    {
      id: "maritime",
      name: "Green Maritime",
      description: "Sustainable shipping and maritime innovations"
    },
    {
      id: "micro-mobility",
      name: "Micro-mobility",
      description: "Shared mobility and last-mile solutions"
    },
    {
      id: "public-transport",
      name: "Public Transportation",
      description: "Sustainable public transit solutions"
    }
  ]
};