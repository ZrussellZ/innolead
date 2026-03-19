'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface Stats {
  totalLeads: number
  avgScore: number
  uniqueKeywords: number
}

export default function LeadStats() {
  const [stats, setStats] = useState<Stats | null>(null)

  const fetchStats = useCallback(async () => {
    const [countResult, avgResult, keywordsResult] = await Promise.all([
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('score_percentage'),
      supabase.from('leads').select('keyword'),
    ])

    const totalLeads = countResult.count ?? 0

    const scores = avgResult.data ?? []
    const avgScore =
      scores.length > 0
        ? scores.reduce((sum, row) => sum + (row.score_percentage ?? 0), 0) /
          scores.length
        : 0

    const uniqueKeywords = new Set(
      (keywordsResult.data ?? []).map((row) => row.keyword),
    ).size

    setStats({ totalLeads, avgScore, uniqueKeywords })
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10_000)
    return () => clearInterval(interval)
  }, [fetchStats])

  const items = [
    {
      label: 'Total Leads',
      value: stats ? stats.totalLeads.toLocaleString() : '—',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      ),
    },
    {
      label: 'Average Score',
      value: stats ? `${stats.avgScore.toFixed(1)}%` : '—',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
    },
    {
      label: 'Total Keywords',
      value: stats ? stats.uniqueKeywords.toLocaleString() : '—',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
        </svg>
      ),
    },
  ]

  return (
    <section className="py-16 bg-surface-alt/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-text text-center mb-10">
          Lead Statistieken
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((stat) => (
            <div key={stat.label} className="card flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-brand-light text-brand flex items-center justify-center">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-text-secondary">{stat.label}</p>
                <p className="text-2xl font-bold text-text">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
