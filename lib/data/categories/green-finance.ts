import { Category } from "@/lib/types/categories";

export const greenFinance: Category = {
  id: "green-finance",
  name: "Green Finance",
  description: "Financial solutions for sustainable development",
  subcategories: [
    {
      id: "carbon-trading",
      name: "Carbon Trading",
      description: "Carbon market and trading platforms"
    },
    {
      id: "impact-investing",
      name: "Impact Investing",
      description: "Sustainable investment platforms"
    },
    {
      id: "green-bonds",
      name: "Green Bonds",
      description: "Environmental project financing"
    },
    {
      id: "esg-analytics",
      name: "ESG Analytics",
      description: "Environmental and social governance tools"
    },
    {
      id: "climate-risk",
      name: "Climate Risk",
      description: "Climate risk assessment and insurance"
    },
    {
      id: "sustainable-banking",
      name: "Sustainable Banking",
      description: "Green banking and fintech solutions"
    }
  ]
};