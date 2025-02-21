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

const eventTypes = [
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
  { value: "hackathon", label: "Hackathon" },
  { value: "networking", label: "Networking" },
  { value: "webinar", label: "Webinar" },
];

export function EventFilters() {
  return (
    <div className="space-y-6">
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
        <h3 className="mb-4 text-lg font-semibold">Event Type</h3>
        <div className="space-y-4">
          {eventTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox id={type.value} />
              <Label htmlFor={type.value}>{type.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Date Range</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>From</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="next-month">Next Month</SelectItem>
                <SelectItem value="next-3-months">Next 3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}