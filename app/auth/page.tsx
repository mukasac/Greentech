"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkUserStartup = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/startups/user");
          const data = await response.json();
          
          if (data && data.length > 0) {
            router.push("/startups/dashboard");
          } else {
            router.push("/startups/create");
          }
        } catch (error) {
          console.error("Error checking user startups:", error);
        }
      }
    };

    checkUserStartup();
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Welcome to GreenTech Nordics</h1>
          <p className="text-muted-foreground">
            Join the leading sustainable technology ecosystem
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}