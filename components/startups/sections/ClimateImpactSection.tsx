// components/startups/sections/ClimateImpactSection.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
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
  co2Reduction?: number;
  waterSaved?: number;
  energyEfficiency?: number;
  wasteDiverted?: number;
  biodiversityImpact?: string;
  carbonCaptured?: number;
  lifecycleCo2Reduction?: number;
  offsetPrograms?: string;
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
  [key: string]: any; // Add index signature to allow string indexing
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
  const [editImpactId, setEditImpactId] = useState<string | null>(null);
  const [editImpactData, setEditImpactData] = useState<any>(null);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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

  // Function to fetch and prepare climate impact data for editing
  const prepareImpactForEdit = async (impact: ClimateImpact) => {
    try {
      setIsLoadingEdit(true);
      setEditImpactId(impact.id);
      
      // You could fetch the latest data from the server, but we'll use the existing data for simplicity
      const data = impact;
      
      // Transform the flat data structure to match what the form expects
      // The ClimateImpactForm expects metrics in a nested object
      const preparedData = {
        metrics: {
          co2Reduction: data.co2Reduction || 0,
          waterSaved: data.waterSaved || 0,
          energyEfficiency: data.energyEfficiency || 0,
          wasteDiverted: data.wasteDiverted || 0,
          biodiversityImpact: data.biodiversityImpact || "",
          // Add any other metrics that might be in the data
          ...Object.keys(data)
            .filter(key => !['id', 'isActive', 'co2Reduction', 'waterSaved', 'energyEfficiency', 
                            'wasteDiverted', 'biodiversityImpact', 'carbonCaptured', 'lifecycleCo2Reduction', 
                            'offsetPrograms', 'sdgs', 'sdgImpact', 'certifications', 'awards', 'lifecycle', 
                            'startupId', 'createdAt', 'updatedAt'].includes(key))
            .reduce((acc, key) => ({ ...acc, [key]: data[key] }), {})
        },
        // Carbon footprint data is flat in the form
        carbonCaptured: data.carbonCaptured || 0,
        lifecycleCo2Reduction: data.lifecycleCo2Reduction || 0,
        offsetPrograms: data.offsetPrograms || "",
        
        // Other fields
        sdgs: data.sdgs || [],
        sdgImpact: data.sdgImpact || "",
        certifications: data.certifications || [],
        awards: data.awards || "",
        
        // Lifecycle data
        lifecycle: data.lifecycle || {},
      };
      
      setEditImpactData(preparedData);
      setEditDialogOpen(true);
    } catch (error) {
      console.error("Error preparing climate impact for edit:", error);
      toast.error("Failed to prepare impact data for editing");
    } finally {
      setIsLoadingEdit(false);
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
              initialData={{}}
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
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => prepareImpactForEdit(impact)}
                    disabled={isLoadingEdit && editImpactId === impact.id}
                  >
                    {isLoadingEdit && editImpactId === impact.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Pencil className="h-4 w-4" />
                    )}
                  </Button>
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
                  {(impact.co2Reduction || impact.waterSaved || impact.energyEfficiency || 
                    impact.wasteDiverted || impact.biodiversityImpact) && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Impact Metrics</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {impact.co2Reduction !== null && impact.co2Reduction !== undefined && (
                          <div>
                            <span className="font-medium">CO₂ Reduction:</span>
                            <span className="ml-2">{impact.co2Reduction} tons/year</span>
                          </div>
                        )}
                        {impact.waterSaved !== null && impact.waterSaved !== undefined && (
                          <div>
                            <span className="font-medium">Water Saved:</span>
                            <span className="ml-2">{impact.waterSaved} L/year</span>
                          </div>
                        )}
                        {impact.energyEfficiency !== null && impact.energyEfficiency !== undefined && (
                          <div>
                            <span className="font-medium">Energy Efficiency:</span>
                            <span className="ml-2">{impact.energyEfficiency}%</span>
                          </div>
                        )}
                        {impact.wasteDiverted !== null && impact.wasteDiverted !== undefined && (
                          <div>
                            <span className="font-medium">Waste Diverted:</span>
                            <span className="ml-2">{impact.wasteDiverted} tons/year</span>
                          </div>
                        )}
                      </div>
                      {impact.biodiversityImpact && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {impact.biodiversityImpact}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Carbon Footprint Section */}
                  {(impact.carbonCaptured !== null || impact.lifecycleCo2Reduction !== null || impact.offsetPrograms) && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Carbon Footprint</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {impact.carbonCaptured !== null && impact.carbonCaptured !== undefined && (
                          <div>
                            <span className="font-medium">Carbon Captured:</span>
                            <span className="ml-2">{impact.carbonCaptured} tons/year</span>
                          </div>
                        )}
                        {impact.lifecycleCo2Reduction !== null && impact.lifecycleCo2Reduction !== undefined && (
                          <div>
                            <span className="font-medium">Lifecycle CO₂ Reduction:</span>
                            <span className="ml-2">{impact.lifecycleCo2Reduction}%</span>
                          </div>
                        )}
                      </div>
                      {impact.offsetPrograms && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {impact.offsetPrograms}
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
                          {impact.certifications.map((cert, index) => (
                            <div key={index} className="rounded-full bg-secondary px-3 py-1 text-sm">
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

                  {/* Lifecycle Section */}
                  {impact.lifecycle && Object.keys(impact.lifecycle).length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Lifecycle Sustainability</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {impact.lifecycle.circularity !== undefined && (
                          <div>
                            <span className="font-medium">Circularity:</span>
                            <span className="ml-2">{impact.lifecycle.circularity}%</span>
                          </div>
                        )}
                        {impact.lifecycle.recycledMaterials !== undefined && (
                          <div>
                            <span className="font-medium">Recycled Materials:</span>
                            <span className="ml-2">{impact.lifecycle.recycledMaterials}%</span>
                          </div>
                        )}
                        {impact.lifecycle.wasteReduction !== undefined && (
                          <div>
                            <span className="font-medium">Waste Reduction:</span>
                            <span className="ml-2">{impact.lifecycle.wasteReduction}%</span>
                          </div>
                        )}
                        {impact.lifecycle.supplyChainReduction !== undefined && (
                          <div>
                            <span className="font-medium">Supply Chain Reduction:</span>
                            <span className="ml-2">{impact.lifecycle.supplyChainReduction}%</span>
                          </div>
                        )}
                      </div>
                      {impact.lifecycle.description && (
                        <p className="mt-2 text-sm text-muted-foreground">{impact.lifecycle.description}</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Climate Impact</DialogTitle>
          </DialogHeader>
          {editImpactData ? (
            <ClimateImpactForm 
              onSubmitType="update"
              onSubmitId={editImpactId!}
              initialData={editImpactData}
            />
          ) : (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading climate impact data...</span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}