export default function Footer() {
  return (
    <footer className="bg-text text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="InnoLead" className="h-8 brightness-0 invert" />
              <span className="text-lg font-bold">
                Inno<span className="text-brand">Lead</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Lead generatie automatisering voor Innostock.
              Vind de beste e-commerce prospects in Europa.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="https://innostock.eu" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                  Innostock.eu
                </a>
              </li>
              <li>
                <a href="https://innostock.eu/demo-inplannen/" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                  Demo plannen
                </a>
              </li>
              <li>
                <a href="https://innostock.eu/letstalk/" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>085 1073712</li>
              <li>De Factorij 19 Deur 27</li>
              <li>1689 AK Zwaag</li>
              <li>Nederland</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          Alle rechten voorbehouden. &copy; Innostock {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  )
}
