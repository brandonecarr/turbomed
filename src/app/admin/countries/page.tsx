'use client'

import { useState } from 'react'
import { useAdminCountries, useUpdateCountry } from '@/hooks/useCountries'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Search, Edit2, Globe, Building2, X } from 'lucide-react'
import type { CountryWithDistributors } from '@/types'

export default function CountriesPage() {
  const [search, setSearch] = useState('')
  const [filterCoverage, setFilterCoverage] = useState<'all' | 'covered' | 'uncovered'>('all')
  const [editingCountry, setEditingCountry] = useState<CountryWithDistributors | null>(null)
  const [synonymInput, setSynonymInput] = useState('')

  const { data: countries, isLoading } = useAdminCountries({
    search: search || undefined,
    hasCoverage:
      filterCoverage === 'all'
        ? undefined
        : filterCoverage === 'covered',
  })

  const updateCountry = useUpdateCountry()

  const handleUpdateSynonyms = async () => {
    if (!editingCountry) return

    const synonyms = synonymInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    await updateCountry.mutateAsync({
      iso2: editingCountry.iso2,
      data: { synonyms },
    })

    setEditingCountry(null)
  }

  const openEditModal = (country: CountryWithDistributors) => {
    setEditingCountry(country)
    setSynonymInput(country.synonyms?.join(', ') || '')
  }

  const filteredCountries = countries?.filter((c) => {
    if (filterCoverage === 'covered') return c.distributors.length > 0
    if (filterCoverage === 'uncovered') return c.distributors.length === 0
    return true
  })

  const stats = {
    total: countries?.length || 0,
    covered: countries?.filter((c) => c.distributors.length > 0).length || 0,
    uncovered: countries?.filter((c) => c.distributors.length === 0).length || 0,
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Countries</h1>
        <p className="text-gray-600 mt-1">
          Manage country data and search synonyms
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-500">Total countries</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.covered}</p>
              <p className="text-sm text-gray-500">With distributors</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.uncovered}</p>
              <p className="text-sm text-gray-500">No coverage</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterCoverage === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilterCoverage('all')}
          >
            All
          </Button>
          <Button
            variant={filterCoverage === 'covered' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilterCoverage('covered')}
          >
            With coverage
          </Button>
          <Button
            variant={filterCoverage === 'uncovered' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilterCoverage('uncovered')}
          >
            No coverage
          </Button>
        </div>
      </div>

      {/* Countries list */}
      {isLoading ? (
        <div className="grid gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 skeleton rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg divide-y">
          {filteredCountries?.map((country) => (
            <div
              key={country.iso2}
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 text-sm font-mono text-gray-500">
                  {country.iso2}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{country.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant={country.region ? 'default' : 'warning'}>
                      {country.region || 'No region'}
                    </Badge>
                    {country.synonyms && country.synonyms.length > 0 && (
                      <span className="text-xs text-gray-400">
                        Synonyms: {country.synonyms.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant={country.distributors.length > 0 ? 'success' : 'warning'}
                >
                  {country.distributors.length} distributor
                  {country.distributors.length !== 1 ? 's' : ''}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditModal(country)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit synonyms modal */}
      <Modal
        isOpen={!!editingCountry}
        onClose={() => setEditingCountry(null)}
        title={`Edit ${editingCountry?.name}`}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Search Synonyms</label>
            <Input
              placeholder="e.g., USA, U.S., America"
              value={synonymInput}
              onChange={(e) => setSynonymInput(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter comma-separated alternative names for this country to improve search
            </p>
          </div>

          {/* Current distributors */}
          {editingCountry && editingCountry.distributors.length > 0 && (
            <div>
              <label className="label">Distributors in this country</label>
              <div className="flex flex-wrap gap-2">
                {editingCountry.distributors.map((d) => (
                  <Badge key={d.id} variant="info">
                    {d.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setEditingCountry(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSynonyms}
              isLoading={updateCountry.isPending}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
