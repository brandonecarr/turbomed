'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { distributorSchema, type DistributorInput } from '@/lib/validators'
import { useCountries } from '@/hooks/useCountries'
import { useCreateDistributor, useUpdateDistributor } from '@/hooks/useDistributors'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { MultiSelect } from '@/components/ui/MultiSelect'
import { MapPicker } from '@/components/admin/MapPicker'
import { LocationsManager } from '@/components/admin/LocationsManager'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import {
  REGIONS,
  PRODUCT_LINES,
  SERVICE_TYPES,
  COMMON_LANGUAGES,
  type DistributorWithCoverage,
  type DistributorLocationInput,
} from '@/types'
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface DistributorFormProps {
  distributor?: DistributorWithCoverage
  mode: 'create' | 'edit'
}

export function DistributorForm({ distributor, mode }: DistributorFormProps) {
  const router = useRouter()
  const { data: countries } = useCountries()
  const createDistributor = useCreateDistributor()
  const updateDistributor = useUpdateDistributor()
  const [activeTab, setActiveTab] = useState<'basic' | 'location' | 'coverage' | 'products'>(
    'basic'
  )

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(distributorSchema) as any,
    defaultValues: {
      name: distributor?.name || '',
      status: distributor?.status || 'unpublished',
      description: distributor?.description || '',
      logo_url: distributor?.logo_url || '',
      website_url: distributor?.website_url || '',
      email: distributor?.email || '',
      phone: distributor?.phone || '',
      address_line1: distributor?.address_line1 || '',
      address_line2: distributor?.address_line2 || '',
      city: distributor?.city || '',
      state_region: distributor?.state_region || '',
      postal_code: distributor?.postal_code || '',
      country_hq: distributor?.country_hq || '',
      location_lat: distributor?.location_lat || 0,
      location_lng: distributor?.location_lng || 0,
      regions_served: (distributor?.regions_served as any) || [],
      languages_supported: distributor?.languages_supported || [],
      products_supported: (distributor?.products_supported as any) || [],
      service_types: (distributor?.service_types as any) || [],
      priority_rank: distributor?.priority_rank || 100,
      country_coverage: distributor?.countries?.map((c) => c.iso2) || [],
      locations: distributor?.locations?.map((loc) => ({
        id: loc.id,
        label: loc.label || '',
        address: loc.address || '',
        city: loc.city || '',
        state_region: loc.state_region || '',
        country: loc.country || '',
        location_lat: loc.location_lat,
        location_lng: loc.location_lng,
        is_primary: loc.is_primary,
      })) || [],
    },
  })

  const status = watch('status')
  const watchedLocations = watch('locations')

  const onSubmit = async (data: any) => {
    // Debug: log the locations being submitted
    console.log('Watched locations before submit:', JSON.stringify(watchedLocations, null, 2))
    console.log('Submitting locations:', JSON.stringify(data.locations, null, 2))
    try {
      if (mode === 'create') {
        await createDistributor.mutateAsync(data as any)
      } else if (distributor) {
        await updateDistributor.mutateAsync({ id: distributor.id, data: data as any })
      }
      router.push('/admin/distributors')
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const countryOptions =
    countries?.map((c) => ({ value: c.iso2, label: c.name })) || []

  const regionOptions = REGIONS.map((r) => ({ value: r, label: r }))
  const productOptions = PRODUCT_LINES.map((p) => ({ value: p, label: p }))
  const serviceOptions = SERVICE_TYPES.map((s) => ({ value: s, label: s }))
  const languageOptions = COMMON_LANGUAGES.map((l) => ({ value: l, label: l }))

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'location', label: 'Location' },
    { id: 'coverage', label: 'Coverage' },
    { id: 'products', label: 'Products & Services' },
  ] as const

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/distributors">
            <Button type="button" variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Add Distributor' : 'Edit Distributor'}
            </h1>
            <p className="text-gray-600 mt-1">
              {mode === 'create'
                ? 'Create a new distributor record'
                : `Editing ${distributor?.name}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Button
                type="button"
                variant={field.value === 'published' ? 'secondary' : 'ghost'}
                onClick={() =>
                  field.onChange(field.value === 'published' ? 'unpublished' : 'published')
                }
              >
                {field.value === 'published' ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Published
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Unpublished
                  </>
                )}
              </Button>
            )}
          />
          <Button type="submit" isLoading={isSubmitting}>
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-turbo-navy text-turbo-navy'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="space-y-6">
        {activeTab === 'basic' && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Distributor Name *"
                  placeholder="e.g., ABC Medical Supplies"
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="Website URL"
                  type="url"
                  placeholder="https://example.com"
                  error={errors.website_url?.message}
                  {...register('website_url')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="contact@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              </div>

              <Textarea
                label="Description"
                placeholder="Brief description of the distributor..."
                rows={4}
                error={errors.description?.message}
                {...register('description')}
              />

              <Input
                label="Logo URL"
                type="url"
                placeholder="https://example.com/logo.png"
                error={errors.logo_url?.message}
                {...register('logo_url')}
              />

              <Input
                label="Priority Rank"
                type="number"
                placeholder="100"
                error={errors.priority_rank?.message}
                {...register('priority_rank', { valueAsNumber: true })}
              />
              <p className="text-sm text-gray-500 -mt-2">
                Lower numbers appear first in search results (default: 100)
              </p>
            </CardContent>
          </Card>
        )}

        {activeTab === 'location' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="locations"
                  control={control}
                  render={({ field }) => (
                    <LocationsManager
                      locations={field.value as DistributorLocationInput[]}
                      onChange={field.onChange}
                    />
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Primary Address (Legacy)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500 mb-4">
                  This address is used for backwards compatibility. For multiple locations, use the
                  Locations section above.
                </p>
                <Controller
                  name="location_lat"
                  control={control}
                  render={({ field: latField }) => (
                    <Controller
                      name="location_lng"
                      control={control}
                      render={({ field: lngField }) => (
                        <MapPicker
                          latitude={latField.value}
                          longitude={lngField.value}
                          onChange={(lat, lng) => {
                            latField.onChange(lat)
                            lngField.onChange(lng)
                          }}
                        />
                      )}
                    />
                  )}
                />
                {(errors.location_lat || errors.location_lng) && (
                  <p className="mt-2 text-sm text-red-600">
                    Please set a valid location on the map
                  </p>
                )}
                <Input
                  label="Address Line 1"
                  placeholder="123 Main Street"
                  {...register('address_line1')}
                />
                <Input
                  label="Address Line 2"
                  placeholder="Suite 100"
                  {...register('address_line2')}
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Input label="City" placeholder="New York" {...register('city')} />
                  <Input
                    label="State/Region"
                    placeholder="NY"
                    {...register('state_region')}
                  />
                  <Input
                    label="Postal Code"
                    placeholder="10001"
                    {...register('postal_code')}
                  />
                  <Controller
                    name="country_hq"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Country (HQ)"
                        options={countryOptions}
                        placeholder="Select country"
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'coverage' && (
          <Card>
            <CardHeader>
              <CardTitle>Countries Serviced</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Controller
                name="country_coverage"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    label="Select countries this distributor services"
                    options={countryOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Search and select countries..."
                  />
                )}
              />
              <p className="text-sm text-gray-500">
                These countries will be linked to this distributor in the Find a Distributor
                search.
              </p>

              <Controller
                name="regions_served"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    label="Regions Served"
                    options={regionOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select regions..."
                  />
                )}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'products' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Products Supported</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="products_supported"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      options={productOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select TurboMed products..."
                    />
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Types</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="service_types"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      options={serviceOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select service types..."
                    />
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Languages Supported</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="languages_supported"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      options={languageOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select languages..."
                    />
                  )}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </form>
  )
}
