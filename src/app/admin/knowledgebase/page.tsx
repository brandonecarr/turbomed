'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  useAdminArticles,
  useAdminFaqs,
  useDeleteArticle,
  useDeleteFaq,
  useTogglePublishArticle,
} from '@/hooks/useKnowledgebase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  HelpCircle,
  FolderOpen,
  BookOpen,
} from 'lucide-react'

type Tab = 'articles' | 'faqs'

export default function KnowledgebasePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTab = (searchParams.get('tab') as Tab) || 'articles'

  const [tab, setTab] = useState<Tab>(initialTab)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    id: string
    name: string
    type: 'article' | 'faq'
  }>({ isOpen: false, id: '', name: '', type: 'article' })

  const { data: articles, isLoading: loadingArticles } = useAdminArticles({
    status: statusFilter || undefined,
    search: search || undefined,
  })
  const { data: faqs, isLoading: loadingFaqs } = useAdminFaqs({
    status: statusFilter || undefined,
  })

  const deleteArticle = useDeleteArticle()
  const deleteFaq = useDeleteFaq()
  const togglePublish = useTogglePublishArticle()

  const handleDelete = () => {
    if (deleteModal.type === 'article') {
      deleteArticle.mutate(deleteModal.id, {
        onSuccess: () => setDeleteModal({ isOpen: false, id: '', name: '', type: 'article' }),
      })
    } else {
      deleteFaq.mutate(deleteModal.id, {
        onSuccess: () => setDeleteModal({ isOpen: false, id: '', name: '', type: 'article' }),
      })
    }
  }

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab)
    setSearch('')
    setStatusFilter('')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledgebase</h1>
          <p className="text-gray-600 mt-1">Manage articles, FAQs, and product documentation</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/knowledgebase/categories">
            <Button variant="secondary">
              <FolderOpen className="w-4 h-4" />
              Categories
            </Button>
          </Link>
          {tab === 'articles' ? (
            <Link href="/admin/knowledgebase/articles/new">
              <Button>
                <Plus className="w-4 h-4" />
                New Article
              </Button>
            </Link>
          ) : (
            <Link href="/admin/knowledgebase/faqs/new">
              <Button>
                <Plus className="w-4 h-4" />
                New FAQ
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        <button
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === 'articles'
              ? 'border-turbo-blue text-turbo-blue'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('articles')}
        >
          <FileText className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
          Articles ({articles?.length || 0})
        </button>
        <button
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === 'faqs'
              ? 'border-turbo-blue text-turbo-blue'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('faqs')}
        >
          <HelpCircle className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
          FAQs ({faqs?.length || 0})
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {tab === 'articles' && (
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            variant={!statusFilter ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'published' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('published')}
          >
            Published
          </Button>
          <Button
            variant={statusFilter === 'draft' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('draft')}
          >
            Draft
          </Button>
        </div>
      </div>

      {/* Content */}
      {tab === 'articles' && (
        <>
          {loadingArticles ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 skeleton rounded-xl" />
              ))}
            </div>
          ) : articles?.length === 0 ? (
            <Card className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first article</p>
              <Link href="/admin/knowledgebase/articles/new">
                <Button>
                  <Plus className="w-4 h-4" />
                  New Article
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4">
              {articles?.map((article) => (
                <Card key={article.id} className="p-4 hover:shadow-card-hover transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{article.title}</h3>
                        <Badge variant={article.status === 'published' ? 'success' : 'warning'}>
                          {article.status}
                        </Badge>
                        <Badge variant="default">
                          {article.content_type === 'product_doc' ? 'Product Doc' : 'Article'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {article.category && <span>{article.category.name}</span>}
                        {article.excerpt && (
                          <span className="truncate max-w-md">{article.excerpt}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          togglePublish.mutate({
                            id: article.id,
                            publish: article.status !== 'published',
                          })
                        }
                        title={article.status === 'published' ? 'Unpublish' : 'Publish'}
                      >
                        {article.status === 'published' ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Link href={`/admin/knowledgebase/articles/${article.id}/edit`}>
                        <Button variant="ghost" size="sm" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            id: article.id,
                            name: article.title,
                            type: 'article',
                          })
                        }
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
        </>
      )}

      {tab === 'faqs' && (
        <>
          {loadingFaqs ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 skeleton rounded-xl" />
              ))}
            </div>
          ) : faqs?.length === 0 ? (
            <Card className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first FAQ</p>
              <Link href="/admin/knowledgebase/faqs/new">
                <Button>
                  <Plus className="w-4 h-4" />
                  New FAQ
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4">
              {faqs?.map((faq) => (
                <Card key={faq.id} className="p-4 hover:shadow-card-hover transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{faq.question}</h3>
                        <Badge variant={faq.status === 'published' ? 'success' : 'warning'}>
                          {faq.status}
                        </Badge>
                      </div>
                      {faq.category && (
                        <span className="text-sm text-gray-500">{faq.category.name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/knowledgebase/faqs/${faq.id}/edit`}>
                        <Button variant="ghost" size="sm" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            id: faq.id,
                            name: faq.question,
                            type: 'faq',
                          })
                        }
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
        </>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '', name: '', type: 'article' })}
        title={`Delete ${deleteModal.type === 'article' ? 'Article' : 'FAQ'}`}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{deleteModal.name}</strong>? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ isOpen: false, id: '', name: '', type: 'article' })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteArticle.isPending || deleteFaq.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
