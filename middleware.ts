import { authMiddleware } from '@clerk/nextjs';
export default authMiddleware({
  publicRoutes: ['/', '/signin', '/signup', '/api/webhook/clerk'],
  ignoredRoutes: ['/api/webhook/clerk'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
