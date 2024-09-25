'use server';

import { NextResponse } from 'next/server';

import { getSession } from './lib/session/get-session';

import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const session = await getSession();

  const hasToken = !!session.token;
  const isLogin = pathname.startsWith('/login');

  if (!hasToken && !isLogin) {
    return NextResponse.redirect(new URL(`/login?to=${pathname}`, request.nextUrl));
  }

  if (hasToken) {
    let response = NextResponse.next();

    if (isLogin) {
      response = NextResponse.redirect(new URL('/', request.nextUrl));
    }

    return response;
  }
}

export const config = {
  matcher: ['/((?!api|auth|_next/static|_next/image|assets|favicon.ico).*)'],
};
