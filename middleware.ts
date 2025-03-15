import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from "@/auth";

// Constants from the image
const protectedRoutes = ["/dashboard", "/profile","/discover"];
const authPageRoutes = ["/welcome"];
const apiAuthPrefix = "/api/auth";

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const path = nextUrl.pathname;
  const isLoggedIn = !!request.cookies.get('authjs.session-token')?.value; // Using your cookie check
  
  // console.log(request.cookies);
  // Check if the route is an API auth route
  const isApiAuthRoute = path.startsWith(apiAuthPrefix);
  const isProtectedRoute = protectedRoutes.includes(path);
  const isAuthPageRoute = authPageRoutes.includes(path);
  
  // Your role-based logic
  const userType = request.cookies.get('userType')?.value;
  const adminRoutes = ['/admin/dashboard', '/admin/settings'];
  const moderatorRoutes = ['/moderator/reports', '/moderator/manage'];

  // Let API auth routes pass through
  if (isApiAuthRoute) {
    return NextResponse.next();
  }
  
  // Redirect to login if trying to access protected route while not logged in
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }
  // console.log(isLoggedIn);
  if(isLoggedIn && isAuthPageRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  // Admin-only routes
  if (adminRoutes.includes(path) && userType !== '2') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Moderator-only routes
  if (moderatorRoutes.includes(path) && userType !== '3') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Allow access to all other routes
  return NextResponse.next();
}

// Using the regexp matcher from the image
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};