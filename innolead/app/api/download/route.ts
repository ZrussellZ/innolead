import { NextRequest, NextResponse } from 'next/server'
import { getCSVFilePath, csvFileExists } from '@/lib/csv-utils'
import { getRun } from '@/lib/runs'
import fs from 'fs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const runId = searchParams.get('runId')

    if (!runId) {
      return NextResponse.json({ error: 'runId is vereist' }, { status: 400 })
    }

    if (!csvFileExists(runId)) {
      return NextResponse.json(
        { error: 'CSV bestand niet gevonden' },
        { status: 404 }
      )
    }

    const filePath = getCSVFilePath(runId)
    const content = fs.readFileSync(filePath, 'utf-8')

    const run = getRun(runId)
    const filename = run
      ? `innolead-${run.keyword.replace(/\s+/g, '-')}-${run.date.split('T')[0]}.csv`
      : `innolead-${runId}.csv`

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Fout bij downloaden' },
      { status: 500 }
    )
  }
}
