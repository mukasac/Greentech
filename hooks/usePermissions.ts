'use client';

import { useSession } from 'next-auth/react';

export function usePermissions() {
  const { data: session } = useSession();
  
  const hasPermission = (permissionName: string): boolean => {
    // Add debugging
    console.log("Session:", session);
    console.log("User permissions:", session?.user?.permissions);
    console.log("Checking permission:", permissionName);
    
    if (!session?.user?.permissions || !Array.isArray(session.user.permissions)) {
      console.log("No permissions found in session");
      return false;
    }
    const result = session.user.permissions.includes(permissionName);
    console.log("Permission check result:", result);
    return result;
  };

  return {
    hasPermission,
  };
}