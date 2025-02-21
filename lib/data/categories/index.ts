import { Category } from "@/lib/types/categories";
import { renewableEnergy } from "./renewable-energy";
import { greenTransportation } from "./green-transportation";
import { energyEfficiency } from "./energy-efficiency";
import { circularEconomy } from "./circular-economy";
import { sustainableAgriculture } from "./sustainable-agriculture";
import { greenConstruction } from "./green-construction";
import { waterTech } from "./water-tech";
import { climateTech } from "./climate-tech";
import { environmentalMonitoring } from "./environmental-monitoring";
import { sustainableFashion } from "./sustainable-fashion";
import { greenFinance } from "./green-finance";
import { biodiversity } from "./biodiversity";
import { cleantechManufacturing } from "./cleantech-manufacturing";
import { educationAwareness } from "./education-awareness";
import { aiData } from "./ai-data";
import { policyAdvocacy } from "./policy-advocacy";
import { oceanArctic } from "./ocean-arctic";
import { healthSustainability } from "./health-sustainability";

export const categories: Category[] = [
  renewableEnergy,
  greenTransportation,
  energyEfficiency,
  circularEconomy,
  sustainableAgriculture,
  greenConstruction,
  waterTech,
  climateTech,
  environmentalMonitoring,
  sustainableFashion,
  greenFinance,
  biodiversity,
  cleantechManufacturing,
  educationAwareness,
  aiData,
  policyAdvocacy,
  oceanArctic,
  healthSustainability
];

export const getAllCategories = () => categories;

export const getCategoryById = (id: string) => 
  categories.find(category => category.id === id);

export const getSubcategoryById = (categoryId: string, subcategoryId: string) => {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};