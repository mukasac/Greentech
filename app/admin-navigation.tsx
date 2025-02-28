// components/admin-navigation.tsx
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Shield } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { Button } from "../components/ui/button";

export function AdminNavLink() {
  const { data: session, status } = useSession();
  const { hasPermission } = usePermissions();

  if (status !== "authenticated" || !hasPermission("ADMIN_ACCESS")) {
    return null;
  }

  return (
    <Button variant="ghost" size="sm" asChild className="font-medium">
      <Link href="/admin" className="flex items-center gap-1">
        <Shield className="h-4 w-4" />
        Admin
      </Link>
    </Button>
  );
}