import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Knowledgebase | TurboMed Orthotics',
  description: 'Browse articles, FAQs, and product documentation for TurboMed Orthotics products and services.',
}

export default function KnowledgebaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">{children}</main>
      <Footer />
    </>
  )
}
