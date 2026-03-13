import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/results/callback') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/logo.png'
  ) {
    return NextResponse.next()
  }

  const authCookie = request.cookies.get('innolead_auth')
  if (authCookie?.value === 'authenticated') {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
  }

  const url = request.nextUrl.clone()
  url.searchParams.set('locked', '1')
  const response = NextResponse.rewrite(url)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png).*)'],
}
