"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const sdgs = [
  { id: 1, name: "No Poverty" },
  { id: 2, name: "Zero Hunger" },
  { id: 3, name: "Good Health and Well-being" },
  { id: 4, name: "Quality Education" },
  { id: 5, name: "Gender Equality" },
  { id: 6, name: "Clean Water and Sanitation" },
  { id: 7, name: "Affordable and Clean Energy" },
  { id: 8, name: "Decent Work and Economic Growth" },
  { id: 9, name: "Industry, Innovation and Infrastructure" },
  { id: 10, name: "Reduced Inequality" },
  { id: 11, name: "Sustainable Cities and Communities" },
  { id: 12, name: "Responsible Consumption and Production" },
  { id: 13, name: "Climate Action" },
  { id: 14, name: "Life Below Water" },
  { id: 15, name: "Life on Land" },
  { id: 16, name: "Peace, Justice and Strong Institutions" },
  { id: 17, name: "Partnerships for the Goals" },
];

export function SustainabilityForm() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Impact Description</Label>
            <Textarea
              placeholder="Describe your startup's environmental and social impact"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Carbon Footprint</Label>
            <Input placeholder="e.g., Net-zero operations" />
          </div>

          <div className="space-y-4">
            <Label>UN Sustainable Development Goals</Label>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {sdgs.map((sdg) => (
                <div key={sdg.id} className="flex items-center space-x-2">
                  <Checkbox id={`sdg-${sdg.id}`} />
                  <Label htmlFor={`sdg-${sdg.id}`}>
                    {sdg.id}. {sdg.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}