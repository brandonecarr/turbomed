import Link from 'next/link'
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

const footerLinks = {
  products: [
    { name: 'Classic+', href: 'https://turbomedusa.com/products/classic' },
    { name: 'Frontier', href: 'https://turbomedusa.com/products/frontier' },
    { name: 'Summit', href: 'https://turbomedusa.com/products/summit' },
    { name: 'Pediatric', href: 'https://turbomedusa.com/products/pediatric' },
    { name: 'AT-X', href: 'https://turbomedusa.com/products/atx' },
    { name: 'Parts & Options', href: 'https://turbomedusa.com/products/parts' },
  ],
  resources: [
    { name: 'Documents & Photos', href: 'https://turbomedusa.com/documents' },
    { name: 'Insurance Information', href: 'https://turbomedusa.com/insurance' },
    { name: 'Find a Distributor', href: '/find-a-distributor' },
    { name: 'Become a Distributor', href: 'https://turbomedusa.com/contact' },
  ],
  company: [
    { name: 'About Us', href: 'https://turbomedusa.com/about' },
    { name: 'Blog', href: 'https://turbomedusa.com/blog' },
    { name: 'Contact', href: 'https://turbomedusa.com/contact' },
    { name: 'Privacy Policy', href: 'https://turbomedusa.com/privacy' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-turbo-navy text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-turbo-navy font-bold text-2xl">T</span>
              </div>
              <div>
                <span className="font-bold text-xl">TurboMed</span>
                <span className="text-turbo-blue-light text-sm block">Orthotics</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-sm">
              Premium orthotic solutions distributed in 30+ countries worldwide.
              Helping patients walk with confidence.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>1-800-TURBO-MED</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@turbomedusa.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>USA Headquarters</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-turbo-navy-light">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} TurboMed Orthotics. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <Link
                href="https://turbomedusa.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="https://turbomedusa.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
