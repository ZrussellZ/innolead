import StartWorkflow from '@/components/StartWorkflow'

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
            <p className="text-text-secondary max-w-2xl mx-auto mb-12">
              Voer een Keyword in, waarvan jij leads wilt krijgen
            </p>

            <StartWorkflow />
          </div>
        </div>
      </section>
    </div>
  )
}
