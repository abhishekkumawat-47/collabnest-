import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userType = request.cookies.get('userType')?.value;
  // Replace this with actual user type fetching logic
 

  if (!userType) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Define role-based route protection
  const adminRoutes = ['/admin/dashboard', '/admin/settings', '/leaderboard'];
  const moderatorRoutes = ['/moderator/reports', '/moderator/manage'];

  const requestedPath = new URL(request.url).pathname;

  // Admin-only routes
  if (adminRoutes.includes(requestedPath) && userType !== '2') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Moderator-only routes
  if (moderatorRoutes.includes(requestedPath) && userType !== '3') { // Fix syntax error here
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',  
    '/moderator/:path*', 
    '/leaderboard'
  ],
};
