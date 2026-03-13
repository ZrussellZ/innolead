'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/')
        router.refresh()
      } else {
        setError('Onjuist wachtwoord')
        setPassword('')
      }
    } catch {
      setError('Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-6">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img src="/logo.png" alt="InnoLead" className="h-14" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            placeholder="Wachtwoord"
            className="input-field text-center text-lg tracking-widest"
            autoFocus
            disabled={loading}
          />

          {error && (
            <p className="text-red-500 text-sm text-center mt-3">{error}</p>
          )}

          {/* Hidden submit so Enter key works */}
          <button type="submit" className="sr-only">Inloggen</button>
        </form>
      </div>
    </div>
  )
}
