'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { KbArticle, KbFaq, KbCategory } from '@/types'

// ==================== PUBLIC HOOKS ====================

export function usePublicArticles(params?: {
  content_type?: string
  category?: string
  search?: string
  tag?: string
}) {
  return useQuery({
    queryKey: ['kb', 'articles', 'public', params],
    queryFn: async (): Promise<KbArticle[]> => {
      const searchParams = new URLSearchParams()
      if (params?.content_type) searchParams.set('content_type', params.content_type)
      if (params?.category) searchParams.set('category', params.category)
      if (params?.search) searchParams.set('search', params.search)
      if (params?.tag) searchParams.set('tag', params.tag)

      const response = await fetch(`/api/knowledgebase/articles?${searchParams}`)
      if (!response.ok) throw new Error('Failed to fetch articles')
      return response.json()
    },
  })
}

export function usePublicArticle(slug: string) {
  return useQuery({
    queryKey: ['kb', 'article', 'public', slug],
    queryFn: async (): Promise<KbArticle> => {
      const response = await fetch(`/api/knowledgebase/articles/${slug}`)
      if (!response.ok) throw new Error('Failed to fetch article')
      return response.json()
    },
    enabled: !!slug,
  })
}

export function usePublicFaqs(category?: string) {
  return useQuery({
    queryKey: ['kb', 'faqs', 'public', category],
    queryFn: async (): Promise<KbFaq[]> => {
      const searchParams = new URLSearchParams()
      if (category) searchParams.set('category', category)
      const response = await fetch(`/api/knowledgebase/faqs?${searchParams}`)
      if (!response.ok) throw new Error('Failed to fetch FAQs')
      return response.json()
    },
  })
}

export function usePublicKbCategories() {
  return useQuery({
    queryKey: ['kb', 'categories', 'public'],
    queryFn: async (): Promise<KbCategory[]> => {
      const response = await fetch('/api/knowledgebase/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      return response.json()
    },
  })
}

// ==================== ADMIN HOOKS ====================

export function useAdminArticles(params?: {
  status?: string
  content_type?: string
  category_id?: string
  search?: string
}) {
  return useQuery({
    queryKey: ['admin', 'kb', 'articles', params],
    queryFn: async (): Promise<KbArticle[]> => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set('status', params.status)
      if (params?.content_type) searchParams.set('content_type', params.content_type)
      if (params?.category_id) searchParams.set('category_id', params.category_id)
      if (params?.search) searchParams.set('search', params.search)

      const response = await fetch(`/api/admin/knowledgebase/articles?${searchParams}`)
      if (!response.ok) throw new Error('Failed to fetch articles')
      return response.json()
    },
  })
}

export function useAdminArticle(id: string) {
  return useQuery({
    queryKey: ['admin', 'kb', 'article', id],
    queryFn: async (): Promise<KbArticle> => {
      const response = await fetch(`/api/admin/knowledgebase/articles/${id}`)
      if (!response.ok) throw new Error('Failed to fetch article')
      return response.json()
    },
    enabled: !!id,
  })
}

export function useCreateArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await fetch('/api/admin/knowledgebase/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create article')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'kb', 'articles'] })
      queryClient.invalidateQueries({ queryKey: ['kb', 'articles'] })
    },
  })
}

export function useUpdateArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const response = await fetch(`/api/admin/knowledgebase/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update article')
      }
      return response.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'kb', 'articles'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'kb', 'article', id] })
      queryClient.invalidateQueries({ queryKey: ['kb', 'articles'] })
      queryClient.invalidateQueries({ queryKey: ['kb', 'article'] })
    },
  })
}

export function useDeleteArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/knowledgebase/articles/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete article')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'kb', 'articles'] })
      queryClient.invalidateQueries({ queryKey: ['kb', 'articles'] })
    },
  })
}

export function useTogglePublishArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, publish }: { id: string; publish: boolean }) => {
      const response = await fetch(`/api/admin/knowledgebase/articles/${id}/publish`, {
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'kb', 'articles'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'kb', 'article', id] })
      queryClient.invalidateQueries({ queryKey: ['kb', 'articles'] })
    },
  })
}

// FAQ hooks
export function useAdminFaqs(params?: { status?: string; category_id?: string }) {
  return useQuery({
    queryKey: ['admin', 'kb', 'faqs', params],
    queryFn: async (): Promise<KbFaq[]> => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set('status', params.status)
      if (params?.category_id) searchParams.set('category_id', params.category_id)

      const response = await fetch(`/api/admin/knowledgebase/faqs?${searchParams}`)
      if (!response.ok) throw new Error('Failed to fetch FAQs')
      return response.json()
    },
  })
}

export function useAdminFaq(id: string) {
  return useQuery({
    queryKey: ['admin', 'kb', 'faq', id],
    queryFn: async (): Promise<KbFaq> => {
      const response = await fetch(`/api/admin/knowledgebase/faqs/${id}`)
      if (!response.ok) throw new Error('Failed to fetch FAQ')
      return response.json()
    },
    enabled: !!id,
  })
}

export function useCreateFaq() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await fetch('/api/admin/knowledgebase/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create FAQ')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'kb', 'faqs'] })
      queryClient.invalidateQueries({ queryKey: ['kb', 'faqs'] })
    },
  })
}

export function useUpdateFaq() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const response = await fetch(`/api/admin/knowledgebase/faqs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update FAQ')
      }
      return response.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'kb', 'faqs'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'kb', 'faq', id] })
      queryClient.invalidateQueries({ queryKey: ['kb', 'faqs'] })
    },
  })
}

export function useDeleteFaq() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/knowledgebase/faqs/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete FAQ')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'kb', 'faqs'] })
      queryClient.invalidateQueries({ queryKey: ['kb', 'faqs'] })
    },
  })
}

// Category hooks
export function useAdminKbCategories() {
  return useQuery({
    queryKey: ['admin', 'kb', 'categories'],
    queryFn: async (): Promise<KbCategory[]> => {
      const response = await fetch('/api/admin/knowledgebase/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      return response.json()
    },
  })
}

export function useCreateKbCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await fetch('/api/admin/knowledgebase/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create category')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'kb', 'categories'] })
      queryClient.invalidateQueries({ queryKey: ['kb', 'categories'] })
    },
  })
}

export function useUpdateKbCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const response = await fetch(`/api/admin/knowledgebase/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update category')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'kb', 'categories'] })
      queryClient.invalidateQueries({ queryKey: ['kb', 'categories'] })
    },
  })
}

export function useDeleteKbCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/knowledgebase/categories/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete category')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'kb', 'categories'] })
      queryClient.invalidateQueries({ queryKey: ['kb', 'categories'] })
    },
  })
}
