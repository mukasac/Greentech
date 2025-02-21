import { Category } from "../types/categories";

export const categories: Category[] = [
  {
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
  },
  // Add more categories following the same pattern...
];

export const getAllCategories = () => categories;

export const getCategoryById = (id: string) => 
  categories.find(category => category.id === id);

export const getSubcategoryById = (categoryId: string, subcategoryId: string) => {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};