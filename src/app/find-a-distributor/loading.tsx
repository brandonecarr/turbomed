import { Header } from '@/components/layout/Header'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Map skeleton */}
        <section className="h-[60vh] lg:h-[70vh] min-h-[500px] bg-gray-100 animate-pulse">
          <div className="absolute top-4 left-4 w-80 h-48 bg-white rounded-xl shadow-lg" />
        </section>

        {/* List section skeleton */}
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="h-10 w-96 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse" />
              <div className="h-6 w-[500px] max-w-full bg-gray-200 rounded-lg mx-auto animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-white rounded-xl shadow-card animate-pulse"
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
