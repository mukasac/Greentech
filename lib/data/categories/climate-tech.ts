import { Category } from "@/lib/types/categories";

export const climateTech: Category = {
  id: "climate-tech",
  name: "Climate Technology",
  description: "Solutions for climate change mitigation and adaptation",
  subcategories: [
    {
      id: "carbon-capture",
      name: "Carbon Capture",
      description: "CO2 capture and storage solutions"
    },
    {
      id: "emissions-monitoring",
      name: "Emissions Monitoring",
      description: "GHG emissions tracking and reporting"
    },
    {
      id: "climate-modeling",
      name: "Climate Modeling",
      description: "Climate prediction and risk assessment"
    },
    {
      id: "carbon-offsetting",
      name: "Carbon Offsetting",
      description: "Carbon credit and offset solutions"
    },
    {
      id: "climate-adaptation",
      name: "Climate Adaptation",
      description: "Climate resilience technologies"
    },
    {
      id: "methane-reduction",
      name: "Methane Reduction",
      description: "Methane capture and reduction solutions"
    }
  ]
};