import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, TreePine, Trophy, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";

interface ClimateImpactFormProps {
  onSubmitType: "create" | "update";
  onSubmitId?: string;
  initialData?: {
    metrics?: {
      co2Reduction?: number;
      waterSaved?: number;
      energyEfficiency?: number;
      wasteDiverted?: number;
      biodiversityImpact?: string;
    };
    carbonFootprint?: {
      carbonCaptured?: number;
      lifecycleCo2Reduction?: number;
      offsetPrograms?: string;
    };
    sdgs?: number[];
    sdgImpact?: string;
    certifications?: string[];
    awards?: string;
    lifecycle?: {
      circularity?: number;
      recycledMaterials?: number;
      wasteReduction?: number;
      supplyChainReduction?: number;
      description?: string;
    };
  };
}

const SDG_OPTIONS = Array.from({ length: 17 }, (_, i) => i + 1);

export function ClimateImpactForm({
  onSubmitType,
  onSubmitId,
  initialData = {}
}: ClimateImpactFormProps) {
  const { data: session } = useSession();
  const hasPermission = session?.user?.permissions?.includes("MANAGE_CLIMATE_IMPACT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    metrics: {
      co2Reduction: initialData?.metrics?.co2Reduction || 0,
      waterSaved: initialData?.metrics?.waterSaved || 0,
      energyEfficiency: initialData?.metrics?.energyEfficiency || 0,
      wasteDiverted: initialData?.metrics?.wasteDiverted || 0,
      biodiversityImpact: initialData?.metrics?.biodiversityImpact || "",
    },
    carbonFootprint: {
      carbonCaptured: initialData?.carbonFootprint?.carbonCaptured || 0,
      lifecycleCo2Reduction: initialData?.carbonFootprint?.lifecycleCo2Reduction || 0,
      offsetPrograms: initialData?.carbonFootprint?.offsetPrograms || "",
    },
    sdgs: initialData?.sdgs || [],
    sdgImpact: initialData?.sdgImpact || "",
    certifications: initialData?.certifications || [],
    awards: initialData?.awards || "",
    lifecycle: {
      circularity: initialData?.lifecycle?.circularity || 0,
      recycledMaterials: initialData?.lifecycle?.recycledMaterials || 0,
      wasteReduction: initialData?.lifecycle?.wasteReduction || 0,
      supplyChainReduction: initialData?.lifecycle?.supplyChainReduction || 0,
      description: initialData?.lifecycle?.description || "",
    },
  });

  if (!hasPermission) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Permission Required</AlertTitle>
        <AlertDescription>
          You dont have permission to manage climate impact data. Please contact your administrator.
        </AlertDescription>
      </Alert>
    );
  }

  const handleMetricsChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [field]: value
      }
    }));
  };

  const handleCarbonFootprintChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      carbonFootprint: {
        ...prev.carbonFootprint,
        [field]: value
      }
    }));
  };

  const handleLifecycleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      lifecycle: {
        ...prev.lifecycle,
        [field]: value
      }
    }));
  };

  const handleSDGToggle = (sdgNumber: number) => {
    setFormData(prev => {
      const sdgs = prev.sdgs.includes(sdgNumber)
        ? prev.sdgs.filter(num => num !== sdgNumber)
        : [...prev.sdgs, sdgNumber];
      return {
        ...prev,
        sdgs: sdgs.sort((a, b) => a - b)
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = onSubmitType === "create" 
        ? "/api/startups/climate-impact"
        : `/api/startups/climate-impact/${onSubmitId}`;

      const response = await fetch(url, {
        method: onSubmitType === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save climate impact data");
      }

      // Reload the page to show updated data
      window.location.reload();
    } catch (err) {
      console.error("Error saving climate impact:", err);
      setError(err instanceof Error ? err.message : "Failed to save climate impact data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Impact Metrics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Impact Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="co2Reduction">CO₂ Reduction (tons/year)</Label>
              <Input
                id="co2Reduction"
                type="number"
                value={formData.metrics.co2Reduction}
                onChange={(e) => handleMetricsChange("co2Reduction", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waterSaved">Water Saved (L/year)</Label>
              <Input
                id="waterSaved"
                type="number"
                value={formData.metrics.waterSaved}
                onChange={(e) => handleMetricsChange("waterSaved", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="energyEfficiency">Energy Efficiency (%)</Label>
              <Input
                id="energyEfficiency"
                type="number"
                min="0"
                max="100"
                value={formData.metrics.energyEfficiency}
                onChange={(e) => handleMetricsChange("energyEfficiency", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wasteDiverted">Waste Diverted (tons/year)</Label>
              <Input
                id="wasteDiverted"
                type="number"
                value={formData.metrics.wasteDiverted}
                onChange={(e) => handleMetricsChange("wasteDiverted", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="biodiversityImpact">Biodiversity Impact</Label>
            <Textarea
              id="biodiversityImpact"
              value={formData.metrics.biodiversityImpact}
              onChange={(e) => handleMetricsChange("biodiversityImpact", e.target.value)}
              placeholder="Describe your impact on biodiversity..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Carbon Footprint Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5" />
            Carbon Footprint
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="carbonCaptured">Carbon Captured (tons/year)</Label>
              <Input
                id="carbonCaptured"
                type="number"
                value={formData.carbonFootprint.carbonCaptured}
                onChange={(e) => handleCarbonFootprintChange("carbonCaptured", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lifecycleCo2Reduction">Lifecycle CO₂ Reduction (%)</Label>
              <Input
                id="lifecycleCo2Reduction"
                type="number"
                min="0"
                max="100"
                value={formData.carbonFootprint.lifecycleCo2Reduction}
                onChange={(e) => handleCarbonFootprintChange("lifecycleCo2Reduction", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="offsetPrograms">Offset Programs</Label>
            <Textarea
              id="offsetPrograms"
              value={formData.carbonFootprint.offsetPrograms}
              onChange={(e) => handleCarbonFootprintChange("offsetPrograms", e.target.value)}
              placeholder="Describe your carbon offset programs..."
            />
          </div>
        </CardContent>
      </Card>

      {/* SDGs Section */}
      <Card>
        <CardHeader>
          <CardTitle>UN Sustainable Development Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {SDG_OPTIONS.map(number => (
              <div key={number} className="flex items-center space-x-2">
                <Checkbox
                  id={`sdg-${number}`}
                  checked={formData.sdgs.includes(number)}
                  onCheckedChange={() => handleSDGToggle(number)}
                />
                <Label htmlFor={`sdg-${number}`}>SDG {number}</Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sdgImpact">SDG Impact Description</Label>
            <Textarea
              id="sdgImpact"
              value={formData.sdgImpact}
              onChange={(e) => setFormData(prev => ({ ...prev, sdgImpact: e.target.value }))}
              placeholder="Describe your contribution to the selected SDGs..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Certifications & Awards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Certifications & Awards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="certifications">Certifications (comma-separated)</Label>
            <Input
              id="certifications"
              value={formData.certifications.join(", ")}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                certifications: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
              }))}
              placeholder="ISO 14001, B Corp, Green Business Certified..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="awards">Awards & Recognition</Label>
            <Textarea
              id="awards"
              value={formData.awards}
              onChange={(e) => setFormData(prev => ({ ...prev, awards: e.target.value }))}
              placeholder="List any environmental awards or recognition..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Lifecycle Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Lifecycle Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="circularity">Circularity (%)</Label>
              <Input
                id="circularity"
                type="number"
                min="0"
                max="100"
                value={formData.lifecycle.circularity}
                onChange={(e) => handleLifecycleChange("circularity", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recycledMaterials">Recycled Materials (%)</Label>
              <Input
                id="recycledMaterials"
                type="number"
                min="0"
                max="100"
                value={formData.lifecycle.recycledMaterials}
                onChange={(e) => handleLifecycleChange("recycledMaterials", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wasteReduction">Waste Reduction (%)</Label>
              <Input
                id="wasteReduction"
                type="number"
                min="0"
                max="100"
                value={formData.lifecycle.wasteReduction}
                onChange={(e) => handleLifecycleChange("wasteReduction", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplyChainReduction">Supply Chain Reduction (%)</Label>
              <Input
                id="supplyChainReduction"
                type="number"
                min="0"
                max="100"
                value={formData.lifecycle.supplyChainReduction}
                onChange={(e) => handleLifecycleChange("supplyChainReduction", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lifecycleDescription">Lifecycle Description</Label>
            <Textarea
              id="lifecycleDescription"
              value={formData.lifecycle.description}
              onChange={(e) => handleLifecycleChange("description", e.target.value)}
              placeholder="Describe your product/service lifecycle sustainability..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 
            "Saving..." : 
            onSubmitType === "create" ? "Create Climate Impact" : "Update Climate Impact"
          }
        </Button>
      </div>
    </form>
  );
}

export default ClimateImpactForm;