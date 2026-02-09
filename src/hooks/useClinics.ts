'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Clinic, ClinicWithLocations, ClinicSignupData } from '@/types'

// ==================== PUBLIC HOOKS ====================

// Fetch all approved clinics (public)
export function usePublicClinics() {
  return useQuery({
    queryKey: ['clinics', 'public'],
    queryFn: async (): Promise<ClinicWithLocations[]> => {
      const response = await fetch('/api/clinics')
      if (!response.ok) throw new Error('Failed to fetch clinics')
      return response.json()
    },
  })
}

// Fetch single approved clinic (public)
export function usePublicClinic(id: string | null) {
  return useQuery({
    queryKey: ['clinics', 'public', id],
    queryFn: async (): Promise<ClinicWithLocations> => {
      if (!id) throw new Error('No clinic ID provided')
      const response = await fetch(`/api/clinics/${id}`)
      if (!response.ok) throw new Error('Failed to fetch clinic')
      return response.json()
    },
    enabled: !!id,
  })
}

// Submit new clinic (public signup)
export function useSubmitClinic() {
  return useMutation({
    mutationFn: async (data: ClinicSignupData) => {
      const response = await fetch('/api/clinics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit clinic')
      }
      return response.json()
    },
  })
}

// ==================== ADMIN HOOKS ====================

// Admin: Fetch all clinics
export function useAdminClinics(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'clinics', params],
    queryFn: async (): Promise<ClinicWithLocations[]> => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set('status', params.status)
      if (params?.search) searchParams.set('search', params.search)

      const response = await fetch(`/api/admin/clinics?${searchParams}`)
      if (!response.ok) throw new Error('Failed to fetch clinics')
      return response.json()
    },
  })
}

// Admin: Fetch single clinic
export function useAdminClinic(id: string) {
  return useQuery({
    queryKey: ['admin', 'clinic', id],
    queryFn: async (): Promise<ClinicWithLocations> => {
      const response = await fetch(`/api/admin/clinics/${id}`)
      if (!response.ok) throw new Error('Failed to fetch clinic')
      return response.json()
    },
    enabled: !!id,
  })
}

// Admin: Create clinic
export function useCreateClinic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Clinic> & { locations?: any[] }) => {
      const response = await fetch('/api/admin/clinics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create clinic')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clinics'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

// Admin: Update clinic
export function useUpdateClinic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Clinic> & { locations?: any[] } }) => {
      const response = await fetch(`/api/admin/clinics/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update clinic')
      }
      return response.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clinics'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'clinic', id] })
      queryClient.invalidateQueries({ queryKey: ['clinics'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

// Admin: Delete clinic
export function useDeleteClinic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/clinics/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete clinic')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clinics'] })
      queryClient.invalidateQueries({ queryKey: ['clinics'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

// Admin: Review clinic (approve/reject)
export function useReviewClinic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, action, rejection_reason }: { id: string; action: 'approve' | 'reject'; rejection_reason?: string }) => {
      const response = await fetch(`/api/admin/clinics/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, rejection_reason }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to review clinic')
      }
      return response.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clinics'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'clinic', id] })
      queryClient.invalidateQueries({ queryKey: ['clinics'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

// Admin: Get pending clinic count (for sidebar badge)
export function usePendingClinicsCount() {
  return useQuery({
    queryKey: ['admin', 'clinics', 'pending-count'],
    queryFn: async (): Promise<number> => {
      const response = await fetch('/api/admin/clinics?status=pending')
      if (!response.ok) throw new Error('Failed to fetch pending count')
      const clinics = await response.json()
      return clinics.length
    },
  })
}
