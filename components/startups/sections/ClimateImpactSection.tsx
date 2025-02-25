import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClimateImpactForm } from "@/components/startups/forms/climate-impact-form";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ClimateImpact {
  id: string;
  isActive: boolean;
  metrics: {
    co2Reduction?: number;
    waterSaved?: number;
    energyEfficiency?: number;
    wasteDiverted?: number;
    biodiversityImpact?: string;
  };
  carbonFootprint: {
    carbonCaptured?: number;
    lifecycleCo2Reduction?: number;
    offsetPrograms?: string;
  };
  sdgs: number[];
  sdgImpact?: string;
  certifications: string[];
  awards?: string;
  lifecycle: {
    circularity?: number;
    recycledMaterials?: number;
    wasteReduction?: number;
    supplyChainReduction?: number;
    description?: string;
  };
}

interface StartupProps {
  startup: {
    id: string;
    climateImpacts: ClimateImpact[];
  };
}

export function ClimateImpactSection({ startup }: StartupProps) {
  const [impacts, setImpacts] = useState<ClimateImpact[]>(startup.climateImpacts || []);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/startups/climate-impact/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setImpacts(impacts.map(impact => 
        impact.id === id ? { ...impact, isActive } : impact
      ));
      
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this climate impact?')) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/startups/climate-impact/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete climate impact');

      setImpacts(impacts.filter(impact => impact.id !== id));
      toast.success('Climate impact deleted successfully');
    } catch (error) {
      toast.error('Failed to delete climate impact');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Climate Impact</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Climate Impact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Climate Impact</DialogTitle>
            </DialogHeader>
            <ClimateImpactForm 
              onSubmitType="create"
              initialData={{
                metrics: {},
                carbonFootprint: {},
                sdgs: [],
                certifications: [],
                lifecycle: {}
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {impacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Plus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Climate Impact Data</h3>
            <p className="text-muted-foreground text-center mb-6">
              Add information about your startup environmental impact and sustainability initiatives.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {impacts.map((impact) => (
            <Card key={impact.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">
                  Climate Impact Report
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={impact.isActive}
                    onCheckedChange={(checked) => handleStatusChange(impact.id, checked)}
                    disabled={isLoading}
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Climate Impact</DialogTitle>
                      </DialogHeader>
                      <ClimateImpactForm 
                        onSubmitType="update"
                        onSubmitId={impact.id}
                        initialData={{
                          metrics: impact.metrics || {},
                          carbonFootprint: impact.carbonFootprint || {},
                          sdgs: impact.sdgs || [],
                          sdgImpact: impact.sdgImpact,
                          certifications: impact.certifications || [],
                          awards: impact.awards,
                          lifecycle: impact.lifecycle || {}
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleDelete(impact.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {/* Metrics Section */}
                  {impact.metrics && Object.keys(impact.metrics).length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Impact Metrics</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {impact.metrics.co2Reduction && (
                          <div>
                            <span className="font-medium">CO₂ Reduction:</span>
                            <span className="ml-2">{impact.metrics.co2Reduction} tons/year</span>
                          </div>
                        )}
                        {impact.metrics.waterSaved && (
                          <div>
                            <span className="font-medium">Water Saved:</span>
                            <span className="ml-2">{impact.metrics.waterSaved} L/year</span>
                          </div>
                        )}
                        {impact.metrics.energyEfficiency && (
                          <div>
                            <span className="font-medium">Energy Efficiency:</span>
                            <span className="ml-2">{impact.metrics.energyEfficiency}%</span>
                          </div>
                        )}
                        {impact.metrics.wasteDiverted && (
                          <div>
                            <span className="font-medium">Waste Diverted:</span>
                            <span className="ml-2">{impact.metrics.wasteDiverted} tons/year</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Carbon Footprint Section */}
                  {impact.carbonFootprint && Object.keys(impact.carbonFootprint).length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Carbon Footprint</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {impact.carbonFootprint.carbonCaptured && (
                          <div>
                            <span className="font-medium">Carbon Captured:</span>
                            <span className="ml-2">{impact.carbonFootprint.carbonCaptured} tons/year</span>
                          </div>
                        )}
                        {impact.carbonFootprint.lifecycleCo2Reduction && (
                          <div>
                            <span className="font-medium">Lifecycle CO₂ Reduction:</span>
                            <span className="ml-2">{impact.carbonFootprint.lifecycleCo2Reduction}%</span>
                          </div>
                        )}
                      </div>
                      {impact.carbonFootprint.offsetPrograms && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {impact.carbonFootprint.offsetPrograms}
                        </p>
                      )}
                    </div>
                  )}

                  {/* SDGs Section */}
                  {impact.sdgs && impact.sdgs.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">UN Sustainable Development Goals</h3>
                      <div className="flex flex-wrap gap-2">
                        {impact.sdgs.map((sdg) => (
                          <div key={sdg} className="rounded-full bg-primary/10 px-3 py-1 text-sm">
                            SDG {sdg}
                          </div>
                        ))}
                      </div>
                      {impact.sdgImpact && (
                        <p className="mt-2 text-sm text-muted-foreground">{impact.sdgImpact}</p>
                      )}
                    </div>
                  )}

                  {/* Certifications & Awards */}
                  {((impact.certifications && impact.certifications.length > 0) || impact.awards) && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Certifications & Awards</h3>
                      {impact.certifications && impact.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {impact.certifications.map((cert) => (
                            <div key={cert} className="rounded-full bg-secondary px-3 py-1 text-sm">
                              {cert}
                            </div>
                          ))}
                        </div>
                      )}
                      {impact.awards && (
                        <p className="mt-2 text-sm text-muted-foreground">{impact.awards}</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}