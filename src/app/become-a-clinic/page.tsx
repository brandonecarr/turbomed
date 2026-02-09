'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ClinicSignupForm } from '@/components/clinic/ClinicSignupForm'
import { Building2, MapPin, Users, CheckCircle } from 'lucide-react'

export default function BecomeAClinicPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-turbo-blue-pale to-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Register Your Clinic
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join our network of clinics offering TurboMed Orthotics products. Get listed in our
                directory and help patients find you.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-14 h-14 bg-turbo-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-turbo-navy" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Increased Visibility</h3>
                <p className="text-gray-600 text-sm">
                  Appear on our interactive map and be discovered by patients looking for TurboMed
                  products.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-turbo-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-turbo-navy" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Patient Referrals</h3>
                <p className="text-gray-600 text-sm">
                  Connect with patients actively searching for orthotic solutions in your area.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-turbo-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-turbo-navy" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Free Listing</h3>
                <p className="text-gray-600 text-sm">
                  Registration is completely free for clinics that carry TurboMed Orthotics products.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form section */}
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ClinicSignupForm />
          </div>
        </section>

        {/* FAQ section */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  How long does the approval process take?
                </h3>
                <p className="text-gray-600">
                  We review submissions within 2-3 business days. You&apos;ll receive an email
                  notification once your clinic has been approved.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I add multiple locations?
                </h3>
                <p className="text-gray-600">
                  Yes! If your clinic has multiple locations, you can add them all during
                  registration. Each location will appear separately on the map.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  How can I update my clinic information?
                </h3>
                <p className="text-gray-600">
                  After approval, you can request updates by contacting us at{' '}
                  <a href="mailto:info@turbomedusa.com" className="text-turbo-blue hover:underline">
                    info@turbomedusa.com
                  </a>
                  .
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Is there a cost to be listed?
                </h3>
                <p className="text-gray-600">
                  No, listing your clinic in our directory is completely free. We want to help
                  patients find clinics that offer TurboMed products.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
