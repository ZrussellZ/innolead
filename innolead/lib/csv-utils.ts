import Papa from 'papaparse'
import fs from 'fs'
import path from 'path'
import type { Lead } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export function parseCSVString(csvContent: string): Lead[] {
  const result = Papa.parse<Lead>(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  })
  return result.data
}

export function readRunCSV(runId: string): Lead[] {
  const filePath = path.join(DATA_DIR, `${runId}.csv`)
  if (!fs.existsSync(filePath)) {
    return []
  }
  const content = fs.readFileSync(filePath, 'utf-8')
  return parseCSVString(content)
}

export function writeRunCSV(runId: string, leads: Lead[]): void {
  ensureDataDir()
  const csv = Papa.unparse(leads)
  const filePath = path.join(DATA_DIR, `${runId}.csv`)
  fs.writeFileSync(filePath, csv, 'utf-8')
}

export function writeRawCSV(runId: string, csvContent: string): void {
  ensureDataDir()
  const filePath = path.join(DATA_DIR, `${runId}.csv`)
  fs.writeFileSync(filePath, csvContent, 'utf-8')
}

export function getCSVFilePath(runId: string): string {
  return path.join(DATA_DIR, `${runId}.csv`)
}

export function csvFileExists(runId: string): boolean {
  return fs.existsSync(path.join(DATA_DIR, `${runId}.csv`))
}
