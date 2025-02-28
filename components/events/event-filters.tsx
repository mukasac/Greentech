// components/events/event-filters.tsx
"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const regions = [
  { value: "norway", label: "Norway" },
  { value: "sweden", label: "Sweden" },
  { value: "denmark", label: "Denmark" },
  { value: "finland", label: "Finland" },
  { value: "iceland", label: "Iceland" },
];

const eventTypes = [
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
  { value: "hackathon", label: "Hackathon" },
  { value: "networking", label: "Networking" },
  { value: "webinar", label: "Webinar" },
];

interface EventFiltersProps {
  onFilterChange: (type: string, value: string | null) => void;
}

export function EventFilters({ onFilterChange }: EventFiltersProps) {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string | null>(null);

  const handleRegionChange = (value: string) => {
    setActiveRegion(value === "all-regions" ? null : value);
    onFilterChange("region", value === "all-regions" ? null : value);
  };

  const handleTypeChange = (value: string) => {
    setActiveType(value === "all-types" ? null : value);
    onFilterChange("type", value === "all-types" ? null : value);
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value === "any-time" ? null : value);
    // Could be implemented to filter by date range
    // onFilterChange("dateRange", value === "any-time" ? null : value);
  };

  const clearFilters = () => {
    setActiveRegion(null);
    setActiveType(null);
    setDateRange(null);
    onFilterChange("region", null);
    onFilterChange("type", null);
  };

  const hasActiveFilters = activeRegion || activeType || dateRange;

  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Active Filters</h3>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
            <X className="mr-1 h-4 w-4" />
            Clear all
          </Button>
        </div>
      )}
      
      <div>
        <h3 className="mb-4 text-lg font-semibold">Location</h3>
        <Select value={activeRegion || "all-regions"} onValueChange={handleRegionChange}>
          <SelectTrigger>
            <SelectValue placeholder="All regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-regions">All regions</SelectItem>
            {regions.map((region) => (
              <SelectItem key={region.value} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Event Type</h3>
        <Select value={activeType || "all-types"} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">All types</SelectItem>
            {eventTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Date Range</h3>
        <Select value={dateRange || "any-time"} onValueChange={handleDateRangeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Any time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any-time">Any time</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="next-month">Next Month</SelectItem>
            <SelectItem value="next-3-months">Next 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}