import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(request: NextRequest) {

  const path = request.nextUrl.pathname;


  const protectedRoutes = [
    "/dashboard",
    "/student-portal",
    "/employer-hub",
    "/partner-portal",
    "/admin",
  ];


  const requiresAuth = protectedRoutes.some(
    (route) =>
      path.startsWith(route)
  );


  if (requiresAuth) {

    // Authentication provider will be connected here.

    return NextResponse.next();

  }


  return NextResponse.next();

}


export const config = {

  matcher: [
    "/dashboard/:path*",
    "/student-portal/:path*",
    "/employer-hub/:path*",
    "/partner-portal/:path*",
    "/admin/:path*",
  ],

};
