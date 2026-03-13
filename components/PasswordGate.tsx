'use client'

import { useState, useEffect } from 'react'

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [locked, setLocked] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('locked') === '1') {
      setLocked(true)
    }
    setChecking(false)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        const cleanUrl = window.location.pathname
        window.location.href = cleanUrl
      } else {
        const data = await res.json()
        setError(data.error || 'Onjuist wachtwoord')
      }
    } catch {
      setError('Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt">
        <div className="animate-pulse text-text-secondary">Laden...</div>
      </div>
    )
  }

  if (locked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt">
        <div className="card max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="InnoLead" className="h-12 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text">InnoLead</h1>
            <p className="text-text-secondary mt-2">
              Voer het wachtwoord in om toegang te krijgen.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Wachtwoord"
                className="input-field"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Controleren...' : 'Inloggen'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
