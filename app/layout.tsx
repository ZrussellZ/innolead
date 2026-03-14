import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lead Generation',
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
        {children}
      </body>
    </html>
  )
}
