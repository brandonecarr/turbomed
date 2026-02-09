'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clinicSignupSchema, type ClinicSignupInput } from '@/lib/validators'
import { useSubmitClinic } from '@/hooks/useClinics'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { LocationsManager } from '@/components/admin/LocationsManager'
import { CheckCircle, AlertCircle, Building2 } from 'lucide-react'
import type { ClinicLocationInput } from '@/types'

interface ClinicSignupFormProps {
  onSuccess?: () => void
}

export function ClinicSignupForm({ onSuccess }: ClinicSignupFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const submitClinic = useSubmitClinic()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(clinicSignupSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      website_url: '',
      locations: [
        {
          label: 'Main Location',
          address: '',
          city: '',
          state_region: '',
          country: '',
          postal_code: '',
          location_lat: 0,
          location_lng: 0,
          is_primary: true,
        },
      ],
    },
  })

  const locations = watch('locations')

  const onSubmit = async (data: ClinicSignupInput) => {
    setSubmitError(null)

    // Validate that at least one location has coordinates
    const hasValidLocation = data.locations.some(
      (loc) => loc.location_lat !== 0 && loc.location_lng !== 0
    )

    if (!hasValidLocation) {
      setSubmitError(
        'Please add at least one location with valid coordinates. Use the map or geocode feature to set the location.'
      )
      return
    }

    try {
      await submitClinic.mutateAsync(data as any)
      setIsSubmitted(true)
      onSuccess?.()
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to submit clinic. Please try again.')
    }
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Thank You for Registering!
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Your clinic submission has been received and is pending review. We&apos;ll notify you
            via email once your clinic has been approved and listed on our directory.
          </p>
          <Button
            variant="primary"
            className="mt-8"
            onClick={() => (window.location.href = '/find-a-clinic')}
          >
            Browse Clinics
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
      {/* Error banner */}
      {submitError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Submission Error</p>
            <p className="text-sm text-red-700 mt-1">{submitError}</p>
          </div>
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Clinic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Clinic Name *"
            placeholder="Enter your clinic name"
            {...register('name')}
            error={errors.name?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address *"
              type="email"
              placeholder="contact@yourclinic.com"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Phone Number *"
              type="tel"
              placeholder="(555) 123-4567"
              {...register('phone')}
              error={errors.phone?.message}
            />
          </div>

          <Input
            label="Website (optional)"
            type="url"
            placeholder="https://www.yourclinic.com"
            {...register('website_url')}
            error={errors.website_url?.message}
          />
        </CardContent>
      </Card>

      {/* Locations */}
      <Card>
        <CardHeader>
          <CardTitle>Clinic Location(s)</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Add your clinic location(s). Click on the map or use the geocode feature to set the
            exact coordinates for each location.
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
          {errors.locations && (
            <p className="text-sm text-red-500 mt-2">
              {errors.locations.message || 'Please add at least one location'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex flex-col items-center gap-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting || submitClinic.isPending}
          disabled={isSubmitting || submitClinic.isPending}
        >
          Submit Clinic for Review
        </Button>
        <p className="text-sm text-gray-500 text-center max-w-md">
          By submitting, you confirm that the information provided is accurate and that your
          clinic uses TurboMed Orthotics products.
        </p>
      </div>
    </form>
  )
}
