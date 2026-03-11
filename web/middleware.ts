import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const authToken = request.cookies.get('auth-token')?.value

  // Public routes that don't need auth
  const publicRoutes = ['/portal/login', '/portal/signup', '/admin/login', '/']

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

  // If no auth token and trying to access protected route, redirect to appropriate login
  if (!authToken && !isPublicRoute) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (pathname.startsWith('/portal')) {
      return NextResponse.redirect(new URL('/portal/login', request.url))
    }
  }

  // If user has auth token and tries to access login pages, redirect to dashboard
  if (authToken && (pathname === '/portal/login' || pathname === '/admin/login')) {
    // Redirect to portal dashboard for now (you could decode token to check role)
    return NextResponse.redirect(new URL('/portal/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
