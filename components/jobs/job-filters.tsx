"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const jobTypes = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const experienceLevels = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead" },
  { value: "executive", label: "Executive" },
];

const locations = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "on-site", label: "On-site" },
];

export function JobFilters() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Job Type</h3>
        <div className="space-y-4">
          {jobTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox id={type.value} />
              <Label htmlFor={type.value}>{type.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Experience Level</h3>
        <div className="space-y-4">
          {experienceLevels.map((level) => (
            <div key={level.value} className="flex items-center space-x-2">
              <Checkbox id={level.value} />
              <Label htmlFor={level.value}>{level.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Location Type</h3>
        <div className="space-y-4">
          {locations.map((location) => (
            <div key={location.value} className="flex items-center space-x-2">
              <Checkbox id={location.value} />
              <Label htmlFor={location.value}>{location.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}