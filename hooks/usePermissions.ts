'use client';

import { useSession } from 'next-auth/react';

export function usePermissions() {
  const { data: session } = useSession();
  
  /**
   * Check if the user has a specific permission
   * @param permissionName The permission to check for
   * @returns boolean indicating if the user has the permission
   */
  const hasPermission = (permissionName: string): boolean => {
    // If no session or no user, no permissions
    if (!session?.user) {
      return false;
    }

    // Get user permissions from session
    const userPermissions = session.user.permissions;
    
    // If no permissions array or it's not an array, no permissions
    if (!userPermissions || !Array.isArray(userPermissions)) {
      return false;
    }
    
    // Site admins have all permissions
    if (userPermissions.includes('SITE_ADMIN')) {
      return true;
    }
    
    // For any other permission, check if it's in the user's permissions array
    return userPermissions.includes(permissionName);
  };

  /**
   * Check if user has any of the specified permissions
   * @param permissionNames Array of permissions to check
   * @returns boolean indicating if the user has any of the permissions
   */
  const hasAnyPermission = (permissionNames: string[]): boolean => {
    return permissionNames.some(permission => hasPermission(permission));
  };

  /**
   * Check if user has all of the specified permissions
   * @param permissionNames Array of permissions to check
   * @returns boolean indicating if the user has all of the permissions
   */
  const hasAllPermissions = (permissionNames: string[]): boolean => {
    return permissionNames.every(permission => hasPermission(permission));
  };

  /**
   * Check if the user is a site administrator
   * @returns boolean indicating if the user is a site administrator
   */
  const isSiteAdmin = (): boolean => {
    return hasPermission('SITE_ADMIN');
  };

  /**
   * Get user role name
   * @returns string or null indicating the user's role name
   */
  const getUserRole = (): string | null => {
    if (!session?.user) {
      return null;
    }
    return session.user.role || null;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isSiteAdmin,
    getUserRole
  };
}