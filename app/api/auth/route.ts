import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const correctPassword = process.env.APP_PASSWORD

    if (!correctPassword) {
      return NextResponse.json(
        { error: 'Wachtwoord nog niet ingesteld. Neem contact op met de beheerder.' },
        { status: 503 }
      )
    }

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true })
      response.cookies.set('innolead_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })
      return response
    }

    return NextResponse.json({ error: 'Onjuist wachtwoord' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Ongeldige aanvraag' }, { status: 400 })
  }
}
