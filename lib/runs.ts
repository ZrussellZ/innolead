import fs from 'fs'
import path from 'path'
import type { Run } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')
const RUNS_FILE = path.join(DATA_DIR, 'runs.json')

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
  } catch {
    // Read-only filesystem (e.g. Vercel)
  }
}

export function getRuns(): Run[] {
  ensureDataDir()
  if (!fs.existsSync(RUNS_FILE)) {
    return []
  }
  const content = fs.readFileSync(RUNS_FILE, 'utf-8')
  try {
    return JSON.parse(content) as Run[]
  } catch {
    return []
  }
}

export function getRun(id: string): Run | undefined {
  return getRuns().find((r) => r.id === id)
}

export function createRun(run: Run): void {
  const runs = getRuns()
  runs.unshift(run)
  saveRuns(runs)
}

export function updateRun(id: string, updates: Partial<Run>): void {
  const runs = getRuns()
  const index = runs.findIndex((r) => r.id === id)
  if (index !== -1) {
    runs[index] = { ...runs[index], ...updates }
    saveRuns(runs)
  }
}

function saveRuns(runs: Run[]): void {
  try {
    ensureDataDir()
    fs.writeFileSync(RUNS_FILE, JSON.stringify(runs, null, 2), 'utf-8')
  } catch {
    console.warn('Could not save runs (read-only filesystem)')
  }
}
