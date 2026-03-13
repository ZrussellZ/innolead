import { NextRequest, NextResponse } from 'next/server'
import { getRuns } from '@/lib/runs'
import { readRunCSV } from '@/lib/csv-utils'
import { seedDemoData } from '@/lib/seed'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

let seeded = false

export async function GET(request: NextRequest) {
  try {
    const authError = requireAuth(request)
    if (authError) return authError

    if (!seeded) {
      seedDemoData()
      seeded = true
    }

    const { searchParams } = new URL(request.url)
    const runId = searchParams.get('runId')

    if (runId) {
      const leads = readRunCSV(runId)
      return NextResponse.json({ leads })
    }

    const runs = getRuns()
    return NextResponse.json({ runs })
  } catch {
    return NextResponse.json(
      { error: 'Fout bij ophalen resultaten' },
      { status: 500 }
    )
  }
}
