import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const isLoggedIn = session === process.env.LOGIN_HASH;

  // Don't redirect on /login
  if (!isLoggedIn && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  // If logged in, allow access to the requested page
  if (isLoggedIn && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Optional: Limit middleware to specific routes
export const config = {
  matcher: [
    '/((?!api|_next|static|favicon.ico).*)', // Exclude API routes and static files
  ],
};