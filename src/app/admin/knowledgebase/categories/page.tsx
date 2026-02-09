'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  useAdminKbCategories,
  useCreateKbCategory,
  useUpdateKbCategory,
  useDeleteKbCategory,
} from '@/hooks/useKnowledgebase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { ArrowLeft, Plus, Edit2, Trash2, FolderOpen } from 'lucide-react'
import type { KbCategory } from '@/types'

export default function CategoriesPage() {
  const { data: categories, isLoading } = useAdminKbCategories()
  const createCategory = useCreateKbCategory()
  const updateCategory = useUpdateKbCategory()
  const deleteCategory = useDeleteKbCategory()

  const [formModal, setFormModal] = useState<{
    isOpen: boolean
    category: KbCategory | null
  }>({ isOpen: false, category: null })
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    id: string
    name: string
  }>({ isOpen: false, id: '', name: '' })

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [sortOrder, setSortOrder] = useState(0)

  const openCreate = () => {
    setName('')
    setDescription('')
    setIcon('')
    setSortOrder(0)
    setFormModal({ isOpen: true, category: null })
  }

  const openEdit = (cat: KbCategory) => {
    setName(cat.name)
    setDescription(cat.description || '')
    setIcon(cat.icon || '')
    setSortOrder(cat.sort_order)
    setFormModal({ isOpen: true, category: cat })
  }

  const handleSave = () => {
    const data = { name, description: description || null, icon: icon || null, sort_order: sortOrder }
    if (formModal.category) {
      updateCategory.mutate(
        { id: formModal.category.id, data },
        { onSuccess: () => setFormModal({ isOpen: false, category: null }) }
      )
    } else {
      createCategory.mutate(data, {
        onSuccess: () => setFormModal({ isOpen: false, category: null }),
      })
    }
  }

  const handleDelete = () => {
    deleteCategory.mutate(deleteModal.id, {
      onSuccess: () => setDeleteModal({ isOpen: false, id: '', name: '' }),
    })
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Link href="/admin/knowledgebase" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Knowledgebase
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Organize your knowledgebase content</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          New Category
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 skeleton rounded-xl" />
          ))}
        </div>
      ) : categories?.length === 0 ? (
        <Card className="text-center py-12">
          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
          <p className="text-gray-500 mb-6">Create categories to organize your content</p>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4" />
            New Category
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {categories?.map((cat) => (
            <Card key={cat.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{cat.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>Slug: {cat.slug}</span>
                    {cat.icon && <span>Icon: {cat.icon}</span>}
                    <span>Order: {cat.sort_order}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(cat)} title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteModal({ isOpen: true, id: cat.id, name: cat.name })}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit modal */}
      <Modal
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false, category: null })}
        title={formModal.category ? 'Edit Category' : 'New Category'}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
            <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Lucide icon name (e.g. BookOpen)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <Input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setFormModal({ isOpen: false, category: null })}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              isLoading={createCategory.isPending || updateCategory.isPending}
              disabled={!name.trim()}
            >
              {formModal.category ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '', name: '' })}
        title="Delete Category"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{deleteModal.name}</strong>? Articles and FAQs
            in this category will be uncategorized.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteModal({ isOpen: false, id: '', name: '' })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleteCategory.isPending}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
