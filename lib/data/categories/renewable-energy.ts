import { Category } from "@/lib/types/categories";

export const renewableEnergy: Category = {
  id: "renewable-energy",
  name: "Renewable Energy",
  description: "Clean and sustainable energy solutions for a greener future",
  subcategories: [
    {
      id: "solar",
      name: "Solar Power",
      description: "Solar energy technologies and innovations"
    },
    {
      id: "wind",
      name: "Wind Energy",
      description: "Wind power solutions and technology"
    },
    {
      id: "hydro",
      name: "Hydropower",
      description: "Hydroelectric and water-based energy solutions"
    },
    {
      id: "geothermal",
      name: "Geothermal Energy",
      description: "Earth's heat-based energy solutions"
    },
    {
      id: "bioenergy",
      name: "Bioenergy",
      description: "Biomass and biological energy solutions"
    },
    {
      id: "energy-storage",
      name: "Energy Storage",
      description: "Battery and energy storage technologies"
    }
  ]
};