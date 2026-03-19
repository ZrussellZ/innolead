'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Lead } from '@/lib/types'
import CompanyTable from '@/components/CompanyTable'

interface KeywordGroup {
  keyword: string
  count: number
  latestDate: string
}

const ALL_KEYWORD = '__all__'

const SUPABASE_TO_LEAD: Record<string, string> = {
  tag: 'Tag',
  score_percentage: 'Score %',
  score_points: 'Gehaald punten',
  score_available: 'Mogelijke Punten',
  score_reason: 'Uitleg score',
  company_name: 'Company name',
  website_url: 'Website URL',
  date: 'Date',
  created_at: '_created_at',
  product_description: 'Wat voor producten ze verkopen',
  sku_count: "Aantal SKU's",
  smallest_product_name: 'Kleinste product naam',
  smallest_product_url: 'Kleinste product URL',
  smallest_product_dimensions: 'Kleinste product afmetingen ',
  smallest_product_weight: 'Kleinste product gewicht',
  biggest_product_name: 'Grootste product naam',
  biggest_product_url: 'Grootste product URL',
  biggest_product_dimensions: 'Grootste product afemtingen',
  biggest_product_weight: 'Grootste product gewicht',
  lightest_product_name: 'Lichtste product naam',
  lightest_product_url: 'Lichtste product URL',
  lightest_product_dimensions: 'Lichtste product afemtingen',
  lightest_product_weight: 'Lichtste product gewicht',
  heaviest_product_name: 'Zwaarste product naam',
  heaviest_product_url: 'Zwaarste product URL',
  heaviest_product_dimensions: 'Zwaarste product afmetingen',
  heaviest_product_weight: 'Zwaarste product gewicht',
  return_address: 'Retour adress',
  cutoff_time: 'Cutoff tijd',
  cutoff_note: 'Cutoff Note',
  shipping_countries: 'Waar ze hun producten naartoe sturen',
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'Youtube',
  tiktok: 'Tiktok',
  x_twitter: 'X',
  linkedin: 'Linked In',
  status_product_info: 'Status Product/Bedrijfs Informatie',
  google_rating: 'Google Rating',
  google_total_reviews: 'Google Total Reviews',
  google_review_1: 'Recent Review 1',
  google_review_2: 'Recent Review 2',
  google_review_3: 'Recent Review 3',
  google_business_address: 'Google Business Adress',
  google_place_id: 'Google Place ID',
  status_google_reviews: 'Status Google Reviews',
  trustpilot_rating: 'TrustPilot Rating',
  trustpilot_total_reviews: 'TrustPilot Total Reviews',
  trustpilot_review_1: 'TrustPilot Recent Review 1',
  trustpilot_review_2: 'TrustPilot Recent Review 2',
  trustpilot_review_3: 'TrustPilot Recent Review 3',
  trustpilot_url: 'TrustPilot URL',
  status_trustpilot: 'Status TrustPilot',
  has_meta_ads: 'Has Meta Ads',
  meta_active_ads_count: 'Meta active ads count',
  meta_platforms: 'Meta Platforms',
  meta_last_ad_run: 'Meta Last ad run',
  meta_ads_last_30_days: 'Meta Ads runned last 30 days?',
  meta_likes_count: 'Meta Likes count',
  meta_library_url: 'Meta Libary URL',
  meta_page_id: 'Meta Page ID',
  google_has_ads: 'Google has ads',
  google_page_id: 'Google Page ID',
  google_latest_ad: 'Google Latest ad',
  google_ads_last_30_days: 'Ads runned last 30 days?',
  status: 'Status',
  contact_1_first_name: 'Contact 1 First Name',
  contact_1_last_name: 'Contact 1 Last Name',
  contact_1_position: 'Contact 1 Position',
  contact_1_linkedin: 'Contact 1 Linked-In',
  contact_1_email_url: 'Contact 1 Email URL',
  contact_1_email: 'Contact 1 Email',
  contact_2_first_name: 'Contact 2 First Name',
  contact_2_last_name: 'Contact 2 Last Name',
  contact_2_position: 'Contact 2 Position',
  contact_2_linkedin: 'Contact 2 Linked-In',
  contact_2_email_url: 'Contact 2 Email URL',
  contact_2_email: 'Contact 2 Email',
  contact_3_first_name: 'Contact 3 First Name',
  contact_3_last_name: 'Contact 3 Last Name',
  contact_3_position: 'Contact 3 Position',
  contact_3_linkedin: 'Contact 3 Linked-In',
  contact_3_email_url: 'Contact 3 Email URL',
  contact_3_email: 'Contact 3 Email',
  contact_4_first_name: 'Contact 4 First Name',
  contact_4_last_name: 'Contact 4 Last Name',
  contact_4_position: 'Contact 4 Position',
  contact_4_linkedin: 'Contact 4 Linked-In',
  contact_4_email_url: 'Contact 4 Email URL',
  contact_4_email: 'Contact 4 Email',
  contact_5_first_name: 'Contact 5 First Name',
  contact_5_last_name: 'Contact 5 Last Name',
  contact_5_position: 'Contact 5 Position',
  contact_5_linkedin: 'Contact 5 Linked-In',
  contact_5_email_url: 'Contact 5 Email URL',
  contact_5_email: 'Contact 5 Email',
}

