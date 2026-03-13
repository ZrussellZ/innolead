'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Run, Lead } from '@/lib/types'
import CompanyTable from '@/components/CompanyTable'

export default function ResultatenPage() {
  const [runs, setRuns] = useState<Run[]>([])
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingLeads, setLoadingLeads] = useState(false)

  const fetchLeads = useCallback(async (runId: string) => {
    setLoadingLeads(true)
    setSelectedCompanyIndex(null)
    try {
      const res = await fetch(`/api/results?runId=${runId}`)
      const data = await res.json()
      setLeads(data.leads || [])
    } catch {
      setLeads([])
    } finally {
      setLoadingLeads(false)
    }
  }, [])

  const fetchRuns = useCallback(async () => {
    try {
      const res = await fetch('/api/results')
      const data = await res.json()
      const fetchedRuns: Run[] = data.runs || []
      setRuns(fetchedRuns)
      if (fetchedRuns.length > 0) {
        setSelectedRunId((prev) => prev ?? fetchedRuns[0].id)
      }
    } catch {
      setRuns([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRuns()
  }, [fetchRuns])

  useEffect(() => {
    if (selectedRunId) {
      fetchLeads(selectedRunId)
    }
  }, [selectedRunId, fetchLeads])

  const selectedRun = runs.find((r) => r.id === selectedRunId)

  function handleDownload() {
    if (!selectedRunId) return
    window.open(`/api/download?runId=${selectedRunId}`, '_blank')
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

  if (runs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-24">
          <svg className="w-16 h-16 text-text-muted mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <h2 className="text-2xl font-bold text-text mb-2">Geen resultaten</h2>
          <p className="text-text-secondary mb-6">
            Er zijn nog geen automatiseringen uitgevoerd. Start een nieuwe automatisering op de homepagina.
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Resultaten</h1>
          <p className="text-text-secondary text-sm mt-1">
            Bekijk en analyseer de gevonden leads
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Run Selector */}
          <select
            value={selectedRunId || ''}
            onChange={(e) => setSelectedRunId(e.target.value)}
            className="input-field py-2 pr-8 min-w-[250px]"
          >
            {runs.map((run) => (
              <option key={run.id} value={run.id}>
                {run.keyword} - {new Date(run.date).toLocaleDateString('nl-NL')}
                {run.status === 'running' ? ' (bezig...)' : ''}
                {run.companyCount ? ` (${run.companyCount})` : ''}
              </option>
            ))}
          </select>

          {/* Download Button */}
          <button onClick={handleDownload} className="btn-secondary py-2 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            CSV
          </button>

          {/* Refresh */}
          <button
            onClick={() => { fetchRuns(); if (selectedRunId) fetchLeads(selectedRunId); }}
            className="p-2 rounded-lg border border-surface-border hover:bg-surface-alt transition-colors text-text-secondary"
            title="Vernieuwen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
            </svg>
          </button>
        </div>
      </div>

      {/* Run Status */}
      {selectedRun && selectedRun.status === 'running' && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-blue-800 text-sm font-medium">
            Deze automatisering is nog bezig. Resultaten worden automatisch bijgewerkt.
          </p>
        </div>
      )}

      {selectedRun && selectedRun.status === 'failed' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">
            Deze automatisering is mislukt. Probeer het opnieuw.
          </p>
        </div>
      )}

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
          />
        </div>
      )}
    </div>
  )
}
