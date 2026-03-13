'use client'

import { useState, useMemo } from 'react'
import type { Lead } from '@/lib/types'

type SortField = 'Company name' | 'Score %' | 'Website URL' | 'Date'
type SortDirection = 'asc' | 'desc'

function ScoreBadge({ score }: { score: string }) {
  const numScore = parseInt(score) || 0
  const cls =
    numScore >= 70 ? 'score-high' : numScore >= 40 ? 'score-mid' : 'score-low'
  return <span className={`score-badge ${cls}`}>{score}</span>
}

export default function CompanyTable({
  leads,
  onSelectCompany,
  selectedIndex,
}: {
  leads: Lead[]
  onSelectCompany: (index: number) => void
  selectedIndex: number | null
}) {
  const [sortField, setSortField] = useState<SortField>('Score %')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAndSorted = useMemo(() => {
    let result = leads.map((lead, originalIndex) => ({ lead, originalIndex }))

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        ({ lead }) =>
          lead['Company name']?.toLowerCase().includes(q) ||
          lead['Website URL']?.toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      let aVal = a.lead[sortField] || ''
      let bVal = b.lead[sortField] || ''

      if (sortField === 'Score %') {
        const aNum = parseInt(aVal) || 0
        const bNum = parseInt(bVal) || 0
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum
      }

      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [leads, searchQuery, sortField, sortDirection])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection(field === 'Score %' ? 'desc' : 'asc')
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
      )
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Zoek op bedrijfsnaam of URL..."
          className="input-field pl-10"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-surface-border">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-alt">
              {([
                { field: 'Company name' as SortField, label: 'Bedrijfsnaam' },
                { field: 'Website URL' as SortField, label: 'Website' },
                { field: 'Score %' as SortField, label: 'Score' },
                { field: 'Date' as SortField, label: 'Datum' },
              ]).map(({ field, label }) => (
                <th
                  key={field}
                  className="text-left px-4 py-3 text-sm font-semibold text-text-secondary cursor-pointer hover:text-text transition-colors select-none"
                  onClick={() => handleSort(field)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <SortIcon field={field} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map(({ lead, originalIndex }) => (
              <tr
                key={originalIndex}
                onClick={() => onSelectCompany(originalIndex)}
                className={`border-t border-surface-border cursor-pointer transition-colors ${
                  selectedIndex === originalIndex
                    ? 'bg-brand-light'
                    : 'hover:bg-surface-alt'
                }`}
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-text">{lead['Company name']}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-text-secondary truncate block max-w-xs">
                    {lead['Website URL']}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ScoreBadge score={lead['Score %']} />
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-text-secondary">
                    {lead['Date']?.split(' ')[0] || '-'}
                  </span>
                </td>
              </tr>
            ))}
            {filteredAndSorted.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-text-secondary">
                  Geen resultaten gevonden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-text-secondary">
        {filteredAndSorted.length} van {leads.length} bedrijven
      </p>
    </div>
  )
}
