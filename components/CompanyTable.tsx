'use client'

import { Fragment, useState, useMemo, useRef, useEffect } from 'react'
import type { Lead } from '@/lib/types'
import CompanyDetail from './CompanyDetail'

type SortField = 'Company name' | 'Score %' | 'Website URL' | 'Date'
type SortDirection = 'asc' | 'desc'

const TAG_OPTIONS = ['Cas', 'Cuno', 'Philip'] as const
type TagValue = (typeof TAG_OPTIONS)[number]

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Cas: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  Cuno: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  Philip: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
}

function TagBadge({ tag }: { tag: string }) {
  const colors = TAG_COLORS[tag]
  if (!colors) return null
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
      {tag}
    </span>
  )
}

function TagDropdown({
  currentTag,
  onSelect,
}: {
  currentTag: string
  onSelect: (tag: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded hover:bg-surface-alt transition-colors text-text-muted hover:text-text"
        title="Tag toewijzen"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-surface-border rounded-lg shadow-lg z-50 py-1 min-w-[120px]">
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              onClick={() => { onSelect(tag); setOpen(false) }}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-surface-alt transition-colors flex items-center gap-2 ${
                currentTag === tag ? 'font-semibold' : ''
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${TAG_COLORS[tag].bg} ${TAG_COLORS[tag].border} border`} />
              {tag}
              {currentTag === tag && (
                <svg className="w-3.5 h-3.5 ml-auto text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}
          {currentTag && (
            <>
              <div className="border-t border-surface-border my-1" />
              <button
                onClick={() => { onSelect(''); setOpen(false) }}
                className="w-full text-left px-3 py-1.5 text-sm text-text-muted hover:bg-surface-alt transition-colors"
              >
                Verwijder tag
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function ScoreBadge({ score }: { score: string }) {
  const numScore = parseInt(score) || 0
  const cls =
    numScore >= 70 ? 'score-high' : numScore >= 40 ? 'score-mid' : 'score-low'
  return <span className={`score-badge ${cls}`}>{score}</span>
}

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) {
    return (
      <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
      </svg>
    )
  }
  return direction === 'asc' ? (
    <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  ) : (
    <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

export default function CompanyTable({
  leads,
  onSelectCompany,
  selectedIndex,
  selectedForExport,
  onToggleSelect,
  onToggleSelectAll,
  onTagChange,
}: {
  leads: Lead[]
  onSelectCompany: (index: number | null) => void
  selectedIndex: number | null
  selectedForExport: Set<number>
  onToggleSelect: (index: number) => void
  onToggleSelectAll: (visibleIndices: number[]) => void
  onTagChange: (index: number, tag: string) => void
}) {
  const [sortField, setSortField] = useState<SortField>('Score %')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [tagFilter, setTagFilter] = useState<string | null>(null)

  const filteredAndSorted = useMemo(() => {
    let result = leads.map((lead, originalIndex) => ({ lead, originalIndex }))

    if (tagFilter !== null) {
      if (tagFilter === '') {
        result = result.filter(({ lead }) => !lead['Tag'])
      } else {
        result = result.filter(({ lead }) => lead['Tag'] === tagFilter)
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        ({ lead }) =>
          lead['Company name']?.toLowerCase().includes(q) ||
          lead['Website URL']?.toLowerCase().includes(q) ||
          lead['Tag']?.toLowerCase().includes(q)
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
  }, [leads, searchQuery, sortField, sortDirection, tagFilter])

  const visibleIndices = useMemo(
    () => filteredAndSorted.map(({ originalIndex }) => originalIndex),
    [filteredAndSorted],
  )

  const allVisibleSelected =
    visibleIndices.length > 0 && visibleIndices.every((i) => selectedForExport.has(i))
  const someVisibleSelected =
    !allVisibleSelected && visibleIndices.some((i) => selectedForExport.has(i))

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection(field === 'Score %' ? 'desc' : 'asc')
    }
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
          placeholder="Zoek op bedrijfsnaam, URL of tag..."
          className="input-field pl-10"
        />
      </div>

      {/* Filter controls */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-text-secondary">Tag:</span>
          {[
            { value: null, label: 'Alle' },
            ...TAG_OPTIONS.map((t) => ({ value: t, label: t })),
            { value: '', label: 'Geen tag' },
          ].map(({ value, label }) => (
            <button
              key={label}
              onClick={() => setTagFilter(tagFilter === value ? null : value)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                tagFilter === value
                  ? 'bg-brand text-white border-brand'
                  : 'border-surface-border text-text-secondary hover:border-brand'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 md:hidden">
          <span className="text-xs text-text-secondary">Sorteer:</span>
          {([
            { field: 'Company name' as SortField, label: 'Naam' },
            { field: 'Score %' as SortField, label: 'Score' },
            { field: 'Date' as SortField, label: 'Datum' },
          ]).map(({ field, label }) => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                sortField === field
                  ? 'bg-brand text-white border-brand'
                  : 'border-surface-border text-text-secondary hover:border-brand'
              }`}
            >
              {label}
              {sortField === field && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2">
        {filteredAndSorted.map(({ lead, originalIndex }) => {
          const isSelected = selectedIndex === originalIndex
          const isChecked = selectedForExport.has(originalIndex)
          return (
            <Fragment key={originalIndex}>
              <div className="flex items-start gap-3 w-full">
                <label className="flex-shrink-0 mt-4 flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleSelect(originalIndex)}
                    className="w-4.5 h-4.5 rounded border-surface-border text-brand focus:ring-brand cursor-pointer accent-[var(--color-brand,#4f46e5)]"
                  />
                </label>
                <div
                  onClick={() => onSelectCompany(isSelected ? null : originalIndex)}
                  className={`flex-1 min-w-0 rounded-xl border p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-brand-light border-brand'
                      : isChecked
                        ? 'bg-brand-light/50 border-brand/50'
                        : 'bg-white border-surface-border active:bg-surface-alt'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className={`w-4 h-4 flex-shrink-0 transition-transform ${isSelected ? 'rotate-90 text-brand' : 'text-text-muted'}`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                        <span className="font-semibold text-text truncate">{lead['Company name']}</span>
                      </div>
                      <p className="text-xs text-text-secondary truncate mt-1 ml-6">
                        {lead['Website URL']}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <ScoreBadge score={lead['Score %']} />
                        <div onClick={(e) => e.stopPropagation()}>
                          <TagDropdown
                            currentTag={lead['Tag'] || ''}
                            onSelect={(tag) => onTagChange(originalIndex, tag)}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {lead['Tag'] && <TagBadge tag={lead['Tag']} />}
                        <span className="text-xs text-text-muted">
                          {lead['Date']?.split(' ')[0] || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="rounded-xl border border-brand bg-white overflow-hidden ml-7">
                  <CompanyDetail
                    lead={lead}
                    onClose={() => onSelectCompany(null)}
                  />
                </div>
              )}
            </Fragment>
          )
        })}
        {filteredAndSorted.length === 0 && (
          <div className="text-center py-12 text-text-secondary">
            Geen resultaten gevonden
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-surface-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-alt">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  ref={(el) => { if (el) el.indeterminate = someVisibleSelected }}
                  onChange={() => onToggleSelectAll(visibleIndices)}
                  className="w-4 h-4 rounded border-surface-border text-brand focus:ring-brand cursor-pointer accent-[var(--color-brand,#4f46e5)]"
                />
              </th>
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
                    <SortIcon active={sortField === field} direction={sortDirection} />
                  </div>
                </th>
              ))}
              <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary select-none">
                Tag
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map(({ lead, originalIndex }) => {
              const isSelected = selectedIndex === originalIndex
              const isChecked = selectedForExport.has(originalIndex)
              return (
                <Fragment key={originalIndex}>
                  <tr
                    className={`border-t border-surface-border cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-brand-light border-brand'
                        : isChecked
                          ? 'bg-brand-light/50'
                          : 'hover:bg-surface-alt'
                    }`}
                  >
                    <td className="w-12 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleSelect(originalIndex)}
                        className="w-4 h-4 rounded border-surface-border text-brand focus:ring-brand cursor-pointer accent-[var(--color-brand,#4f46e5)]"
                      />
                    </td>
                    <td className="px-4 py-3" onClick={() => onSelectCompany(isSelected ? null : originalIndex)}>
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className={`w-4 h-4 flex-shrink-0 transition-transform ${isSelected ? 'rotate-90 text-brand' : 'text-text-muted'}`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                        <span className="font-medium text-text">{lead['Company name']}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3" onClick={() => onSelectCompany(isSelected ? null : originalIndex)}>
                      <span className="text-sm text-text-secondary truncate block max-w-xs">
                        {lead['Website URL']}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={() => onSelectCompany(isSelected ? null : originalIndex)}>
                      <ScoreBadge score={lead['Score %']} />
                    </td>
                    <td className="px-4 py-3" onClick={() => onSelectCompany(isSelected ? null : originalIndex)}>
                      <span className="text-sm text-text-secondary">
                        {lead['Date']?.split(' ')[0] || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {lead['Tag'] && <TagBadge tag={lead['Tag']} />}
                        <TagDropdown
                          currentTag={lead['Tag'] || ''}
                          onSelect={(tag) => onTagChange(originalIndex, tag)}
                        />
                      </div>
                    </td>
                  </tr>

                  {isSelected && (
                    <tr className="border-t border-brand">
                      <td colSpan={6} className="p-0 bg-white">
                        <div className="p-4">
                          <CompanyDetail
                            lead={lead}
                            onClose={() => onSelectCompany(null)}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
            {filteredAndSorted.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-text-secondary">
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