function mapRow(row: Record<string, unknown>): Lead {
  const lead = {} as Lead
  for (const [key, value] of Object.entries(row)) {
    const mappedKey = SUPABASE_TO_LEAD[key] || key
    lead[mappedKey] = value == null ? '' : String(value)
  }
  if (!lead['Date'] && lead['_created_at']) {
    lead['Date'] = lead['_created_at']
  }
  return lead
}

const ALL_EXPORT_FIELDS: { header: string; leadKey: string }[] = [
  { header: 'Company name', leadKey: 'Company name' },
  { header: 'Website URL', leadKey: 'Website URL' },
  { header: 'Keyword', leadKey: 'keyword' },
  { header: 'Score %', leadKey: 'Score %' },
  { header: 'Gehaald punten', leadKey: 'Gehaald punten' },
  { header: 'Mogelijke Punten', leadKey: 'Mogelijke Punten' },
  { header: 'Uitleg score', leadKey: 'Uitleg score' },
  { header: 'Date', leadKey: 'Date' },
  { header: 'Tag', leadKey: 'Tag' },
  { header: 'Wat voor producten ze verkopen', leadKey: 'Wat voor producten ze verkopen' },
  { header: "Aantal SKU's", leadKey: "Aantal SKU's" },
  { header: 'Kleinste product naam', leadKey: 'Kleinste product naam' },
  { header: 'Kleinste product URL', leadKey: 'Kleinste product URL' },
  { header: 'Kleinste product afmetingen', leadKey: 'Kleinste product afmetingen ' },
  { header: 'Kleinste product gewicht', leadKey: 'Kleinste product gewicht' },
  { header: 'Grootste product naam', leadKey: 'Grootste product naam' },
  { header: 'Grootste product URL', leadKey: 'Grootste product URL' },
  { header: 'Grootste product afmetingen', leadKey: 'Grootste product afemtingen' },
  { header: 'Grootste product gewicht', leadKey: 'Grootste product gewicht' },
  { header: 'Lichtste product naam', leadKey: 'Lichtste product naam' },
  { header: 'Lichtste product URL', leadKey: 'Lichtste product URL' },
  { header: 'Lichtste product afmetingen', leadKey: 'Lichtste product afemtingen' },
  { header: 'Lichtste product gewicht', leadKey: 'Lichtste product gewicht' },
  { header: 'Zwaarste product naam', leadKey: 'Zwaarste product naam' },
  { header: 'Zwaarste product URL', leadKey: 'Zwaarste product URL' },
  { header: 'Zwaarste product afmetingen', leadKey: 'Zwaarste product afmetingen' },
  { header: 'Zwaarste product gewicht', leadKey: 'Zwaarste product gewicht' },
  { header: 'Retour adress', leadKey: 'Retour adress' },
  { header: 'Cutoff tijd', leadKey: 'Cutoff tijd' },
  { header: 'Cutoff Note', leadKey: 'Cutoff Note' },
  { header: 'Verzendlanden', leadKey: 'Waar ze hun producten naartoe sturen' },
  { header: 'Instagram', leadKey: 'Instagram' },
  { header: 'Facebook', leadKey: 'Facebook' },
  { header: 'Youtube', leadKey: 'Youtube' },
  { header: 'Tiktok', leadKey: 'Tiktok' },
  { header: 'X', leadKey: 'X' },
  { header: 'LinkedIn', leadKey: 'Linked In' },
  { header: 'Status Product Info', leadKey: 'Status Product/Bedrijfs Informatie' },
  { header: 'Google Rating', leadKey: 'Google Rating' },
  { header: 'Google Total Reviews', leadKey: 'Google Total Reviews' },
  { header: 'Recent Review 1', leadKey: 'Recent Review 1' },
  { header: 'Recent Review 2', leadKey: 'Recent Review 2' },
  { header: 'Recent Review 3', leadKey: 'Recent Review 3' },
  { header: 'Google Business Adress', leadKey: 'Google Business Adress' },
  { header: 'Google Place ID', leadKey: 'Google Place ID' },
  { header: 'Status Google Reviews', leadKey: 'Status Google Reviews' },
  { header: 'TrustPilot Rating', leadKey: 'TrustPilot Rating' },
  { header: 'TrustPilot Total Reviews', leadKey: 'TrustPilot Total Reviews' },
  { header: 'TrustPilot Recent Review 1', leadKey: 'TrustPilot Recent Review 1' },
  { header: 'TrustPilot Recent Review 2', leadKey: 'TrustPilot Recent Review 2' },
  { header: 'TrustPilot Recent Review 3', leadKey: 'TrustPilot Recent Review 3' },
  { header: 'TrustPilot URL', leadKey: 'TrustPilot URL' },
  { header: 'Status TrustPilot', leadKey: 'Status TrustPilot' },
  { header: 'Has Meta Ads', leadKey: 'Has Meta Ads' },
  { header: 'Meta active ads count', leadKey: 'Meta active ads count' },
  { header: 'Meta Platforms', leadKey: 'Meta Platforms' },
  { header: 'Meta Last ad run', leadKey: 'Meta Last ad run' },
  { header: 'Meta Ads last 30 days', leadKey: 'Meta Ads runned last 30 days?' },
  { header: 'Meta Likes count', leadKey: 'Meta Likes count' },
  { header: 'Meta Library URL', leadKey: 'Meta Libary URL' },
  { header: 'Meta Page ID', leadKey: 'Meta Page ID' },
  { header: 'Google has ads', leadKey: 'Google has ads' },
  { header: 'Google Page ID', leadKey: 'Google Page ID' },
  { header: 'Google Latest ad', leadKey: 'Google Latest ad' },
  { header: 'Google Ads last 30 days', leadKey: 'Ads runned last 30 days?' },
  { header: 'Status', leadKey: 'Status' },
  { header: 'Contact 1 First Name', leadKey: 'Contact 1 First Name' },
  { header: 'Contact 1 Last Name', leadKey: 'Contact 1 Last Name' },
  { header: 'Contact 1 Position', leadKey: 'Contact 1 Position' },
  { header: 'Contact 1 LinkedIn', leadKey: 'Contact 1 Linked-In' },
  { header: 'Contact 1 Email URL', leadKey: 'Contact 1 Email URL' },
  { header: 'Contact 1 Email', leadKey: 'Contact 1 Email' },
  { header: 'Contact 2 First Name', leadKey: 'Contact 2 First Name' },
  { header: 'Contact 2 Last Name', leadKey: 'Contact 2 Last Name' },
  { header: 'Contact 2 Position', leadKey: 'Contact 2 Position' },
  { header: 'Contact 2 LinkedIn', leadKey: 'Contact 2 Linked-In' },
  { header: 'Contact 2 Email URL', leadKey: 'Contact 2 Email URL' },
  { header: 'Contact 2 Email', leadKey: 'Contact 2 Email' },
  { header: 'Contact 3 First Name', leadKey: 'Contact 3 First Name' },
  { header: 'Contact 3 Last Name', leadKey: 'Contact 3 Last Name' },
  { header: 'Contact 3 Position', leadKey: 'Contact 3 Position' },
  { header: 'Contact 3 LinkedIn', leadKey: 'Contact 3 Linked-In' },
  { header: 'Contact 3 Email URL', leadKey: 'Contact 3 Email URL' },
  { header: 'Contact 3 Email', leadKey: 'Contact 3 Email' },
  { header: 'Contact 4 First Name', leadKey: 'Contact 4 First Name' },
  { header: 'Contact 4 Last Name', leadKey: 'Contact 4 Last Name' },
  { header: 'Contact 4 Position', leadKey: 'Contact 4 Position' },
  { header: 'Contact 4 LinkedIn', leadKey: 'Contact 4 Linked-In' },
  { header: 'Contact 4 Email URL', leadKey: 'Contact 4 Email URL' },
  { header: 'Contact 4 Email', leadKey: 'Contact 4 Email' },
  { header: 'Contact 5 First Name', leadKey: 'Contact 5 First Name' },
  { header: 'Contact 5 Last Name', leadKey: 'Contact 5 Last Name' },
  { header: 'Contact 5 Position', leadKey: 'Contact 5 Position' },
  { header: 'Contact 5 LinkedIn', leadKey: 'Contact 5 Linked-In' },
  { header: 'Contact 5 Email URL', leadKey: 'Contact 5 Email URL' },
  { header: 'Contact 5 Email', leadKey: 'Contact 5 Email' },
]

