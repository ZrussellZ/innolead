import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthGuard from '@/components/AuthGuard'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </AuthGuard>
  )
}
