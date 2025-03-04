"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";

// Moving the 'use client' directive to individual component files
// This is one approach to solve the serialization errors

// Create props interfaces that use action property instead of onChange
interface StageProps {
  value: string;
  // Using 'action' instead of 'onChange' for serialization
  action: (value: string) => void;
}

export function StartupStageSelector({ value, action }: StageProps) {
  const stages = [
    { id: 'idea', label: 'Idea' },
    { id: 'mvp', label: 'MVP' },
    { id: 'early-traction', label: 'Early Traction' },
    { id: 'growth', label: 'Growth' },
    { id: 'maturity', label: 'Maturity' },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Startup Stage</h3>
          <RadioGroup 
            value={value} 
            onValueChange={action}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stages.map((stage) => (
                <div key={stage.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={stage.id} id={`stage-${stage.id}`} />
                  <Label htmlFor={`stage-${stage.id}`}>{stage.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}

export function InvestmentStageSelector({ value, action }: StageProps) {
  const stages = [
    { id: 'pre-seed', label: 'Pre-Seed' },
    { id: 'seed', label: 'Seed' },
    { id: 'series-a', label: 'Series A' },
    { id: 'series-b', label: 'Series B' },
    { id: 'series-c-plus', label: 'Series C & Beyond' },
    { id: 'exit', label: 'Exit' },
    { id: 'bootstrapping', label: 'Bootstrapping' },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Investment Stage</h3>
          <RadioGroup 
            value={value} 
            onValueChange={action}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stages.map((stage) => (
                <div key={stage.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={stage.id} id={`investment-${stage.id}`} />
                  <Label htmlFor={`investment-${stage.id}`}>{stage.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}

export function FundingNeedsSelector({ value, action }: StageProps) {
  const options = [
    { id: 'looking', label: 'Looking for funding' },
    { id: 'not-looking', label: 'Not looking for funding' },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Funding Needs</h3>
          <RadioGroup 
            value={value} 
            onValueChange={action}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={`funding-${option.id}`} />
                  <Label htmlFor={`funding-${option.id}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}