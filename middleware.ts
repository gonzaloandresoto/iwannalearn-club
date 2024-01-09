import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/onboarding',
    '/signin',
    '/signup',
    '/api/webhook/clerk',
  ],
  ignoredRoutes: ['/api/webhook/clerk, /onboarding'],
  afterAuth: (auth, req) => {
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(new URL('/', req.nextUrl).href);
    }
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
