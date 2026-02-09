'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ExternalLink } from 'lucide-react'

const navLinks = [
  { name: 'Home', href: 'https://turbomedusa.com', external: true },
  { name: 'Find a Distributor', href: '/find-a-distributor' },
  { name: 'Find a Clinic', href: '/find-a-clinic' },
  { name: 'Knowledgebase', href: '/knowledgebase' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href.startsWith('http')) return false
    return pathname === href || pathname.startsWith(href)
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="https://turbomedusa.com" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-turbo-navy rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-turbo-navy font-bold text-xl">TurboMed</span>
                <span className="text-turbo-gray text-sm block -mt-1">Orthotics</span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
                  ${isActive(link.href)
                    ? 'text-turbo-navy bg-turbo-blue-pale'
                    : 'text-gray-700 hover:text-turbo-navy hover:bg-gray-50'
                  }`}
              >
                {link.name}
                {link.external && <ExternalLink className="inline-block w-3 h-3 ml-1 opacity-50" />}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive(link.href)
                      ? 'text-turbo-navy bg-turbo-blue-pale'
                      : 'text-gray-700 hover:text-turbo-navy hover:bg-gray-50'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                  {link.external && <ExternalLink className="inline-block w-3 h-3 ml-1 opacity-50" />}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
