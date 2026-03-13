'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StartWorkflow() {
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'started' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function handleStart(e: React.FormEvent) {
    e.preventDefault()
    if (!keyword.trim()) return

    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const res = await fetch('/api/start-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: keyword.trim() }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('started')
        setMessage(`Automatisering gestart voor "${keyword.trim()}"`)
        setTimeout(() => {
          router.push('/resultaten')
        }, 2000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Er is een fout opgetreden')
      }
    } catch {
      setStatus('error')
      setMessage('Kan geen verbinding maken met de server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleStart} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Voer een zoekwoord in (bijv. supplementen, skincare, CBD...)"
            className="input-field text-lg py-4 pr-4"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !keyword.trim()}
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

      {status === 'error' && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center">
          <p className="font-medium">{message}</p>
        </div>
      )}
    </div>
  )
}
