import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Define your route permissions
    const routePermissions: Record<string, string[]> = {
      "/admin": ["ADMIN_ACCESS"],
      "/dashboard": ["DASHBOARD_ACCESS"],
      "/startups": ["STARTUP_VIEW"],
      "/startups/create": ["STARTUP_CREATE"],
    };
    
    // Check if route requires specific permissions
    const requiredPermissions = routePermissions[path];
    if (requiredPermissions) {
      const hasRequiredPermission = requiredPermissions.some(
        permission => token?.permissions?.includes(permission)
      );
      
      if (!hasRequiredPermission) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/startups/:path*",
  ],
};