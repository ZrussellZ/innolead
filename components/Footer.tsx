export default function Footer() {
  return (
    <footer className="bg-text text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="InnoLead" className="h-12 brightness-0 invert" />
          </div>
          <p className="text-gray-400 text-sm">
            Lead generatie automatisering voor Innostock.
            Vind de beste e-commerce prospects in Europa.
          </p>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          Alle rechten voorbehouden. &copy; Innostock {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  )
}
