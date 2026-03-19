import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Non-blocking middleware that only inspects pathname.
 * All authentication logic is handled in:
 * - App Router pages (using auth() + redirect)
 * - API routes (using auth() + 401 response)
 */
export function middleware(request: NextRequest) {
  // Simply pass through - auth is handled at the page/route level
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/activities/:path*",
    "/my-posters/:path*",
    "/poster/create/:path*",
    "/watchfaces/:path*",
    "/admin/:path*",
  ],
};
