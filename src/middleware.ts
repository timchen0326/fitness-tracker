import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  try {
    await supabase.auth.getSession();
    return res;
  } catch {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
}

// Specify which routes should be handled by the middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/exercise/:path*',
    '/diet/:path*',
    '/profile/:path*',
  ],
}; 