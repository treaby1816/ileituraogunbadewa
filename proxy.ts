import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // If the user is trying to access /dashboard but NOT /dashboard/login
  if (request.nextUrl.pathname.startsWith("/dashboard") && request.nextUrl.pathname !== "/dashboard/login") {
    // Check for the admin auth cookie
    const adminToken = request.cookies.get("admin_session")?.value;
    const correctPassword = process.env.ADMIN_PASSWORD || "admin123"; // Fallback for testing
    
    if (!adminToken || adminToken !== correctPassword) {
      // Redirect to login page
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
  }

  // If already logged in and trying to access /dashboard/login, redirect to /dashboard
  if (request.nextUrl.pathname === "/dashboard/login") {
    const adminToken = request.cookies.get("admin_session")?.value;
    const correctPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    if (adminToken && adminToken === correctPassword) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
