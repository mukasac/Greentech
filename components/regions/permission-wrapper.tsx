"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { Loader2 } from "lucide-react";

interface PermissionWrapperProps {
  children: ReactNode;
  requiredPermission: string;
  fallback?: ReactNode;
}

export function PermissionWrapper({
  children,
  requiredPermission,
  fallback = <div className="py-4 text-center text-muted-foreground">You do not have permission to view this content.</div>
}: PermissionWrapperProps) {
  const { data: session, status } = useSession();
  const { hasPermission } = usePermissions();
  const router = useRouter();

  // Only show loading indicator when session is loading
  if (status === "loading") {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If authorized, show content
  if (hasPermission(requiredPermission)) {
    return <>{children}</>;
  }

  // Otherwise show fallback
  return <>{fallback}</>;
}