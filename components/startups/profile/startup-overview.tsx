"use client";

import { Startup } from "@/lib/types/startup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Banknote, Target, Leaf, Globe, Users, Calendar, Building2, DollarSign, Briefcase } from "lucide-react";

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
              {startup.sustainability?.sdgs?.map((sdg) => (
                <Badge key={sdg} variant="outline">SDG {sdg}</Badge>
              )) || <span className="text-muted-foreground">No SDGs specified</span>}
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
          
          {/* Company Quick Stats */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Founded {startup.founded}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {startup.employees} employees
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              {startup.country}
            </div>
            
            {/* Add stage information */}
            {startup.startupStage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                Stage: {startup.startupStage}
              </div>
            )}
            
            {startup.investmentStage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Investment Stage: {startup.investmentStage}
              </div>
            )}
            
            {startup.fundingNeeds && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                Funding needs: {startup.fundingNeeds}
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {startup.mainCategory?.replace("-", " ") || "Category not specified"}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Banknote className="h-4 w-4" />
              Funding: {startup.funding}
            </div>
          </div>
          
          {startup.sustainability?.impact && (
            <div className="mt-4">
              <h4 className="mb-2 font-semibold">Sustainability Impact</h4>
              <p className="text-muted-foreground">{startup.sustainability.impact}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}