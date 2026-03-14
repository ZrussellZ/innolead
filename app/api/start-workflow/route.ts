import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { requireAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const authError = requireAuth(request)
    if (authError) return authError

    const { keyword } = await request.json()

    if (!keyword || typeof keyword !== 'string' || !keyword.trim()) {
      return NextResponse.json(
        { error: 'Vul een zoekwoord in' },
        { status: 400 }
      )
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL
    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'N8N webhook URL is niet geconfigureerd' },
        { status: 500 }
      )
    }

    const runId = uuidv4()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const callbackUrl = `${appUrl}/api/results/callback`

    const webhookRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keyword: keyword.trim(),
        runId,
        callbackUrl,
      }),
    })

    if (!webhookRes.ok) {
      console.error('n8n webhook returned', webhookRes.status, await webhookRes.text().catch(() => ''))
      return NextResponse.json(
        { error: 'Webhook kon niet worden bereikt' },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      runId,
      message: 'Automatisering gestart',
    })
  } catch {
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}
