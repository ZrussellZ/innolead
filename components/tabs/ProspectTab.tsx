'use client'

import { useState } from 'react'
import type { ProspectData, Contact } from '@/lib/types'
import { supabase } from '@/lib/supabase'

type EmailState = 'idle' | 'loading' | 'found' | 'not_found'

function ContactCard({
  contact,
  index,
  companyName,
  companyUrl,
  leadId,
}: {
  contact: Contact
  index: number
  companyName: string
  companyUrl: string
  leadId: string
}) {
  const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(' ')

  const [emailState, setEmailState] = useState<EmailState>(
    contact.email ? 'found' : 'idle',
  )
  const [email, setEmail] = useState(contact.email || '')

  async function handleGetEmail() {
    setEmailState('loading')
    try {
      const res = await fetch('/api/get-prospect-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          company_url: companyUrl,
          contact_first_name: contact.firstName,
          contact_last_name: contact.lastName,
        }),
      })

      const data = await res.json()

      if (res.ok && data.email) {
        setEmail(data.email)
        setEmailState('found')

        if (leadId) {
          const colName = `contact_${contact.contactIndex}_email`
          await supabase
            .from('leads')
            .update({ [colName]: data.email })
            .eq('id', leadId)
        }
      } else {
        setEmailState('not_found')
      }
    } catch {
      setEmailState('not_found')
    }
  }

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

        <div className="flex flex-col gap-1.5 mt-2">
          {contact.linkedIn && (
            <a
              href={contact.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-700 hover:text-blue-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn profiel
            </a>
          )}

          {emailState === 'found' && email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1.5 text-sm text-green-700 hover:text-green-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              {email}
            </a>
          )}

          {emailState === 'not_found' && (
            <span className="inline-flex items-center gap-1.5 text-sm text-text-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              Niet gevonden
            </span>
          )}

          {emailState === 'idle' && (
            <button
              onClick={handleGetEmail}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover transition-colors mt-0.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              Get Email
            </button>
          )}

          {emailState === 'loading' && (
            <span className="inline-flex items-center gap-1.5 text-sm text-text-muted">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Zoeken...
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProspectTab({
  data,
  companyName,
  companyUrl,
  leadId,
}: {
  data: ProspectData
  companyName: string
  companyUrl: string
  leadId: string
}) {
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
            <ContactCard
              key={i}
              contact={contact}
              index={i + 1}
              companyName={companyName}
              companyUrl={companyUrl}
              leadId={leadId}
            />
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
