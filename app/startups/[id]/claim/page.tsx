"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ClaimRegisterForm } from "@/components/auth/claim-register-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import Image from "next/image";

export default function ClaimStartupPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch startup details to display name and check if already claimed
    const fetchStartup = async () => {
      try {
        const response = await fetch(`/api/startups/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch startup");
        }
        const data = await response.json();
        setStartup(data);
        
        // If startup is already claimed, redirect to profile
        if (data.userId) {
          setError("This startup has already been claimed");
          setTimeout(() => {
            router.push(`/startups/${params.id}`);
          }, 3000);
        }
      } catch (error) {
        console.error("Error fetching startup:", error);
        setError("Failed to load startup details");
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [params.id, router]);

  const handleLoggedInClaim = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Make claim request
      const response = await fetch(`/api/startups/${params.id}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to claim startup");
      }

      setSuccess("Startup claimed successfully! You now have ownership access.");
      
      // Redirect to dashboard on success after a delay
      setTimeout(() => {
        router.push("/startups/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error claiming startup:", error);
      setError(error instanceof Error ? error.message : "Failed to claim startup");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Processing...</p>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/startups">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Startups
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="mb-2 text-xl font-semibold">Startup Not Found</h2>
            <p className="text-muted-foreground">
              The startup you are trying to claim does not exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/startups/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Startup Profile
          </Link>
        </Button>
      </div>

      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Claim {startup.name}</CardTitle>
            <CardDescription>
              {status === "authenticated" 
                ? "Verify your information and submit to claim this startup"
                : "Register an account to claim this startup."}
            </CardDescription>
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

            {status === "authenticated" ? (
              <>
                <div className="mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 overflow-hidden rounded-lg border bg-white p-1">
                      <Image
                        src={startup.logo || "/placeholder-logo.png"}
                        alt={startup.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{startup.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Founded {startup.founded} • {startup.country}
                      </p>
                    </div>
                  </div>
                </div>

                <Alert className="mb-6">
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Verification Required</AlertTitle>
                  <AlertDescription>
                    By claiming this startup, you confirm that you are an authorized representative of {startup.name}. 
                    Our team may contact you to verify your affiliation.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" asChild>
                    <Link href={`/startups/${params.id}`}>Cancel</Link>
                  </Button>
                  <Button
                    onClick={handleLoggedInClaim}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Claim Startup"}
                  </Button>
                </div>
              </>
            ) : (
              <ClaimRegisterForm startupId={params.id} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}