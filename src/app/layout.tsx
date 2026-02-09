import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TurboMed Orthotics | Find a Distributor',
  description: 'Find authorized TurboMed Orthotics distributors worldwide. Serving 30+ countries with premium orthotic solutions.',
  keywords: 'TurboMed, orthotics, distributors, AFO, foot drop, medical devices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
