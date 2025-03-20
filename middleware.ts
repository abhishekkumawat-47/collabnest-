import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { useSession } from 'next-auth/react';

export async function middleware(request: NextRequest) {
  const userType = request.cookies.get('userType')?.value;

  // const { data: session, status } = useSession();

  // console.log("frehfierifjiernvcuinrio voir vo kreok vferk",status);
  // Replace this with actual user type fetching logic
  
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // console.log("Token fetched -----------> ");
 

  console.log("Token fetched -----------> ",token);
  if(token){
    return NextResponse.redirect(new URL('/dashboard',request.url));
  }

  

  if (!userType) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Define role-based route protection
  const adminRoutes = ['/admin/dashboard', '/admin/settings'];
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
    
  ],
};
