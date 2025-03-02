"use client";

// components/regions/ecosystem/region-initiatives.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface Initiative {
  title: string;
  description: string;
}

interface RegionInitiativesProps {
  initiatives: Initiative[];
}

export function RegionInitiatives({ initiatives }: RegionInitiativesProps) {
  if (!initiatives || initiatives.length === 0) {
    return null;
  }
  
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Key Initiatives</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {initiatives.map((initiative, index) => (
          <Card key={index} className="h-full transition-all hover:shadow-md">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <Lightbulb className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{initiative.title}</h3>
              <p className="text-muted-foreground mt-auto">{initiative.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}