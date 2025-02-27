"use client";

import { categories } from "@/lib/data/categories";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface CategorySelectorProps {
  selected: {
    main: string;
    sub: string[];
  };
  onChange?: {
    onMainChange: (category: string) => void;
    onSubChange: (categories: string[]) => void;
  };
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selected = { main: "", sub: [] },  // Default value to prevent undefined errors
  onChange = { onMainChange: () => {}, onSubChange: () => {} }  // Default onChange handler
}) => {
  // Ensure selected always has the correct structure
  const safeSelected = {
    main: selected?.main || "",
    sub: selected?.sub || []
  };

  const handleSubcategoryChange = (checked: boolean, subcategoryId: string) => {
    if (onChange) {
      if (checked) {
        onChange.onSubChange([...safeSelected.sub, subcategoryId]);
      } else {
        onChange.onSubChange(safeSelected.sub.filter(id => id !== subcategoryId));
      }
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Main Category</h3>
            <RadioGroup
              value={safeSelected.main}
              onValueChange={onChange?.onMainChange}
            >
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={category.id} id={category.id} />
                  <Label htmlFor={category.id}>{category.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Subcategories</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {safeSelected.main && categories
                .find(cat => cat.id === safeSelected.main)
                ?.subcategories.map((sub) => (
                  <div key={sub.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={sub.id}
                      checked={safeSelected.sub.includes(sub.id)}
                      onCheckedChange={(checked) =>
                        handleSubcategoryChange(checked as boolean, sub.id)
                      }
                    />
                    <Label htmlFor={sub.id}>{sub.name}</Label>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};