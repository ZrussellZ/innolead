import { Suspense } from 'react'
import StartWorkflow from '@/components/StartWorkflow'
import LeadStats from '@/components/LeadStats'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-brand-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="InnoLead" className="h-24 md:h-28" />
            </div>
            <p className="text-xl md:text-2xl text-text-secondary mb-2">
              Lead Generation
            </p>
            <p className="text-text-secondary max-w-2xl mx-auto mb-2">
              Voer een Keyword in, waarvan jij leads wilt krijgen
            </p>
            <p className="text-sm text-text-muted max-w-2xl mx-auto mb-12">
              Als je meerdere keywords wilt, gebruik dan een comma ertussen. Voorbeeld: CBD olie, Haarspray, Oplader. LET OP: je kan maximaal 3 keywords gebruiken!
            </p>

            <StartWorkflow />
          </div>
        </div>
      </section>

      <Suspense fallback={<StatsLoading />}>
        <LeadStats />
      </Suspense>
    </div>
  )
}

function StatsLoading() {
  return (
    <section className="py-16 bg-surface-alt/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-text text-center mb-10">
          Lead Statistieken
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-lg bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-7 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
