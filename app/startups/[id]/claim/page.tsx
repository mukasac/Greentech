"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ClaimRegisterForm } from "@/components/auth/claim-register-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function ClaimStartupPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user is logged in, we'll handle the claim differently
    if (status === "authenticated") {
      handleLoggedInClaim();
      return;
    }

    // Fetch startup details to display name
    const fetchStartup = async () => {
      try {
        const response = await fetch(`/api/startups/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch startup");
        }
        const data = await response.json();
        setStartup(data);
      } catch (error) {
        console.error("Error fetching startup:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [params.id, status]);

  const handleLoggedInClaim = async () => {
    try {
      setLoading(true);
      
      // Fetch startup details
      const startupResponse = await fetch(`/api/startups/${params.id}`);
      if (!startupResponse.ok) {
        throw new Error("Failed to fetch startup");
      }
      const startupData = await startupResponse.json();
      setStartup(startupData);
      
      // Make claim request directly since user is already logged in
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

      // Redirect to dashboard on success
      router.push("/startups/dashboard");
    } catch (error) {
      console.error("Error claiming startup:", error);
      // Still set loading to false to show error state
    } finally {
      setLoading(false);
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
                ? "You're already logged in. We're processing your claim request."
                : "Register an account to claim this startup."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "unauthenticated" && (
              <ClaimRegisterForm startupId={params.id} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}