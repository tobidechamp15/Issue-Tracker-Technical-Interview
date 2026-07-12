import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

 
const PROTECTED_ROUTES = [/^\/dashboard(?:\/.*)?$/, /^\/issues(?:\/.*)?$/];

 
const GUEST_ROUTES = [/^\/login(?:\/.*)?$/, /^\/register(?:\/.*)?$/];

 
const LANDING_PAGE = /^\/$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const isAuthenticated = !!token;

   const isProtected = PROTECTED_ROUTES.some((pattern) =>
    pattern.test(pathname),
  );
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

   const isGuest = GUEST_ROUTES.some((pattern) => pattern.test(pathname));
  if (isGuest && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

   if (LANDING_PAGE.test(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api/auth/*  (auth API routes — including /api/auth/me)
     * - /api/*       (other API routes – they have their own auth via withAuth)
     * - /_next/static (static files)
     * - /_next/image (image optimization files)
     * - /favicon.ico (favicon)
     */
    "/((?!api/|_next/static|_next/image|favicon.ico).*)",
  ],
};
