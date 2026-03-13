import { NextRequest, NextResponse } from 'next/server'

export function requireAuth(request: NextRequest): NextResponse | null {
  const authCookie = request.cookies.get('innolead_auth')
  if (authCookie?.value === 'authenticated') {
    return null
  }
  return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
}
