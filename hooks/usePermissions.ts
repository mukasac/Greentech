'use client';

import { useSession } from 'next-auth/react';

export function usePermissions() {
  const { data: session } = useSession();
  
  const hasPermission = (permissionName: string): boolean => {
    if (!session?.user?.permissions || !Array.isArray(session.user.permissions)) {
      return false;
    }
    return session.user.permissions.includes(permissionName);
  };

  return {
    hasPermission,
  };
}