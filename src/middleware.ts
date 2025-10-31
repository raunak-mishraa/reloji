import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // If user is authenticated, redirect from sign-in/sign-up
    if (token && (pathname.startsWith('/signin') || pathname.startsWith('/signup'))) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Protect admin routes
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Pages that don't require authentication
        const publicPaths = ['/', '/signin', '/signup', '/unauthorized'];
        if (publicPaths.includes(pathname) || pathname.startsWith('/api/auth')) {
          return true;
        }
        // All other pages require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // List all routes that should be protected or have special handling
    '/dashboard/:path*',
    '/messages/:path*',
    '/listings/new',
    '/my-listings/:path*',
    '/incoming-requests/:path*',
    '/my-requests/:path*',
    '/profile/:path*',
    '/circles/:path*',
    '/admin/:path*',
    '/signin',
    '/signup',
  ],
};
