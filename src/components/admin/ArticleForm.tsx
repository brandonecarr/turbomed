'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { kbArticleSchema, type KbArticleInput } from '@/lib/validators'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { useAdminKbCategories } from '@/hooks/useKnowledgebase'
import type { KbArticle } from '@/types'

interface ArticleFormProps {
  article?: KbArticle
  onSubmit: (data: KbArticleInput) => void
  isLoading?: boolean
}

export function ArticleForm({ article, onSubmit, isLoading }: ArticleFormProps) {
  const { data: categories } = useAdminKbCategories()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(kbArticleSchema) as any,
    defaultValues: {
      title: article?.title || '',
      content_type: article?.content_type || 'article',
      category_id: article?.category_id || '',
      content: article?.content || '',
      excerpt: article?.excerpt || '',
      featured_image_url: article?.featured_image_url || '',
      status: article?.status || 'draft',
      tags: article?.tags || [],
      meta_title: article?.meta_title || '',
      meta_description: article?.meta_description || '',
      sort_order: article?.sort_order || 0,
    },
  })

  const categoryOptions = [
    { value: '', label: 'No category' },
    ...(categories?.map((cat) => ({ value: cat.id, label: cat.name })) || []),
  ]

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as KbArticleInput))} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - left column */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <Input {...register('title')} placeholder="Article title" />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <Textarea
              {...register('excerpt')}
              placeholder="Brief summary for listings and search results"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="Write your article content..."
                />
              )}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message as string}</p>
            )}
          </div>
        </div>

        {/* Sidebar - right column */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-gray-900">Publishing</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                {...register('status')}
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'published', label: 'Published' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
              <Select
                {...register('content_type')}
                options={[
                  { value: 'article', label: 'Article' },
                  { value: 'product_doc', label: 'Product Documentation' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select {...register('category_id')} options={categoryOptions} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <Input type="number" {...register('sort_order')} />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-gray-900">Featured Image</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <Input {...register('featured_image_url')} placeholder="https://..." />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-gray-900">SEO</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <Input {...register('meta_title')} placeholder="Override page title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <Textarea
                {...register('meta_description')}
                placeholder="Override page description"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" isLoading={isLoading}>
          {article ? 'Update Article' : 'Create Article'}
        </Button>
      </div>
    </form>
  )
}
