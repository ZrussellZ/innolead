import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const authError = requireAuth(request)
    if (authError) return authError

    const { company_name, company_url, contact_first_name, contact_last_name } =
      await request.json()

    if (!company_name || !contact_first_name || !contact_last_name) {
      return NextResponse.json(
        { error: 'Missende gegevens' },
        { status: 400 },
      )
    }

    const webhookUrl = process.env.N8N_GET_EMAIL_WEBHOOK_URL
    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Email webhook URL is niet geconfigureerd' },
        { status: 500 },
      )
    }

    const webhookRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_name,
        company_url,
        contact_first_name,
        contact_last_name,
      }),
    })

    if (!webhookRes.ok) {
      return NextResponse.json(
        { error: 'Email webhook niet bereikbaar' },
        { status: 502 },
      )
    }

    const data = await webhookRes.json()

    return NextResponse.json({
      email: data.email || null,
      email_status: data.email_status || null,
    })
  } catch {
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 },
    )
  }
}
