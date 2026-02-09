'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Country, CountryWithDistributors } from '@/types'

// Fetch all countries (public)
export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async (): Promise<Country[]> => {
      const response = await fetch('/api/countries')
      if (!response.ok) throw new Error('Failed to fetch countries')
      return response.json()
    },
  })
}

// Fetch countries with coverage info (admin)
export function useAdminCountries(params?: { search?: string; hasCoverage?: boolean }) {
  return useQuery({
    queryKey: ['admin', 'countries', params],
    queryFn: async (): Promise<CountryWithDistributors[]> => {
      const searchParams = new URLSearchParams()
      if (params?.search) searchParams.set('search', params.search)
      if (params?.hasCoverage !== undefined) {
        searchParams.set('hasCoverage', String(params.hasCoverage))
      }

      const response = await fetch(`/api/admin/countries?${searchParams}`)
      if (!response.ok) throw new Error('Failed to fetch countries')
      return response.json()
    },
  })
}

// Update country (admin)
export function useUpdateCountry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ iso2, data }: { iso2: string; data: Partial<Country> }) => {
      const response = await fetch(`/api/admin/countries/${iso2}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update country')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'countries'] })
    },
  })
}
