"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ClaimRegisterForm } from "@/components/auth/claim-register-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const startupId = searchParams.get('claim');
  const router = useRouter();
  
  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {startupId ? 'Claim Your Startup' : 'Create an Account'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ClaimRegisterForm startupId={startupId} />
        </CardContent>
      </Card>
    </div>
  );
}