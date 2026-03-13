import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PasswordGate from '@/components/PasswordGate'

export const metadata: Metadata = {
  title: 'InnoLead - Lead Generatie Automatisering',
  description: 'Automatische lead generatie voor Innostock. Vind de beste e-commerce prospects in Europa.',
  icons: { icon: '/logo.png' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="min-h-screen flex flex-col">
        <PasswordGate>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </PasswordGate>
      </body>
    </html>
  )
}
