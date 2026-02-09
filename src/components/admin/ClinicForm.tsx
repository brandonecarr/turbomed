'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { clinicSchema, type ClinicInput } from '@/lib/validators'
import { useCreateClinic, useUpdateClinic, useReviewClinic } from '@/hooks/useClinics'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { LocationsManager } from '@/components/admin/LocationsManager'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import type { ClinicWithLocations, ClinicLocationInput } from '@/types'
import { ArrowLeft, Save, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface ClinicFormProps {
  clinic?: ClinicWithLocations
  mode: 'create' | 'edit'
}

export function ClinicForm({ clinic, mode }: ClinicFormProps) {
  const router = useRouter()
  const createClinic = useCreateClinic()
  const updateClinic = useUpdateClinic()
  const reviewClinic = useReviewClinic()
  const [activeTab, setActiveTab] = useState<'basic' | 'locations' | 'review'>('basic')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(clinicSchema) as any,
    defaultValues: {
      name: clinic?.name || '',
      status: clinic?.status || 'pending',
      email: clinic?.email || '',
      phone: clinic?.phone || '',
      website_url: clinic?.website_url || '',
      address_line1: clinic?.address_line1 || '',
      city: clinic?.city || '',
      state_region: clinic?.state_region || '',
      postal_code: clinic?.postal_code || '',
      country: clinic?.country || '',
      location_lat: clinic?.location_lat || null,
      location_lng: clinic?.location_lng || null,
      rejection_reason: clinic?.rejection_reason || '',
      locations: clinic?.locations?.map((loc) => ({
        id: loc.id,
        label: loc.label || '',
        address: loc.address || '',
        city: loc.city || '',
        state_region: loc.state_region || '',
        country: loc.country || '',
        postal_code: loc.postal_code || '',
        location_lat: loc.location_lat,
        location_lng: loc.location_lng,
        is_primary: loc.is_primary,
      })) || [],
    },
  })

  const status = watch('status')

  const onSubmit = async (data: any) => {
    try {
      if (mode === 'create') {
        await createClinic.mutateAsync(data)
      } else if (clinic) {
        await updateClinic.mutateAsync({ id: clinic.id, data })
      }
      router.push('/admin/clinics')
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleApprove = async () => {
    if (!clinic) return
    try {
      await reviewClinic.mutateAsync({ id: clinic.id, action: 'approve' })
      router.push('/admin/clinics')
    } catch (error) {
      console.error('Approval error:', error)
    }
  }

  const handleReject = async () => {
    if (!clinic) return
    try {
      await reviewClinic.mutateAsync({
        id: clinic.id,
        action: 'reject',
        rejection_reason: rejectionReason,
      })
      setShowRejectModal(false)
      router.push('/admin/clinics')
    } catch (error) {
      console.error('Rejection error:', error)
    }
  }

  const statusBadge = {
    pending: { icon: Clock, className: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
    approved: { icon: CheckCircle, className: 'bg-green-100 text-green-800', label: 'Approved' },
    rejected: { icon: XCircle, className: 'bg-red-100 text-red-800', label: 'Rejected' },
  }[status] || { icon: Clock, className: 'bg-gray-100 text-gray-800', label: status }

  const StatusIcon = statusBadge.icon

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'locations', label: 'Locations' },
    ...(mode === 'edit' ? [{ id: 'review', label: 'Review' }] : []),
  ] as const

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/clinics">
              <Button type="button" variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {mode === 'create' ? 'Add Clinic' : 'Edit Clinic'}
              </h1>
              <p className="text-gray-600 mt-1">
                {mode === 'create' ? 'Create a new clinic record' : `Editing ${clinic?.name}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusBadge.className}`}
            >
              <StatusIcon className="w-4 h-4" />
              {statusBadge.label}
            </span>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting || createClinic.isPending || updateClinic.isPending}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Review actions for pending clinics */}
        {mode === 'edit' && clinic?.status === 'pending' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800">This clinic is pending review</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Review the clinic information and approve or reject this submission.
                </p>
                <div className="flex gap-3 mt-4">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleApprove}
                    isLoading={reviewClinic.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Clinic
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowRejectModal(true)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 border-b-2 font-medium text-sm transition-colors ${
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
                <Input
                  label="Clinic Name *"
                  {...register('name')}
                  error={errors.name?.message as string}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email *"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message as string}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    {...register('phone')}
                    error={errors.phone?.message as string}
                  />
                </div>

                <Input
                  label="Website"
                  type="url"
                  {...register('website_url')}
                  error={errors.website_url?.message as string}
                />

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Primary Address (optional)</h4>
                  <Input
                    label="Address"
                    {...register('address_line1')}
                    error={errors.address_line1?.message as string}
                  />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <Input
                      label="City"
                      {...register('city')}
                      error={errors.city?.message as string}
                    />
                    <Input
                      label="State/Region"
                      {...register('state_region')}
                      error={errors.state_region?.message as string}
                    />
                    <Input
                      label="Postal Code"
                      {...register('postal_code')}
                      error={errors.postal_code?.message as string}
                    />
                    <Input
                      label="Country"
                      {...register('country')}
                      error={errors.country?.message as string}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'locations' && (
            <Card>
              <CardHeader>
                <CardTitle>Clinic Locations</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Manage the clinic&apos;s physical locations. Each location will appear as a pin on
                  the map.
                </p>
              </CardHeader>
              <CardContent>
                <Controller
                  name="locations"
                  control={control}
                  render={({ field }) => (
                    <LocationsManager
                      locations={field.value as ClinicLocationInput[]}
                      onChange={field.onChange}
                    />
                  )}
                />
              </CardContent>
            </Card>
          )}

          {activeTab === 'review' && mode === 'edit' && clinic && (
            <Card>
              <CardHeader>
                <CardTitle>Review Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Submitted</label>
                    <p className="text-gray-900">
                      {new Date(clinic.submitted_at).toLocaleString()}
                    </p>
                  </div>
                  {clinic.reviewed_at && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Reviewed</label>
                      <p className="text-gray-900">
                        {new Date(clinic.reviewed_at).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {clinic.rejection_reason && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <label className="text-sm font-medium text-red-800">Rejection Reason</label>
                    <p className="text-red-700 mt-1">{clinic.rejection_reason}</p>
                  </div>
                )}

                <div>
                  <label className="label">Status</label>
                  <select
                    {...register('status')}
                    className="select"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {status === 'rejected' && (
                  <Textarea
                    label="Rejection Reason"
                    {...register('rejection_reason')}
                    placeholder="Enter the reason for rejection..."
                    rows={3}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </form>

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Clinic</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this clinic submission. This will be stored for
              reference.
            </p>
            <Textarea
              label="Rejection Reason (optional)"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter the reason for rejection..."
              rows={3}
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleReject}
                isLoading={reviewClinic.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                Reject Clinic
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
