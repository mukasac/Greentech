"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countries = [
  { value: "norway", label: "Norway" },
  { value: "sweden", label: "Sweden" },
  { value: "denmark", label: "Denmark" },
  { value: "finland", label: "Finland" },
  { value: "iceland", label: "Iceland" },
];

const categories = [
  { value: "investment", label: "Investment" },
  { value: "innovation", label: "Innovation" },
  { value: "policy", label: "Policy" },
  { value: "research", label: "Research" },
  { value: "startups", label: "Startups" },
];

export function NewsFilters() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Region</h3>
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
        <h3 className="mb-4 text-lg font-semibold">Category</h3>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox id={category.value} />
              <Label htmlFor={category.value}>{category.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Time Period</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}