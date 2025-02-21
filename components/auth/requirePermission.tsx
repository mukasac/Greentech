import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { hasPermission } from "@/lib/auth/utils";

interface RequirePermissionProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequirePermission({ 
  permission, 
  children, 
  fallback = null 
}: RequirePermissionProps) {
  const { data: session } = useSession();
  
  if (!session?.user?.permissions) {
    return fallback;
  }
  
  if (!hasPermission(session.user.permissions, permission)) {
    return fallback;
  }
  
  return <>{children}</>;
}