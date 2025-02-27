import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Region {
  slug: string;
  name: string;
}

interface AdminRefreshStatsProps {
  regions: Region[];
}

export default function AdminRefreshStats({ regions }: AdminRefreshStatsProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setResult(null);
      
      // Construct URL with query parameter if a specific region is selected
      const url = selectedRegion 
        ? `/api/admin/regions/update-stats?region=${selectedRegion}`
        : '/api/admin/regions/update-stats';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to refresh stats: ${response.status}`);
      }
      
      const data = await response.json();
      setResult({ 
        success: data.success, 
        message: data.message 
      });
    } catch (error) {
      console.error('Error refreshing stats:', error);
      setResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refresh Region Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="region">Select Region</Label>
          <Select value={selectedRegion || ''} onValueChange={setSelectedRegion}>
            <SelectTrigger>
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.slug} value={region.slug}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="w-full"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Statistics
            </>
          )}
        </Button>
        
        <p className="text-sm text-muted-foreground mt-2">
          This will update the region statistics with real-time data from the database.
          {selectedRegion 
            ? ` Only statistics for the selected region will be updated.`
            : ` All regions will be updated.`
          }
        </p>
      </CardContent>
    </Card>
  );
}