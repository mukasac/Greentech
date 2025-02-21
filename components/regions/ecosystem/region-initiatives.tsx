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
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Key Initiatives</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {initiatives.map((initiative, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Lightbulb className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{initiative.title}</h3>
              <p className="text-muted-foreground">{initiative.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}