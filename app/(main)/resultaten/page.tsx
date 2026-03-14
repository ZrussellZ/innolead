'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Lead } from '@/lib/types'
import CompanyTable from '@/components/CompanyTable'

interface KeywordGroup {
  keyword: string
  count: number
  latestDate: string
}

function mapRow(row: Record<string, unknown>): Lead {
  const lead = {} as Lead
  for (const [key, value] of Object.entries(row)) {
    lead[key] = value == null ? '' : String(value)
  }
  if (!lead['Score %']) lead['Score %'] = lead['score_percentage'] || ''
  if (!lead['Company name']) lead['Company name'] = lead['company_name'] || ''
  if (!lead['Website URL']) lead['Website URL'] = lead['website_url'] || ''
  if (!lead['Date']) lead['Date'] = lead['date'] || lead['created_at'] || ''
  return lead
}

function leadToCsvRow(lead: Lead): string {
  const fields = [
    lead['Company name'],
    lead['Website URL'],
    lead['Score %'],
    lead['Date'],
    lead['Wat voor producten ze verkopen'],
    lead['Aantal SKU\'s'],
    lead['Google Rating'],
    lead['Google Total Reviews'],
    lead['TrustPilot Rating'],
    lead['TrustPilot Total Reviews'],
    lead['Has Meta Ads'],
    lead['Google has ads'],
    lead['Status'],
  ]
  return fields.map((f) => `"${(f || '').replace(/"/g, '""')}"`).join(',')
}

const CSV_HEADER = [
  'Company name', 'Website URL', 'Score %', 'Date',
  'Products', 'SKUs', 'Google Rating', 'Google Reviews',
  'TrustPilot Rating', 'TrustPilot Reviews',
  'Has Meta Ads', 'Has Google Ads', 'Status',
].map((h) => `"${h}"`).join(',')

export default function ResultatenPage() {
  const [keywordGroups, setKeywordGroups] = useState<KeywordGroup[]>([])
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState<number | null>(null)
  const [selectedForExport, setSelectedForExport] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [loadingLeads, setLoadingLeads] = useState(false)

  const fetchKeywords = useCallback(async () => {
    const { data, error } = await supabase.from('leads').select('keyword, created_at')
    if (error || !data) {
      setKeywordGroups([])
      setLoading(false)
      return
    }

    const map = new Map<string, KeywordGroup>()
    for (const row of data) {
      const kw = row.keyword
      if (!kw) continue
      const dateStr = row.created_at || ''
      const existing = map.get(kw)
      if (existing) {
        existing.count++
        if (dateStr > existing.latestDate) existing.latestDate = dateStr
      } else {
        map.set(kw, { keyword: kw, count: 1, latestDate: dateStr })
      }
    }

    const groups = Array.from(map.values()).sort(
      (a, b) => b.latestDate.localeCompare(a.latestDate),
    )
    setKeywordGroups(groups)

    setSelectedKeyword((prev) => {
      if (prev && groups.some((g) => g.keyword === prev)) return prev
      return groups.length > 0 ? groups[0].keyword : null
    })
    setLoading(false)
  }, [])

  const fetchLeads = useCallback(async (kw: string) => {
    setLoadingLeads(true)
    setSelectedCompanyIndex(null)
    setSelectedForExport(new Set())
    const { data } = await supabase.from('leads').select('*').eq('keyword', kw)
    setLeads((data || []).map((row) => mapRow(row as Record<string, unknown>)))
    setLoadingLeads(false)
  }, [])

  useEffect(() => {
    fetchKeywords()
  }, [fetchKeywords])

  useEffect(() => {
    if (selectedKeyword) fetchLeads(selectedKeyword)
  }, [selectedKeyword, fetchLeads])

  function handleToggleSelect(originalIndex: number) {
    setSelectedForExport((prev) => {
      const next = new Set(prev)
      if (next.has(originalIndex)) {
        next.delete(originalIndex)
      } else {
        next.add(originalIndex)
      }
      return next
    })
  }

  function handleToggleSelectAll(visibleIndices: number[]) {
    setSelectedForExport((prev) => {
      const allSelected = visibleIndices.every((i) => prev.has(i))
      if (allSelected) {
        const next = new Set(prev)
        visibleIndices.forEach((i) => next.delete(i))
        return next
      } else {
        const next = new Set(prev)
        visibleIndices.forEach((i) => next.add(i))
        return next
      }
    })
  }

  function handleExportSelected() {
    if (selectedForExport.size === 0) return
    const rows = Array.from(selectedForExport)
      .sort((a, b) => a - b)
      .map((i) => leadToCsvRow(leads[i]))
    const csv = [CSV_HEADER, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${selectedKeyword || 'export'}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleDownloadAll() {
    if (leads.length === 0) return
    const rows = leads.map((l) => leadToCsvRow(l))
    const csv = [CSV_HEADER, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${selectedKeyword || 'export'}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-brand mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-text-secondary">Resultaten laden...</p>
          </div>
        </div>
      </div>
    )
  }

  if (keywordGroups.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-24">
          <svg className="w-16 h-16 text-text-muted mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <h2 className="text-2xl font-bold text-text mb-2">Geen resultaten</h2>
          <p className="text-text-secondary mb-6">
            Er zijn nog geen leads gevonden. Start een nieuwe automatisering op de homepagina.
          </p>
          <a href="/" className="btn-primary">
            Ga naar Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text">Resultaten</h1>
            <p className="text-text-secondary text-xs sm:text-sm mt-1">
              Bekijk en analyseer de gevonden leads
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDownloadAll} className="btn-secondary py-2 px-3 sm:px-6 gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              onClick={() => { fetchKeywords(); if (selectedKeyword) fetchLeads(selectedKeyword); }}
              className="p-2 rounded-lg border border-surface-border hover:bg-surface-alt transition-colors text-text-secondary"
              title="Vernieuwen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
            </button>
          </div>
        </div>

        <select
          value={selectedKeyword || ''}
          onChange={(e) => setSelectedKeyword(e.target.value)}
          className="input-field py-2 pr-8 w-full"
        >
          {keywordGroups.map((g) => (
            <option key={g.keyword} value={g.keyword}>
              {g.keyword} - {new Date(g.latestDate).toLocaleDateString('nl-NL')} ({g.count})
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loadingLeads ? (
        <div className="flex items-center justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : (
        <div className="space-y-6">
          <CompanyTable
            leads={leads}
            onSelectCompany={setSelectedCompanyIndex}
            selectedIndex={selectedCompanyIndex}
            selectedForExport={selectedForExport}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
          />
        </div>
      )}

      {/* Export toolbar */}
      {selectedForExport.size > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <div className="bg-brand text-white rounded-xl shadow-lg px-5 py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="bg-white/20 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                  {selectedForExport.size}
                </span>
                <span className="text-sm font-medium">
                  {selectedForExport.size === 1 ? 'bedrijf' : 'bedrijven'} geselecteerd
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedForExport(new Set())}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg bg-white/15 hover:bg-white/25 transition-colors"
                >
                  Deselecteer
                </button>
                <button
                  onClick={handleExportSelected}
                  className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-white text-brand hover:bg-white/90 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Exporteer CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
