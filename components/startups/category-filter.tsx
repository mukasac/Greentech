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
import { useEffect, useState } from "react";

export function CategoryFilter() {
  const {
    selectedCategories,
    selectedSubcategories,
    toggleCategory,
    toggleSubcategory,
  } = useCategoryFilter();
  const [categories, setCategories] = useState([]);
  const [setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch categories from the API route
        const response = await fetch("/api/category", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("data......", data);
        setCategories(data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Toggle category selection
  // const toggleCategory = (categoryId) => {
  //   setSelectedCategories(
  //     (prev) =>
  //       prev.includes(categoryId)
  //         ? prev.filter((id) => id !== categoryId)
  //         : [...prev, categoryId]
  //   );
  // };

  return (
    <Accordion type="multiple" className="w-full">
      {/* Static "Renewable Energy" Accordion Item */}
      <AccordionItem value="renewable-energy">
        <AccordionTrigger className="text-sm hover:no-underline">
          Renewable Energy
        </AccordionTrigger>
        <AccordionContent>
          {/* List of categories inside the "Renewable Energy" dropdown */}
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center space-x-2 py-2 pl-4"
            >
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label htmlFor={`category-${category.id}`} className="text-sm">
                {category.name}
              </Label>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
//   return (
//     <Accordion type="multiple" className="w-full">
//       {categories.map((category) => (
//         <AccordionItem key={category.id} value={category.id}>
//           <div className="flex items-center space-x-2 py-2">
//             <Checkbox
//               id={`category-${category.id}`}
//               checked={selectedCategories.includes(category.id)}
//               onCheckedChange={() => toggleCategory(category.id)}
//             />
//             <AccordionTrigger className="text-sm hover:no-underline">
//               <Label htmlFor={`category-${category.id}`} className="hover:no-underline">
//                 {category.name}
//               </Label>
//             </AccordionTrigger>
//           </div>
//           <AccordionContent>
//             <div className="space-y-2 pl-6">
//               {category.subcategories.map((subcategory) => (
//                 <div key={subcategory.id} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`subcategory-${subcategory.id}`}
//                     checked={selectedSubcategories.includes(subcategory.id)}
//                     onCheckedChange={() => toggleSubcategory(subcategory.id)}
//                   />
//                   <Label
//                     htmlFor={`subcategory-${subcategory.id}`}
//                     className="text-sm text-muted-foreground"
//                   >
//                     {subcategory.name}
//                   </Label>
//                 </div>
//               ))}
//             </div>
//           </AccordionContent>
//         </AccordionItem>
//       ))}
//     </Accordion>
//   );
// }
