'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { kbFaqSchema, type KbFaqInput } from '@/lib/validators'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { useAdminKbCategories } from '@/hooks/useKnowledgebase'
import type { KbFaq } from '@/types'

interface FaqFormProps {
  faq?: KbFaq
  onSubmit: (data: KbFaqInput) => void
  isLoading?: boolean
}

export function FaqForm({ faq, onSubmit, isLoading }: FaqFormProps) {
  const { data: categories } = useAdminKbCategories()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(kbFaqSchema) as any,
    defaultValues: {
      question: faq?.question || '',
      answer: faq?.answer || '',
      category_id: faq?.category_id || '',
      status: faq?.status || 'draft',
      sort_order: faq?.sort_order || 0,
    },
  })

  const categoryOptions = [
    { value: '', label: 'No category' },
    ...(categories?.map((cat) => ({ value: cat.id, label: cat.name })) || []),
  ]

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as KbFaqInput))} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
            <Input {...register('question')} placeholder="Enter the FAQ question" />
            {errors.question && (
              <p className="text-red-500 text-sm mt-1">{errors.question.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
            <Controller
              name="answer"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="Write the answer..."
                />
              )}
            />
            {errors.answer && (
              <p className="text-red-500 text-sm mt-1">{errors.answer.message as string}</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-gray-900">Settings</h3>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select {...register('category_id')} options={categoryOptions} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <Input type="number" {...register('sort_order')} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" isLoading={isLoading}>
          {faq ? 'Update FAQ' : 'Create FAQ'}
        </Button>
      </div>
    </form>
  )
}
