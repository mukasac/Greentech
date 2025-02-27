"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { JobType, ExperienceLevel, WorkLocation } from "@/lib/types/job";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

// Define Nordic regions/countries
const regions = [
  { value: "norway", label: "Norway" },
  { value: "sweden", label: "Sweden" },
  { value: "denmark", label: "Denmark" },
  { value: "finland", label: "Finland" },
  { value: "iceland", label: "Iceland" },
];

interface JobFiltersProps {
  onFilterChange: (type: string, value: string | null) => void;
}

export function JobFilters({ onFilterChange }: JobFiltersProps) {
  const [jobType, setJobType] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);

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
  };

  const hasActiveFilters = jobType || experienceLevel || location || country;

  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Active Filters</h3>
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
      )}

      <div className="space-y-4">
        <h3 className="font-semibold">Job Type</h3>
        <RadioGroup 
          className="flex flex-col space-y-3"
          value={jobType || ""}
          onValueChange={handleJobTypeChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={JobType.FULL_TIME} 
              id="job-type-full-time" 
              className="peer"
              onClick={() => handleJobTypeChange(JobType.FULL_TIME)}
            />
            <Label
              htmlFor="job-type-full-time"
              className="peer-data-[state=checked]:font-medium cursor-pointer"
            >
              Full-time
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={JobType.PART_TIME} 
              id="job-type-part-time" 
              className="peer"
              onClick={() => handleJobTypeChange(JobType.PART_TIME)}
            />
            <Label
              htmlFor="job-type-part-time"
              className="peer-data-[state=checked]:font-medium cursor-pointer"
            >
              Part-time
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={JobType.CONTRACT} 
              id="job-type-contract" 
              className="peer"
              onClick={() => handleJobTypeChange(JobType.CONTRACT)}
            />
            <Label
              htmlFor="job-type-contract"
              className="peer-data-[state=checked]:font-medium cursor-pointer"
            >
              Contract
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={JobType.INTERNSHIP} 
              id="job-type-internship" 
              className="peer"
              onClick={() => handleJobTypeChange(JobType.INTERNSHIP)}
            />
            <Label
              htmlFor="job-type-internship"
              className="peer-data-[state=checked]:font-medium cursor-pointer"
            >
              Internship
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-semibold">Experience Level</h3>
        <RadioGroup 
          className="flex flex-col space-y-3"
          value={experienceLevel || ""}
          onValueChange={handleExperienceLevelChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={ExperienceLevel.ENTRY} 
              id="experience-entry" 
              className="peer"
              onClick={() => handleExperienceLevelChange(ExperienceLevel.ENTRY)}
            />
            <Label
              htmlFor="experience-entry"
              className="peer-data-[state=checked]:font-medium cursor-pointer"
            >
              Entry Level
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={ExperienceLevel.MID} 
              id="experience-mid" 
              className="peer"
              onClick={() => handleExperienceLevelChange(ExperienceLevel.MID)}
            />
            <Label
              htmlFor="experience-mid"
              className="peer-data-[state=checked]:font-medium cursor-pointer"
            >
              Mid Level
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={ExperienceLevel.SENIOR} 
              id="experience-senior" 
              className="peer"
              onClick={() => handleExperienceLevelChange(ExperienceLevel.SENIOR)}
            />
            <Label
              htmlFor="experience-senior"
              className="peer-data-[state=checked]:font-medium cursor-pointer"
            >
              Senior Level
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={ExperienceLevel.LEAD} 
              id="experience-lead" 
              className="peer"
              onClick={() => handleExperienceLevelChange(ExperienceLevel.LEAD)}
            />
            <Label
              htmlFor="experience-lead"
              className="peer-data-[state=checked]:font-medium cursor-pointer"
            >
              Lead Level
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={ExperienceLevel.EXECUTIVE} 
              id="experience-executive" 
              className="peer"
              onClick={() => handleExperienceLevelChange(ExperienceLevel.EXECUTIVE)}
            />
            <Label
              htmlFor="experience-executive"
              className="peer-data-[state=checked]:font-medium cursor-pointer"
            >
              Executive Level
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-semibold">Location Type</h3>
        <RadioGroup 
          className="flex flex-col space-y-3"
          value={location || ""}
          onValueChange={handleLocationChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={WorkLocation.REMOTE} 
              id="location-remote" 
              className="peer"
              onClick={() => handleLocationChange(WorkLocation.REMOTE)}
            />
            <Label
              htmlFor="location-remote"
              className="peer-data-[state=checked]:font-medium cursor-pointer"
            >
              Remote
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={WorkLocation.HYBRID} 
              id="location-hybrid" 
              className="peer"
              onClick={() => handleLocationChange(WorkLocation.HYBRID)}
            />
            <Label
              htmlFor="location-hybrid"
              className="peer-data-[state=checked]:font-medium cursor-pointer"
            >
              Hybrid
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={WorkLocation.ON_SITE} 
              id="location-onsite" 
              className="peer"
              onClick={() => handleLocationChange(WorkLocation.ON_SITE)}
            />
            <Label
              htmlFor="location-onsite"
              className="peer-data-[state=checked]:font-medium cursor-pointer"
            >
              On-Site
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-semibold">Region</h3>
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
                className="peer-data-[state=checked]:font-medium cursor-pointer"
              >
                {region.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}