const CSV_HEADER = ALL_EXPORT_FIELDS.map((f) => `"${f.header}"`).join(',')

function leadToCsvRow(lead: Lead): string {
  return ALL_EXPORT_FIELDS.map((f) => `"${(lead[f.leadKey] || '').replace(/"/g, '""')}"`).join(',')
}

export default function ResultatenPage() {
  const [keywordGroups, setKeywordGroups] = useState<KeywordGroup[]>([])
  const [totalLeadCount, setTotalLeadCount] = useState(0)
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState<number | null>(null)
  const [selectedForExport, setSelectedForExport] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [loadingLeads, setLoadingLeads] = useState(false)
  const selectedKeywordRef = useRef(selectedKeyword)

  const fetchKeywords = useCallback(async () => {
    const { data, error } = await supabase.from('leads').select('keyword, created_at')
    if (error || !data) {
      setKeywordGroups([])
      setTotalLeadCount(0)
      setLoading(false)
      return
    }

    setTotalLeadCount(data.length)

    const map = new Map<string, KeywordGroup>()
    for (const row of data) {
      const kw = row.keyword || 'Geen keyword'
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
      if (prev && (prev === ALL_KEYWORD || groups.some((g) => g.keyword === prev))) return prev
      return groups.length > 0 ? groups[0].keyword : null
    })
    setLoading(false)
  }, [])

  const fetchLeads = useCallback(async (kw: string) => {
    setLoadingLeads(true)
    setSelectedCompanyIndex(null)
    setSelectedForExport(new Set())

    let query = supabase.from('leads').select('*')
    if (kw === ALL_KEYWORD) {
      // fetch all
    } else if (kw === 'Geen keyword') {
      query = query.is('keyword', null)
    } else {
      query = query.eq('keyword', kw)
    }

    const { data } = await query
    setLeads((data || []).map((row) => mapRow(row as Record<string, unknown>)))
    setLoadingLeads(false)
  }, [])

  useEffect(() => {
    selectedKeywordRef.current = selectedKeyword
  }, [selectedKeyword])

  useEffect(() => {
    fetchKeywords()

    const channel = supabase
      .channel('leads-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetchKeywords()
        const kw = selectedKeywordRef.current
        if (kw) fetchLeads(kw)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchKeywords, fetchLeads])

  useEffect(() => {
    if (selectedKeyword) fetchLeads(selectedKeyword)
  }, [selectedKeyword, fetchLeads])

  function handleToggleSelect(originalIndex: number) {
    setSelectedForExport((prev) => {
      const next = new Set(prev)
      if (next.has(originalIndex)) next.delete(originalIndex)
      else next.add(originalIndex)
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

  async function handleTagChange(index: number, tag: string) {
    const lead = leads[index]
    if (!lead) return

    const updated = [...leads]
    updated[index] = { ...lead, Tag: tag }
    setLeads(updated)

    const id = lead['id']
    if (id) {
      await supabase.from('leads').update({ tag: tag || null }).eq('id', id)
    }
  }

  async function handleBulkTag(tag: string) {
    if (selectedForExport.size === 0) return
    const indices = Array.from(selectedForExport)
    const updated = [...leads]
    const ids: string[] = []

    for (const i of indices) {
      if (!updated[i]) continue
      updated[i] = { ...updated[i], Tag: tag }
      const id = updated[i]['id']
      if (id) ids.push(id)
    }
    setLeads(updated)

    if (ids.length > 0) {
      await supabase.from('leads').update({ tag: tag || null }).in('id', ids)
    }
  }

  function downloadCsv(rows: Lead[], filename: string) {
    const csvRows = rows.map((l) => leadToCsvRow(l))
    const csv = '\uFEFF' + [CSV_HEADER, ...csvRows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleExportSelected() {
    if (selectedForExport.size === 0) return
    const rows = Array.from(selectedForExport)
      .sort((a, b) => a - b)
      .map((i) => leads[i])
    const label = selectedKeyword === ALL_KEYWORD ? 'alle' : selectedKeyword || 'export'
    downloadCsv(rows, `leads-${label}-${new Date().toISOString().slice(0, 10)}.csv`)
  }

  function handleDownloadAll() {
    if (leads.length === 0) return
    const label = selectedKeyword === ALL_KEYWORD ? 'alle' : selectedKeyword || 'export'
    downloadCsv(leads, `leads-${label}-${new Date().toISOString().slice(0, 10)}.csv`)
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
          <option value={ALL_KEYWORD}>
            Alle resultaten ({totalLeadCount})
          </option>
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
            onTagChange={handleTagChange}
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
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-white/70 mr-1">Tag:</span>
                  {['Cas', 'Cuno', 'Philip'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleBulkTag(tag)}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/15 hover:bg-white/25 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                  <button
                    onClick={() => handleBulkTag('')}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
                  >
                    Verwijder
                  </button>
                </div>
                <div className="w-px h-5 bg-white/25 hidden sm:block" />
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
