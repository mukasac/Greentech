"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Droplets, Zap, Recycle, TreePine, Trophy } from "lucide-react";
import { ClimateImpact as StartupClimateImpact } from "@/lib/types/startup";

interface ClimateImpactDisplayProps {
  climateImpacts?: StartupClimateImpact[];
}

function MetricCard({ 
  icon: Icon, 
  value, 
  label, 
  unit 
}: { 
  icon: any; 
  value: number | undefined | null; 
  label: string; 
  unit: string;
}) {
  if (value === null || value === undefined) return null;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {value.toLocaleString()} {unit}
            </div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ClimateImpactDisplay({ climateImpacts = [] }: ClimateImpactDisplayProps) {
  // Early return if no climate impacts
  if (!climateImpacts || climateImpacts.length === 0) {
    return null;
  }

  // Get the most recent active impact
  const impact = climateImpacts
    .filter(imp => imp.isActive)
    .sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

  if (!impact) return null;

  return (
    <div className="space-y-8">
      {/* Impact Metrics */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Impact Metrics</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {impact.co2Reduction !== undefined && impact.co2Reduction !== null && (
            <MetricCard
              icon={Leaf}
              value={impact.co2Reduction}
              label="CO₂ Reduction"
              unit="tons/year"
            />
          )}
          {impact.waterSaved !== undefined && impact.waterSaved !== null && (
            <MetricCard
              icon={Droplets}
              value={impact.waterSaved}
              label="Water Saved"
              unit="L/year"
            />
          )}
          {impact.energyEfficiency !== undefined && impact.energyEfficiency !== null && (
            <MetricCard
              icon={Zap}
              value={impact.energyEfficiency}
              label="Energy Efficiency"
              unit="%"
            />
          )}
          {impact.wasteDiverted !== undefined && impact.wasteDiverted !== null && (
            <MetricCard
              icon={Recycle}
              value={impact.wasteDiverted}
              label="Waste Diverted"
              unit="tons/year"
            />
          )}
        </div>
        {impact.biodiversityImpact && (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <TreePine className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Biodiversity Impact</h4>
                  <p className="text-muted-foreground mt-1">
                    {impact.biodiversityImpact}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Carbon Footprint */}
      {(impact.carbonCaptured || impact.lifecycleCo2Reduction || impact.offsetPrograms) && (
        <Card>
          <CardHeader>
            <CardTitle>Carbon Footprint & Offsets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {impact.carbonCaptured !== undefined && impact.carbonCaptured !== null && (
                <div>
                  <div className="text-2xl font-bold">
                    {impact.carbonCaptured.toLocaleString()} tons/year
                  </div>
                  <div className="text-sm text-muted-foreground">Carbon Captured</div>
                </div>
              )}
              {impact.lifecycleCo2Reduction !== undefined && impact.lifecycleCo2Reduction !== null && (
                <div>
                  <div className="text-2xl font-bold">
                    {impact.lifecycleCo2Reduction}%
                  </div>
                  <div className="text-sm text-muted-foreground">Lifecycle CO₂ Reduction</div>
                </div>
              )}
            </div>
            {impact.offsetPrograms && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Offset Programs</h4>
                <p className="text-muted-foreground">{impact.offsetPrograms}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* SDGs */}
      {(impact.sdgs?.length > 0 || impact.sdgImpact) && (
        <Card>
          <CardHeader>
            <CardTitle>UN Sustainable Development Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {impact.sdgs && impact.sdgs.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {impact.sdgs.map((sdg) => (
                  <Badge key={sdg} variant="outline" className="text-sm">
                    SDG {sdg}
                  </Badge>
                ))}
              </div>
            )}
            {impact.sdgImpact && (
              <p className="text-muted-foreground">{impact.sdgImpact}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Certifications & Awards */}
      {((impact.certifications && impact.certifications.length > 0) || impact.awards) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Certifications & Awards
            </CardTitle>
          </CardHeader>
          <CardContent>
            {impact.certifications && impact.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {impact.certifications.map((cert) => (
                  <Badge key={cert} variant="secondary">
                    {cert}
                  </Badge>
                ))}
              </div>
            )}
            {impact.awards && (
              <p className="text-muted-foreground">{impact.awards}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lifecycle Impact */}
      {impact.lifecycle && Object.keys(impact.lifecycle).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lifecycle Sustainability Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {impact.lifecycle.circularity !== undefined && (
                <div>
                  <div className="text-2xl font-bold">
                    {impact.lifecycle.circularity}%
                  </div>
                  <div className="text-sm text-muted-foreground">Circularity</div>
                </div>
              )}
              {impact.lifecycle.recycledMaterials !== undefined && (
                <div>
                  <div className="text-2xl font-bold">
                    {impact.lifecycle.recycledMaterials}%
                  </div>
                  <div className="text-sm text-muted-foreground">Recycled Materials</div>
                </div>
              )}
              {impact.lifecycle.wasteReduction !== undefined && (
                <div>
                  <div className="text-2xl font-bold">
                    {impact.lifecycle.wasteReduction}%
                  </div>
                  <div className="text-sm text-muted-foreground">Waste Reduction</div>
                </div>
              )}
              {impact.lifecycle.supplyChainReduction !== undefined && (
                <div>
                  <div className="text-2xl font-bold">
                    {impact.lifecycle.supplyChainReduction}%
                  </div>
                  <div className="text-sm text-muted-foreground">Supply Chain Reduction</div>
                </div>
              )}
            </div>
            {impact.lifecycle.description && (
              <p className="text-muted-foreground mt-4">{impact.lifecycle.description}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}