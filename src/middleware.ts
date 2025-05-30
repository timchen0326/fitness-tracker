import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const { data: { session }, error } = await supabase.auth.getSession();

  // Handle authentication for specific routes
  const path = req.nextUrl.pathname;

  // Public routes that don't require authentication
  if (path === '/' || path === '/auth/verify-email') {
    return res;
  }

  // Auth routes (signin, signup) - redirect to dashboard if already authenticated
  if (path.startsWith('/auth')) {
    if (session) {
      const redirectUrl = new URL('/dashboard', req.url);
      return NextResponse.redirect(redirectUrl);
    }
    return res;
  }

  // Protected routes - redirect to signin if not authenticated
  if (!session) {
    const redirectUrl = new URL('/auth/signin', req.url);
    redirectUrl.searchParams.set('redirectedFrom', path);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Specify which routes should be handled by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 