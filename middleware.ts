import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  publicRoutes: ['/', '/signin', '/signup', '/api/webhook/clerk'],
  ignoredRoutes: ['/api/webhook/clerk'],
  afterAuth: (auth, req) => {
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(new URL('/signup', req.nextUrl).href);
    }
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
