'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Distributor, DistributorWithCoverage } from '@/types'

// Fetch all published distributors (public)
export function usePublicDistributors() {
  return useQuery({
    queryKey: ['distributors', 'public'],
    queryFn: async (): Promise<DistributorWithCoverage[]> => {
      const response = await fetch('/api/distributors')
      if (!response.ok) throw new Error('Failed to fetch distributors')
      return response.json()
    },
  })
}

// Fetch distributors by country (public)
export function useDistributorsByCountry(countryIso2: string | null) {
  return useQuery({
    queryKey: ['distributors', 'by-country', countryIso2],
    queryFn: async (): Promise<DistributorWithCoverage[]> => {
      if (!countryIso2) return []
      const response = await fetch(`/api/distributors/by-country/${countryIso2}`)
      if (!response.ok) throw new Error('Failed to fetch distributors')
      return response.json()
    },
    enabled: !!countryIso2,
  })
}

// Admin: Fetch all distributors
export function useAdminDistributors(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'distributors', params],
    queryFn: async (): Promise<DistributorWithCoverage[]> => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set('status', params.status)
      if (params?.search) searchParams.set('search', params.search)

      const response = await fetch(`/api/admin/distributors?${searchParams}`)
      if (!response.ok) throw new Error('Failed to fetch distributors')
      return response.json()
    },
  })
}

// Admin: Fetch single distributor
export function useAdminDistributor(id: string) {
  return useQuery({
    queryKey: ['admin', 'distributor', id],
    queryFn: async (): Promise<DistributorWithCoverage> => {
      const response = await fetch(`/api/admin/distributors/${id}`)
      if (!response.ok) throw new Error('Failed to fetch distributor')
      return response.json()
    },
    enabled: !!id,
  })
}

// Admin: Create distributor
export function useCreateDistributor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Distributor> & { country_coverage?: string[] }) => {
      const response = await fetch('/api/admin/distributors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create distributor')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'distributors'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

// Admin: Update distributor
export function useUpdateDistributor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Distributor> & { country_coverage?: string[] } }) => {
      const response = await fetch(`/api/admin/distributors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update distributor')
      }
      return response.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'distributors'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'distributor', id] })
      queryClient.invalidateQueries({ queryKey: ['distributors'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

// Admin: Delete distributor
export function useDeleteDistributor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/distributors/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete distributor')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'distributors'] })
      queryClient.invalidateQueries({ queryKey: ['distributors'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

// Admin: Toggle publish status
export function useTogglePublishDistributor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, publish }: { id: string; publish: boolean }) => {
      const response = await fetch(`/api/admin/distributors/${id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update status')
      }
      return response.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'distributors'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'distributor', id] })
      queryClient.invalidateQueries({ queryKey: ['distributors'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}
