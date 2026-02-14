import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin/* routes - key must match ADMIN_SECRET
  if (pathname.startsWith('/admin')) {
    const segments = pathname.split('/').filter(Boolean);
    const adminKey = segments[1]; // /admin/[key]/...
    const expectedKey = process.env.ADMIN_SECRET;

    if (!expectedKey || adminKey !== expectedKey) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
