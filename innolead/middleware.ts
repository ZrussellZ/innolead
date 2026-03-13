import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname

    const publicPaths = [
      '/login',
      '/api/auth',
      '/api/results/callback',
      '/logo.png',
      '/favicon.ico',
    ]

    const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))
    if (isPublic) {
      return NextResponse.next()
    }

    const authCookie = request.cookies.get('innolead_auth')
    if (authCookie?.value === 'authenticated') {
      return NextResponse.next()
    }

    if (pathname.startsWith('/api/')) {
      return new NextResponse(JSON.stringify({ error: 'Niet geautoriseerd' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return NextResponse.redirect(new URL('/login', request.url))
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|logo.png).*)',
  ],
}
