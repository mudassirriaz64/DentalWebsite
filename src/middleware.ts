import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession, signSession } from '@/lib/auth';

const COOKIE_NAME = 'admin-session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and API login route to pass through
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  // Retrieve the session token from cookies
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    // No token, redirect to login or return 401
    return handleUnauthorized(request);
  }

  // Verify the session
  const session = await verifySession(token);

  if (!session) {
    // Invalid or expired token
    return handleUnauthorized(request);
  }

  // Refresh the session by signing a new token with extended expiration
  const refreshedToken = await signSession(session.username);

  // Continue the request and attach the refreshed cookie to the response
  const response = NextResponse.next();
  response.cookies.set(COOKIE_NAME, refreshedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 30, // 30 minutes in seconds
  });

  return response;
}

function handleUnauthorized(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized or session expired' }, { status: 401 });
  } else {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
