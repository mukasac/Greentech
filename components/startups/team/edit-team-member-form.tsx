"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { ArrowLeft, AlertCircle, CheckCircle, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  linkedin: string | null;
  twitter: string | null;
}

interface EditTeamMemberFormProps {
  startupId: string;
  memberId: string;
}

export function EditTeamMemberForm({ startupId, memberId }: EditTeamMemberFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<TeamMember>({
    id: memberId,
    name: "",
    role: "",
    image: "",
    linkedin: "",
    twitter: ""
  });

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        const response = await fetch(`/api/startups/${startupId}/team/${memberId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch team member");
        }
        
        const data = await response.json();
        // Remove bio from the data if present
        const { bio, ...memberWithoutBio } = data;
        setFormData(memberWithoutBio);
      } catch (error) {
        console.error("Error fetching team member:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch team member");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeamMember();
  }, [startupId, memberId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/startups/${startupId}/team/${memberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update team member");
      }

      setSuccess("Team member updated successfully!");
      
      // Redirect after a short delay to the team tab in dashboard profile
      setTimeout(() => {
        router.push("/startups/dashboard/profile?tab=team");
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error("Error updating team member:", error);
      setError(error instanceof Error ? error.message : "Failed to update team member");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/startups/${startupId}/team/${memberId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete team member");
      }

      setSuccess("Team member deleted successfully!");
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/startups/dashboard/profile?tab=team");
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error("Error deleting team member:", error);
      setError(error instanceof Error ? error.message : "Failed to delete team member");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading team member data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/startups/dashboard/profile?tab=team">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Team
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Profile Image URL</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
                {formData.image && (
                  <div className="mt-2 h-20 w-20 overflow-hidden rounded-full border relative">
                    <Image 
                      src={formData.image} 
                      alt={formData.name} 
                      fill
                      sizes="80px"
                      style={{objectFit: "cover"}}
                    />
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={formData.linkedin || ""}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter Profile</Label>
                  <Input
                    id="twitter"
                    type="url"
                    value={formData.twitter || ""}
                    onChange={handleChange}
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>

              <div className="flex justify-between space-x-4">
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={isSubmitting || isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Member
                </Button>
                
                <div className="flex space-x-4">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/startups/dashboard/team">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isSubmitting || isDeleting}>
                    {isSubmitting ? "Updating..." : "Update Team Member"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the team member. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}