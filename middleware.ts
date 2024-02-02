import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/onboarding',
    '/signin',
    '/signup',
    '/api/webhook/clerk',
    '/course/(.*)',
    '/logsnag/(.*)',
  ],
  ignoredRoutes: [
    '/api/webhook/clerk',
    '/onboarding',
    '/course/(.*)',
    '/logsnag/(.*)',
  ],
  afterAuth: (auth, req) => {
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(new URL('/', req.nextUrl).href);
    }
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
