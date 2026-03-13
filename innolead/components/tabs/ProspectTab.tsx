'use client'

import type { ProspectData, Contact } from '@/lib/types'

function ContactCard({ contact, index }: { contact: Contact; index: number }) {
  const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(' ')

  return (
    <div className="card flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
        <span className="text-brand font-bold text-lg">
          {(contact.firstName?.[0] || contact.lastName?.[0] || index.toString()).toUpperCase()}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-text">{fullName || `Contact ${index}`}</h3>
        {contact.position && (
          <p className="text-sm text-text-secondary">{contact.position}</p>
        )}
        {contact.linkedIn && (
          <a
            href={contact.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-sm text-blue-700 hover:text-blue-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn profiel
          </a>
        )}
      </div>
    </div>
  )
}

export default function ProspectTab({ data }: { data: ProspectData }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-lg font-semibold text-text">Contactpersonen</h3>
        <span className={`status-badge ${
          data.contacts.length > 0 ? 'status-active' : 'status-inactive'
        }`}>
          {data.status || (data.contacts.length > 0 ? `${data.contacts.length} gevonden` : 'Geen gevonden')}
        </span>
      </div>

      {data.contacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.contacts.map((contact, i) => (
            <ContactCard key={i} contact={contact} index={i + 1} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <svg className="w-12 h-12 text-text-muted mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          <p className="text-text-secondary">Geen contactpersonen gevonden via Snov.io</p>
        </div>
      )}
    </div>
  )
}
