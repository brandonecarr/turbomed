'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Building2, Globe, AlertCircle, TrendingUp, Stethoscope, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface DashboardStats {
  totalDistributors: number
  publishedDistributors: number
  unpublishedDistributors: number
  totalCountriesCovered: number
  totalCountries: number
  // Clinic stats
  totalClinics: number
  approvedClinics: number
  pendingClinics: number
  rejectedClinics: number
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch('/api/admin/dashboard')
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats')
  }
  return response.json()
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  })

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of your distributor and clinic network
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Distributors</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {isLoading ? '...' : stats?.totalDistributors || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-turbo-blue-pale rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-turbo-navy" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {isLoading ? '...' : stats?.publishedDistributors || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unpublished</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {isLoading ? '...' : stats?.unpublishedDistributors || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Countries Covered</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {isLoading ? '...' : stats?.totalCountriesCovered || 0}
                  <span className="text-base font-normal text-gray-400">
                    /{stats?.totalCountries || 0}
                  </span>
                </p>
              </div>
              <div className="w-12 h-12 bg-turbo-blue-pale rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-turbo-navy" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinic Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Clinic Network</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Clinics</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {isLoading ? '...' : stats?.totalClinics || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Approved</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {isLoading ? '...' : stats?.approvedClinics || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">
                    {isLoading ? '...' : stats?.pendingClinics || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Rejected</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">
                    {isLoading ? '...' : stats?.rejectedClinics || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/distributors/new" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <Building2 className="w-4 h-4 mr-2" />
                  Add New Distributor
                </Button>
              </Link>
              <Link href="/admin/clinics/new" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Add New Clinic
                </Button>
              </Link>
              <Link href="/admin/import" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  Import Distributors from CSV
                </Button>
              </Link>
              <Link href="/admin/countries" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  Manage Country Synonyms
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes to your network</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 text-center py-8">
              Activity log will appear here once you start making changes.
            </p>
            <Link href="/admin/audit-log" className="block">
              <Button variant="ghost" className="w-full">
                View Full Audit Log
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Warnings */}
      {stats && stats.pendingClinics > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">
                {stats.pendingClinics} clinic{stats.pendingClinics > 1 ? 's' : ''} pending review
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                These clinic submissions are waiting for your approval.
              </p>
              <Link href="/admin/clinics?status=pending">
                <Button variant="ghost" size="sm" className="mt-2 text-yellow-700 hover:text-yellow-800">
                  Review pending clinics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {stats && stats.unpublishedDistributors > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">
                {stats.unpublishedDistributors} unpublished distributor{stats.unpublishedDistributors > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                These distributors are not visible on the public page.
              </p>
              <Link href="/admin/distributors?status=unpublished">
                <Button variant="ghost" size="sm" className="mt-2 text-yellow-700 hover:text-yellow-800">
                  Review unpublished distributors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
