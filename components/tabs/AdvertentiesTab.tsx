'use client'

import type { AdsData } from '@/lib/types'

function ActiveBadge({ value }: { value: string }) {
  const isActive = value?.toUpperCase() === 'TRUE' || value?.toLowerCase() === 'yes'
  return (
    <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
      {isActive ? 'Actief' : 'Niet actief'}
    </span>
  )
}

function DataRow({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-surface-border last:border-0">
      <span className="text-sm text-text-secondary">{label}</span>
      {isLink && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-brand hover:text-brand-hover transition-colors text-right max-w-[60%] truncate"
        >
          Link openen
        </a>
      ) : (
        <span className="text-sm text-text font-medium text-right max-w-[60%]">
          {value || '-'}
        </span>
      )}
    </div>
  )
}

export default function AdvertentiesTab({ data }: { data: AdsData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Meta Ads */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#0081FB" d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078v-3.47h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12z" />
            </svg>
            <h3 className="text-lg font-semibold text-text">Meta Ads</h3>
          </div>
          <ActiveBadge value={data.meta.hasAds} />
        </div>

        <div className="divide-y divide-surface-border">
          <DataRow label="Actieve advertenties" value={data.meta.activeCount} />
          <DataRow label="Platformen" value={data.meta.platforms} />
          <DataRow label="Laatste advertentie" value={data.meta.lastAdRun} />
          <DataRow label="Afgelopen 30 dagen actief" value={data.meta.last30Days} />
          <DataRow label="Likes" value={data.meta.likesCount} />
          <DataRow label="Advertentiebibliotheek" value={data.meta.libraryUrl} isLink />
          <DataRow label="Page ID" value={data.meta.pageId} />
        </div>
      </div>

      {/* Google Ads */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#FBBC04" d="M3.3 15.4l4.3-7.5c.5-.8 1.5-1.1 2.3-.6l7.5 4.3c.8.5 1.1 1.5.6 2.3l-4.3 7.5c-.5.8-1.5 1.1-2.3.6l-7.5-4.3c-.8-.5-1.1-1.5-.6-2.3z" />
              <path fill="#4285F4" d="M20.7 8.6l-4.3 7.5c-.5.8-1.5 1.1-2.3.6l-7.5-4.3c-.8-.5-1.1-1.5-.6-2.3l4.3-7.5c.5-.8 1.5-1.1 2.3-.6l7.5 4.3c.8.5 1.1 1.5.6 2.3z" />
              <circle fill="#34A853" cx="5.5" cy="18.5" r="3.5" />
            </svg>
            <h3 className="text-lg font-semibold text-text">Google Ads</h3>
          </div>
          <ActiveBadge value={data.google.hasAds} />
        </div>

        <div className="divide-y divide-surface-border">
          <DataRow label="Page ID" value={data.google.pageId} />
          <DataRow label="Laatste advertentie" value={data.google.latestAd} />
          <DataRow label="Afgelopen 30 dagen actief" value={data.google.last30Days} />
        </div>
      </div>
    </div>
  )
}
