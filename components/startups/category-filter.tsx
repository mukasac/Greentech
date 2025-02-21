"use client";

import { useCategoryFilter } from "@/lib/hooks/use-category-filter";
import { categories } from "@/lib/data/categories";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function CategoryFilter() {
  const {
    selectedCategories,
    selectedSubcategories,
    toggleCategory,
    toggleSubcategory
  } = useCategoryFilter();

  return (
    <Accordion type="multiple" className="w-full">
      {categories.map((category) => (
        <AccordionItem key={category.id} value={category.id}>
          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id={`category-${category.id}`}
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={() => toggleCategory(category.id)}
            />
            <AccordionTrigger className="text-sm hover:no-underline">
              <Label htmlFor={`category-${category.id}`} className="hover:no-underline">
                {category.name}
              </Label>
            </AccordionTrigger>
          </div>
          <AccordionContent>
            <div className="space-y-2 pl-6">
              {category.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subcategory-${subcategory.id}`}
                    checked={selectedSubcategories.includes(subcategory.id)}
                    onCheckedChange={() => toggleSubcategory(subcategory.id)}
                  />
                  <Label
                    htmlFor={`subcategory-${subcategory.id}`}
                    className="text-sm text-muted-foreground"
                  >
                    {subcategory.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}