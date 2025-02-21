"use client";

import { CategoryFilter } from "./category-filter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const countries = [
  { value: "norway", label: "Norway" },
  { value: "sweden", label: "Sweden" },
  { value: "denmark", label: "Denmark" },
  { value: "finland", label: "Finland" },
  { value: "iceland", label: "Iceland" },
];

export function StartupFilters() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Categories</h3>
        <CategoryFilter />
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-semibold">Location</h3>
        <div className="space-y-4">
          {countries.map((country) => (
            <div key={country.value} className="flex items-center space-x-2">
              <Checkbox id={country.value} />
              <Label htmlFor={country.value}>{country.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Funding Stage</h3>
        <div className="space-y-4">
          {["Pre-seed", "Seed", "Series A", "Series B+"].map((stage) => (
            <div key={stage} className="flex items-center space-x-2">
              <Checkbox id={stage.toLowerCase()} />
              <Label htmlFor={stage.toLowerCase()}>{stage}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}