import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface ProtectedComponentProps {
  children: ReactNode;
  requiredPermission: string;
  fallback?: ReactNode;
}

export function ProtectedComponent({
  children,
  requiredPermission,
  fallback = null,
}: ProtectedComponentProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}