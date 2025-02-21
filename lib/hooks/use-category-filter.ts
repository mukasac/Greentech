"use client";

import { useState } from "react";
import { MainCategory } from "@/lib/types/categories";
import { Startup } from "@/lib/types/startup";

export function useCategoryFilter() {
  const [selectedCategories, setSelectedCategories] = useState<MainCategory[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: MainCategory) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategoryId)) {
        return prev.filter(id => id !== subcategoryId);
      }
      return [...prev, subcategoryId];
    });
  };

  const filterStartupsByCategory = (startups: Startup[]) => {
    if (selectedCategories.length === 0 && selectedSubcategories.length === 0) {
      return startups;
    }

    return startups.filter(startup => {
      const categoryMatch = selectedCategories.length === 0 || 
        selectedCategories.includes(startup.mainCategory);
      
      const subcategoryMatch = selectedSubcategories.length === 0 ||
        startup.subcategories.some(sub => selectedSubcategories.includes(sub));

      return categoryMatch || subcategoryMatch;
    });
  };

  return {
    selectedCategories,
    selectedSubcategories,
    toggleCategory,
    toggleSubcategory,
    filterStartupsByCategory
  };
}