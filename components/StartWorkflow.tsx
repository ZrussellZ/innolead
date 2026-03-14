'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const MAX_KEYWORDS = 3

export default function StartWorkflow() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'started' | 'duplicate' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const router = useRouter()

  function parseKeywords(raw: string): string[] {
    return raw
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)
  }

  async function handleStart(e: React.FormEvent) {
    e.preventDefault()

    const keywords = parseKeywords(input)
    if (keywords.length === 0) return

    if (keywords.length > MAX_KEYWORDS) {
      setStatus('error')
      setMessage(`Je kunt maximaal ${MAX_KEYWORDS} keywords tegelijk gebruiken`)
      return
    }

    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const { data: existingLeads } = await supabase
        .from('leads')
        .select('keyword')

      const existingKeywords = new Set(
        (existingLeads ?? []).map((r) => r.keyword?.toLowerCase()),
      )

      const duplicates = keywords.filter((k) =>
        existingKeywords.has(k.toLowerCase()),
      )

      if (duplicates.length > 0) {
        setStatus('duplicate')
        const dupList = duplicates.map((k) => `"${k}"`).join(', ')
        setMessage(
          duplicates.length === 1
            ? `Het keyword ${dupList} is al eerder gebruikt`
            : `De keywords ${dupList} zijn al eerder gebruikt`,
        )
        setLoading(false)
        return
      }

      const results = await Promise.all(
        keywords.map((keyword) =>
          fetch('/api/start-workflow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyword }),
          }).then(async (res) => {
            const data = await res.json()
            return { ok: res.ok, data, keyword }
          }),
        ),
      )

      const failed = results.filter((r) => !r.ok)
      if (failed.length === 0) {
        setStatus('started')
        const keywordList = keywords.map((k) => `"${k}"`).join(', ')
        setMessage(
          keywords.length === 1
            ? `Automatisering gestart voor ${keywordList}`
            : `${keywords.length} automatiseringen gestart voor ${keywordList}`,
        )
        setTimeout(() => router.push('/resultaten'), 2000)
      } else {
        setStatus('error')
        setMessage(failed[0].data.error || 'Er is een fout opgetreden')
      }
    } catch {
      setStatus('error')
      setMessage('Kan geen verbinding maken met de server')
    } finally {
      setLoading(false)
    }
  }

  const keywords = parseKeywords(input)
  const tooMany = keywords.length > MAX_KEYWORDS

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleStart} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Keyword(s)"
            className="input-field text-lg py-4 pr-4 text-center"
            disabled={loading}
          />
        </div>

        {tooMany && (
          <p className="text-red-600 text-sm font-medium">
            Maximaal {MAX_KEYWORDS} keywords tegelijk (je hebt er {keywords.length})
          </p>
        )}

        <button
          type="submit"
          disabled={loading || keywords.length === 0 || tooMany}
          className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Bezig met starten...
            </span>
          ) : (
            'Start Automatisering'
          )}
        </button>
      </form>

      {status === 'started' && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
          <p className="font-medium">{message}</p>
          <p className="text-sm mt-1 text-green-600">
            Je wordt doorgestuurd naar de resultaten pagina...
          </p>
        </div>
      )}

      {status === 'duplicate' && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-center">
          <p className="font-medium">{message}</p>
          <p className="text-sm mt-1 text-amber-600">
            Gebruik een ander keyword om een nieuwe automatisering te starten.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center">
          <p className="font-medium">{message}</p>
        </div>
      )}
    </div>
  )
}
