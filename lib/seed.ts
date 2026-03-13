import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const RUNS_FILE = path.join(DATA_DIR, 'runs.json')
const DEMO_RUN_ID = 'demo-supplementen-2026'

export function seedDemoData() {
  try {
    const demoCSVPath = path.join(DATA_DIR, `${DEMO_RUN_ID}.csv`)
    if (fs.existsSync(demoCSVPath) && fs.existsSync(RUNS_FILE)) {
      return
    }
  } catch {
    // On read-only filesystem, existsSync might work but writing won't
    // If the files are bundled in the deployment, they'll be found above
    return
  }
}
