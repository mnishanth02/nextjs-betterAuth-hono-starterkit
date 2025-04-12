import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Get current path
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/auth/sign-in" ||
    path === "/auth/sign-up" ||
    path === "/auth/forgot-password" ||
    path === "/auth/reset-password" ||
    path.startsWith("/auth/reset-password/") ||
    path === "/";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect authenticated users away from auth pages
  if (isPublicPath && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users to login
  if (!isPublicPath && !session) {
    // Store the original path to redirect back after login
    const redirectUrl = new URL("/auth/sign-in", request.url);
    redirectUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths that require authentication
    "/admin/:path*",
    // Match authentication pages
    "/auth/:path*",
  ],
};
