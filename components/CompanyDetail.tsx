'use client'

import { useState } from 'react'
import type { Lead } from '@/lib/types'
import { extractOverzicht, extractProducts, extractReviews, extractAds, extractProspects } from '@/lib/types'
import OverzichtTab from './tabs/OverzichtTab'
import ProductTab from './tabs/ProductTab'
import ReviewsTab from './tabs/ReviewsTab'
import AdvertentiesTab from './tabs/AdvertentiesTab'
import ProspectTab from './tabs/ProspectTab'

type TabId = 'overzicht' | 'product' | 'reviews' | 'advertenties' | 'prospect'

const tabs: { id: TabId; label: string; shortLabel: string }[] = [
  { id: 'overzicht', label: 'Overzicht', shortLabel: 'Overzicht' },
  { id: 'product', label: 'Product Informatie', shortLabel: 'Product' },
  { id: 'reviews', label: 'Reviews', shortLabel: 'Reviews' },
  { id: 'advertenties', label: 'Advertenties', shortLabel: 'Ads' },
  { id: 'prospect', label: 'Prospect', shortLabel: 'Prospect' },
]

export default function CompanyDetail({
  lead,
  onClose,
}: {
  lead: Lead
  onClose: () => void
}) {
  const [activeTab, setActiveTab] = useState<TabId>('overzicht')

  const renderTab = () => {
    switch (activeTab) {
      case 'overzicht':
        return <OverzichtTab data={extractOverzicht(lead)} />
      case 'product':
        return <ProductTab data={extractProducts(lead)} />
      case 'reviews':
        return <ReviewsTab data={extractReviews(lead)} />
      case 'advertenties':
        return <AdvertentiesTab data={extractAds(lead)} />
      case 'prospect':
        return (
          <ProspectTab
            data={extractProspects(lead)}
            companyName={lead['Company name']}
            companyUrl={lead['Website URL']}
            leadId={lead['id']}
          />
        )
    }
  }

  return (
    <div className="bg-white border border-surface-border rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-surface-alt border-b border-surface-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-base sm:text-lg">
              {(lead['Company name']?.[0] || '?').toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-text truncate">{lead['Company name']}</h2>
            <a
              href={lead['Website URL']}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-brand hover:text-brand-hover transition-colors truncate block"
            >
              {lead['Website URL']}
            </a>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-secondary flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-border px-3 sm:px-6">
        <div className="flex gap-0.5 sm:gap-1 overflow-x-auto py-2 -mx-1 px-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-brand text-white'
                  : 'text-text-secondary hover:bg-surface-alt hover:text-text'
              }`}
            >
              <span className="sm:hidden">{tab.shortLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {renderTab()}
      </div>
    </div>
  )
}
