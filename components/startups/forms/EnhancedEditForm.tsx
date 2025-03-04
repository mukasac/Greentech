import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { CategorySelector } from "./category-selector";
import { FileUploader } from "@/components/ui/file-uploader";

interface SocialLinks {
  linkedin: string;
  twitter: string;
  facebook: string;
}

interface Sustainability {
  impact: string;
  sdgs: string[];
}

interface StartupFormData {
  name: string;
  description: string;
  website: string;
  founded: string;
  employees: string;
  funding: string;
  mainCategory: string;
  subcategories: string[];
  country: string;
  logo: string;
  profileImage: string;
  tags: string[];
  socialLinks: SocialLinks;
  sustainability: Sustainability;
  // Add the missing properties
  stage?: string;
  startupStage?: string;
  investmentStage?: string;
  fundingNeeds?: string;
}

interface CategorySelectorProps {
  selected: {
    main: string;
    sub: string[];
  };
  onChange: {
    onMainChange: (category: string) => void;
    onSubChange: (categories: string[]) => void;
  };
}

interface EnhancedEditFormProps {
  startupId: string;
}

export function EnhancedEditForm({ startupId }: EnhancedEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<StartupFormData>({
    name: "",
    description: "",
    website: "",
    founded: "",
    employees: "",
    funding: "",
    mainCategory: "",
    subcategories: [],
    country: "",
    logo: "",
    profileImage: "",
    tags: [],
    socialLinks: {
      linkedin: "",
      twitter: "",
      facebook: ""
    },
    sustainability: {
      impact: "",
      sdgs: []
    },
    // Initialize the missing properties with empty values
    stage: "",
    startupStage: "",
    investmentStage: "",
    fundingNeeds: ""
  });

  useEffect(() => {
    const fetchStartupData = async () => {
      try {
        const response = await fetch(`/api/startups/${startupId}`);
        if (!response.ok) throw new Error("Failed to fetch startup data");
        const data = await response.json();
        
        // Ensure socialLinks and sustainability exist in the fetched data
        const safeData = {
          ...data,
          socialLinks: data.socialLinks || {
            linkedin: "",
            twitter: "",
            facebook: ""
          },
          sustainability: data.sustainability || {
            impact: "",
            sdgs: []
          }
        };
        
        setFormData(safeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch startup data");
      } finally {
        setLoading(false);
      }
    };

    fetchStartupData();
  }, [startupId]);

  const handleChange = (
    field: keyof StartupFormData | keyof SocialLinks | keyof Sustainability,
    value: any,
    section?: 'socialLinks' | 'sustainability'
  ) => {
    if (section) {
      setFormData(prev => {
        // Ensure the section exists before updating it
        const sectionData = prev[section] || 
          (section === 'socialLinks' ? { linkedin: '', twitter: '', facebook: '' } : 
           section === 'sustainability' ? { impact: '', sdgs: [] } : {});
        
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [field]: value
          }
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/startups/${startupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update startup");
      }

      setSuccess("Startup profile updated successfully!");
      
      router.refresh();
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update startup");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your startup core information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="founded">Founded Year</Label>
                  <Input
                    id="founded"
                    type="number"
                    value={formData.founded}
                    onChange={(e) => handleChange("founded", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="employees">Number of Employees</Label>
                  <Input
                    id="employees"
                    value={formData.employees}
                    onChange={(e) => handleChange("employees", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funding">Total Funding</Label>
                  <Input
                    id="funding"
                    value={formData.funding}
                    onChange={(e) => handleChange("funding", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stage">Legacy Stage (for backward compatibility)</Label>
                  <select
                    id="stage"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.stage || ""}
                    onChange={(e) => handleChange("stage", e.target.value)}
                  >
                    <option value="">Select a stage</option>
                    <option value="Idea">Idea</option>
                    <option value="Pre-seed">Pre-seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                    <option value="Series C+">Series C+</option>
                    <option value="Growth">Growth</option>
                    <option value="Established">Established</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startupStage">Startup Stage</Label>
                  <select
                    id="startupStage"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.startupStage || ""}
                    onChange={(e) => handleChange("startupStage", e.target.value)}
                  >
                    <option value="">Select startup stage</option>
                    <option value="idea">Idea</option>
                    <option value="mvp">MVP</option>
                    <option value="early-traction">Early Traction</option>
                    <option value="growth">Growth</option>
                    <option value="maturity">Maturity</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="investmentStage">Investment Stage</Label>
                  <select
                    id="investmentStage"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.investmentStage || ""}
                    onChange={(e) => handleChange("investmentStage", e.target.value)}
                  >
                    <option value="">Select investment stage</option>
                    <option value="pre-seed">Pre-seed</option>
                    <option value="seed">Seed</option>
                    <option value="series-a">Series A</option>
                    <option value="series-b">Series B</option>
                    <option value="series-c-plus">Series C+</option>
                    <option value="exit">Exit</option>
                    <option value="bootstrapping">Bootstrapping</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fundingNeeds">Funding Needs</Label>
                  <select
                    id="fundingNeeds"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.fundingNeeds || ""}
                    onChange={(e) => handleChange("fundingNeeds", e.target.value)}
                  >
                    <option value="">Select funding needs</option>
                    <option value="looking">Looking for funding</option>
                    <option value="not-looking">Not looking for funding</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding Assets</CardTitle>
              <CardDescription>
                Update your startup visual identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Company Logo</Label>
                <FileUploader
                  currentImage={formData.logo}
                  onUpload={(url) => handleChange("logo", url)}
                  aspectRatio="square"
                />
              </div>

              <div className="space-y-4">
                <Label>Profile Cover Image</Label>
                <FileUploader
                  currentImage={formData.profileImage}
                  onUpload={(url) => handleChange("profileImage", url)}
                  aspectRatio="wide"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.socialLinks?.linkedin || ""}
                    onChange={(e) => handleChange("linkedin", e.target.value, "socialLinks")}
                    placeholder="LinkedIn URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.socialLinks?.twitter || ""}
                    onChange={(e) => handleChange("twitter", e.target.value, "socialLinks")}
                    placeholder="Twitter URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.socialLinks?.facebook || ""}
                    onChange={(e) => handleChange("facebook", e.target.value, "socialLinks")}
                    placeholder="Facebook URL"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Select your startup categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategorySelector
                selected={{
                  main: formData.mainCategory,
                  sub: formData.subcategories
                }}
                onChange={{
                  onMainChange: (category: string) => handleChange("mainCategory", category),
                  onSubChange: (categories: string[]) => handleChange("subcategories", categories)
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability">
          <Card>
            <CardHeader>
              <CardTitle>Sustainability</CardTitle>
              <CardDescription>
                Describe your startup sustainability impact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="impact">Sustainability Impact</Label>
                <Textarea
                  id="impact"
                  value={formData.sustainability?.impact || ""}
                  onChange={(e) => handleChange("impact", e.target.value, "sustainability")}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}

export default EnhancedEditForm