import fs from 'fs'
import path from 'path'
import { parseCSVString } from './csv-utils'

const DATA_DIR = path.join(process.cwd(), 'data')
const RUNS_FILE = path.join(DATA_DIR, 'runs.json')
const DEMO_RUN_ID = 'demo-supplementen-2026'

export function seedDemoData() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  const demoCSVPath = path.join(DATA_DIR, `${DEMO_RUN_ID}.csv`)
  if (fs.existsSync(demoCSVPath) && fs.existsSync(RUNS_FILE)) {
    return
  }

  const samplePath = path.join(process.cwd(), '..', 'sample-data.csv.csv')
  if (!fs.existsSync(samplePath)) {
    const altPath = path.join(process.cwd(), 'sample-data.csv.csv')
    if (!fs.existsSync(altPath)) {
      console.log('Sample data not found, skipping seed')
      return
    }
    copyAndSeed(altPath)
    return
  }

  copyAndSeed(samplePath)
}

function copyAndSeed(sourcePath: string) {
  const csvContent = fs.readFileSync(sourcePath, 'utf-8')
  const leads = parseCSVString(csvContent)

  const DATA_DIR_PATH = path.join(process.cwd(), 'data')
  if (!fs.existsSync(DATA_DIR_PATH)) {
    fs.mkdirSync(DATA_DIR_PATH, { recursive: true })
  }

  fs.writeFileSync(
    path.join(DATA_DIR_PATH, `${DEMO_RUN_ID}.csv`),
    csvContent,
    'utf-8'
  )

  const runs = [
    {
      id: DEMO_RUN_ID,
      keyword: 'supplementen',
      date: '2026-03-13T13:13:59.000Z',
      status: 'complete',
      companyCount: leads.length,
    },
  ]

  fs.writeFileSync(
    path.join(DATA_DIR_PATH, 'runs.json'),
    JSON.stringify(runs, null, 2),
    'utf-8'
  )

  console.log(`Seeded demo data: ${leads.length} leads`)
}
