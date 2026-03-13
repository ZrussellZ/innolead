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

const tabs: { id: TabId; label: string }[] = [
  { id: 'overzicht', label: 'Overzicht' },
  { id: 'product', label: 'Product Informatie' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'advertenties', label: 'Advertenties' },
  { id: 'prospect', label: 'Prospect' },
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
        return <ProspectTab data={extractProspects(lead)} />
    }
  }

  return (
    <div className="bg-white border border-surface-border rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-surface-alt border-b border-surface-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {(lead['Company name']?.[0] || '?').toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-text">{lead['Company name']}</h2>
            <a
              href={lead['Website URL']}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand hover:text-brand-hover transition-colors"
            >
              {lead['Website URL']}
            </a>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-secondary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-border px-6">
        <div className="flex gap-1 overflow-x-auto py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button whitespace-nowrap ${
                activeTab === tab.id ? 'tab-button-active' : 'tab-button-inactive'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {renderTab()}
      </div>
    </div>
  )
}
