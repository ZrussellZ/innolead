import { NextRequest, NextResponse } from 'next/server'
import { updateRun, getRun } from '@/lib/runs'
import { writeRawCSV, writeRunCSV, parseCSVString } from '@/lib/csv-utils'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    let runId: string
    let leadCount = 0

    if (contentType.includes('application/json')) {
      const body = await request.json()
      runId = body.runId

      if (!runId) {
        return NextResponse.json({ error: 'runId is vereist' }, { status: 400 })
      }

      if (body.csvData && typeof body.csvData === 'string') {
        writeRawCSV(runId, body.csvData)
        const leads = parseCSVString(body.csvData)
        leadCount = leads.length
      } else if (Array.isArray(body.data)) {
        writeRunCSV(runId, body.data)
        leadCount = body.data.length
      } else {
        return NextResponse.json(
          { error: 'Gegevens ontbreken (csvData string of data array vereist)' },
          { status: 400 }
        )
      }
    } else {
      const text = await request.text()
      const url = new URL(request.url)
      runId = url.searchParams.get('runId') || ''

      if (!runId) {
        return NextResponse.json({ error: 'runId is vereist' }, { status: 400 })
      }

      writeRawCSV(runId, text)
      const leads = parseCSVString(text)
      leadCount = leads.length
    }

    const run = getRun(runId)
    if (run) {
      updateRun(runId, {
        status: 'complete',
        companyCount: leadCount,
      })
    }

    return NextResponse.json({
      success: true,
      message: `${leadCount} leads opgeslagen`,
    })
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.json(
      { error: 'Fout bij verwerken van resultaten' },
      { status: 500 }
    )
  }
}
