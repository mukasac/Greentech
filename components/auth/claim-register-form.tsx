// components/auth/claim-register-form.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

interface ClaimRegisterFormProps {
  startupId: string | null;
}

export function ClaimRegisterForm({ startupId }: ClaimRegisterFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    try {
      // Register the user
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      
      if (!registerResponse.ok) {
        const data = await registerResponse.json();
        throw new Error(data.error || "Failed to create account");
      }
      
      // Sign in the user to get a session
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      
      if (signInResult?.error) {
        throw new Error(signInResult.error || "Failed to sign in");
      }
      
      // If there's a startup to claim
      if (startupId) {
        setSuccess("Account created! Claiming your startup...");
        
        const claimResponse = await fetch(`/api/startups/${startupId}/claim`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!claimResponse.ok) {
          const data = await claimResponse.json();
          throw new Error(data.error || "Failed to claim startup");
        }
        
        // Show success message briefly before redirect
        setSuccess("Startup claimed successfully! Redirecting to your dashboard...");
        setTimeout(() => {
          // Redirect to the main dashboard page instead of the profile page
          router.push("/startups/dashboard");
        }, 1500);
      } else {
        // Just registered without claiming
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
      
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>{success}</AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {startupId && (
        <Alert className="bg-primary/10 border-primary/20">
          <AlertDescription>
            You are about to claim ownership of this startup. After registering, 
            you will be able to manage its profile and information.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          minLength={8}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading
          ? "Creating Account..."
          : startupId
          ? "Register & Claim Startup"
          : "Create Account"
        }
      </Button>
      
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  );
}