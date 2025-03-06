"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { JobType, ExperienceLevel, WorkLocation } from "@/lib/types/job";
import { Button } from "@/components/ui/button";
import { X, Filter, Check, ChevronDown, ChevronUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

// Define Nordic regions/countries
const regions = [
  { value: "norway", label: "Norway" },
  { value: "sweden", label: "Sweden" },
  { value: "denmark", label: "Denmark" },
  { value: "finland", label: "Finland" },
  { value: "iceland", label: "Iceland" },
];

const jobTypesLabels = {
  [JobType.FULL_TIME]: "Full-time",
  [JobType.PART_TIME]: "Part-time",
  [JobType.CONTRACT]: "Contract",
  [JobType.INTERNSHIP]: "Internship",
};

const experienceLevelLabels = {
  [ExperienceLevel.ENTRY]: "Entry Level",
  [ExperienceLevel.MID]: "Mid Level",
  [ExperienceLevel.SENIOR]: "Senior Level",
  [ExperienceLevel.LEAD]: "Lead Level",
  [ExperienceLevel.EXECUTIVE]: "Executive Level",
};

const locationTypeLabels = {
  [WorkLocation.REMOTE]: "Remote",
  [WorkLocation.HYBRID]: "Hybrid",
  [WorkLocation.ON_SITE]: "On-site",
};

interface JobFiltersProps {
  onFilterChange: (type: string, value: string | null) => void;
  className?: string;
}

export function JobFilters({ onFilterChange, className = "" }: JobFiltersProps) {
  const [jobType, setJobType] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile screen on client side
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleJobTypeChange = (value: string) => {
    const newValue = jobType === value ? null : value;
    setJobType(newValue);
    onFilterChange('type', newValue);
  };

  const handleExperienceLevelChange = (value: string) => {
    const newValue = experienceLevel === value ? null : value;
    setExperienceLevel(newValue);
    onFilterChange('experienceLevel', newValue);
  };

  const handleLocationChange = (value: string) => {
    const newValue = location === value ? null : value;
    setLocation(newValue);
    onFilterChange('location', newValue);
  };

  const handleCountryChange = (value: string) => {
    const newValue = country === value ? null : value;
    setCountry(newValue);
    onFilterChange('country', newValue);
  };

  const resetFilters = () => {
    setJobType(null);
    setExperienceLevel(null);
    setLocation(null);
    setCountry(null);
    onFilterChange('type', null);
    onFilterChange('experienceLevel', null);
    onFilterChange('location', null);
    onFilterChange('country', null);
    setIsSheetOpen(false);
  };

  const applyFilters = () => {
    setIsSheetOpen(false);
  };

  const hasActiveFilters = jobType || experienceLevel || location || country;
  const activeFilterCount = [jobType, experienceLevel, location, country].filter(Boolean).length;

  // Get active filter labels for badges
  const getActiveFilterLabels = () => {
    const filters = [];
    
    if (jobType) {
      filters.push({
        type: 'type',
        label: jobTypesLabels[jobType as keyof typeof jobTypesLabels]
      });
    }
    
    if (experienceLevel) {
      filters.push({
        type: 'experienceLevel',
        label: experienceLevelLabels[experienceLevel as keyof typeof experienceLevelLabels]
      });
    }
    
    if (location) {
      filters.push({
        type: 'location',
        label: locationTypeLabels[location as keyof typeof locationTypeLabels]
      });
    }
    
    if (country) {
      filters.push({
        type: 'country',
        label: regions.find(r => r.value === country)?.label || country
      });
    }
    
    return filters;
  };
  
  const activeFilterLabels = getActiveFilterLabels();

  // Filter section component that works for both desktop and mobile
  const FilterSection = () => (
    <div className="space-y-6">
      {hasActiveFilters && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Active Filters</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="h-8 px-2 text-xs"
            >
              <X className="mr-1 h-3 w-3" />
              Clear All
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {activeFilterLabels.map((filter, idx) => (
              <Badge 
                key={idx} 
                variant="secondary"
                className="flex items-center gap-1 py-1"
              >
                {filter.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    switch(filter.type) {
                      case 'type': 
                        handleJobTypeChange(jobType!);
                        break;
                      case 'experienceLevel': 
                        handleExperienceLevelChange(experienceLevel!);
                        break;
                      case 'location': 
                        handleLocationChange(location!);
                        break;
                      case 'country': 
                        handleCountryChange(country!);
                        break;
                    }
                  }}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Accordion type="multiple" defaultValue={["job-type", "experience-level", "location-type", "region"]}>
        <AccordionItem value="job-type">
          <AccordionTrigger className="text-sm font-semibold py-2">Job Type</AccordionTrigger>
          <AccordionContent>
            <RadioGroup 
              className="flex flex-col space-y-3"
              value={jobType || ""}
              onValueChange={handleJobTypeChange}
            >
              {Object.entries(jobTypesLabels).map(([value, label]) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={value} 
                    id={`job-type-${value}`} 
                    className="peer"
                    onClick={() => handleJobTypeChange(value)}
                  />
                  <Label
                    htmlFor={`job-type-${value}`}
                    className="peer-data-[state=checked]:font-medium cursor-pointer text-sm"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience-level">
          <AccordionTrigger className="text-sm font-semibold py-2">Experience Level</AccordionTrigger>
          <AccordionContent>
            <RadioGroup 
              className="flex flex-col space-y-3"
              value={experienceLevel || ""}
              onValueChange={handleExperienceLevelChange}
            >
              {Object.entries(experienceLevelLabels).map(([value, label]) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={value} 
                    id={`experience-${value}`} 
                    className="peer"
                    onClick={() => handleExperienceLevelChange(value)}
                  />
                  <Label
                    htmlFor={`experience-${value}`}
                    className="peer-data-[state=checked]:font-medium cursor-pointer text-sm"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location-type">
          <AccordionTrigger className="text-sm font-semibold py-2">Location Type</AccordionTrigger>
          <AccordionContent>
            <RadioGroup 
              className="flex flex-col space-y-3"
              value={location || ""}
              onValueChange={handleLocationChange}
            >
              {Object.entries(locationTypeLabels).map(([value, label]) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={value} 
                    id={`location-${value}`} 
                    className="peer"
                    onClick={() => handleLocationChange(value)}
                  />
                  <Label
                    htmlFor={`location-${value}`}
                    className="peer-data-[state=checked]:font-medium cursor-pointer text-sm"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="region">
          <AccordionTrigger className="text-sm font-semibold py-2">Region</AccordionTrigger>
          <AccordionContent>
            <RadioGroup 
              className="flex flex-col space-y-3"
              value={country || ""}
              onValueChange={handleCountryChange}
            >
              {regions.map((region) => (
                <div key={region.value} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={region.value} 
                    id={`region-${region.value}`} 
                    className="peer"
                    onClick={() => handleCountryChange(region.value)}
                  />
                  <Label
                    htmlFor={`region-${region.value}`}
                    className="peer-data-[state=checked]:font-medium cursor-pointer text-sm"
                  >
                    {region.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  // Render different layouts for desktop and mobile
  return (
    <>
      {/* Desktop filters */}
      <div className={`hidden lg:block ${className}`}>
        <FilterSection />
      </div>
      
      {/* Mobile filters button & sheet */}
      <div className="lg:hidden my-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 w-full">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-1 bg-primary text-white">{activeFilterCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <span>Filters</span>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                    className="text-xs"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear All
                  </Button>
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="py-6">
              <FilterSection />
            </div>
            <SheetFooter className="sticky bottom-0 bg-background pt-2 border-t">
              <Button onClick={applyFilters} className="w-full">
                Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        {/* Show active filter badges on mobile */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {activeFilterLabels.map((filter, idx) => (
              <Badge 
                key={idx} 
                variant="secondary"
                className="flex items-center gap-1 py-1"
              >
                {filter.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    switch(filter.type) {
                      case 'type': 
                        handleJobTypeChange(jobType!);
                        break;
                      case 'experienceLevel': 
                        handleExperienceLevelChange(experienceLevel!);
                        break;
                      case 'location': 
                        handleLocationChange(location!);
                        break;
                      case 'country': 
                        handleCountryChange(country!);
                        break;
                    }
                  }}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </>
  );
}