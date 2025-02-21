export type MainCategory =
  | "renewable-energy"
  | "green-transportation"
  | "energy-efficiency"
  | "circular-economy"
  | "sustainable-agriculture"
  | "green-construction"
  | "water-tech"
  | "climate-tech"
  | "environmental-monitoring"
  | "sustainable-fashion"
  | "waste-innovation"
  | "green-finance"
  | "eco-products"
  | "biodiversity"
  | "cleantech-manufacturing"
  | "education-awareness"
  | "ai-data"
  | "policy-advocacy"
  | "ocean-arctic"
  | "health-sustainability";

export type Subcategory = {
  id: string;
  name: string;
  description: string;
};

export interface Category {
  id: MainCategory;
  name: string;
  description: string;
  subcategories: Subcategory[];
}