"use client";

import { Startup } from "@/lib/types/startup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Banknote, Target, Leaf } from "lucide-react";

interface StartupOverviewProps {
  startup: Startup;
}

export function StartupOverview({ startup }: StartupOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Funding
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{startup.funding}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Impact Areas
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {startup.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Sustainability Goals
            </CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {startup.sustainability.sdgs.map((sdg) => (
                <Badge key={sdg} variant="outline">SDG {sdg}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About {startup.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{startup.description}</p>
          <div className="mt-4">
            <h4 className="mb-2 font-semibold">Sustainability Impact</h4>
            <p className="text-muted-foreground">{startup.sustainability.impact}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}