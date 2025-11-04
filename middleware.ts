import { NextResponse } from 'next/server';

import { auth } from '#/auth';

const ADMIN_PREFIX = '/admin';
const CLIENT_PREFIX = '/client';

export async function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname.startsWith('/_next') || pathname.startsWith('/public')) {
    return NextResponse.next();
  }

  const session = await auth();

  if (pathname === '/login') {
    if (session?.user) {
      const role = session.user.role;
      if (role === 'ADMIN' || role === 'EMPLOYEE') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/client/dashboard', request.url));
    }

    return NextResponse.next();
  }

  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const role = session.user.role;

  if (pathname.startsWith(ADMIN_PREFIX) && role === 'CLIENT') {
    return NextResponse.redirect(new URL('/client/dashboard', request.url));
  }

  if (pathname.startsWith(CLIENT_PREFIX) && role !== 'CLIENT') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
