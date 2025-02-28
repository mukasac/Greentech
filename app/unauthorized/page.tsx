// app/unauthorized/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-amber-100 p-4">
          <ShieldAlert className="h-12 w-12 text-amber-600" />
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tighter">Unauthorized Access</h1>
        <h2 className="mb-4 text-2xl font-semibold">Access Denied</h2>
        <p className="mb-8 text-muted-foreground">
          You do not have permission to access this page. If you believe this is an error, please contact an administrator.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth">
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}