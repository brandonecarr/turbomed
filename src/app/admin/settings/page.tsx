'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Settings, Shield, Key, User } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="label">Email</label>
              <Input value={session?.user?.email || ''} disabled />
            </div>
            <div>
              <label className="label">Name</label>
              <Input value={session?.user?.name || ''} disabled />
            </div>
            <div>
              <label className="label">Role</label>
              <div>
                <Badge
                  variant={
                    session?.user?.role === 'admin'
                      ? 'success'
                      : session?.user?.role === 'editor'
                      ? 'info'
                      : 'default'
                  }
                >
                  {session?.user?.role || 'viewer'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent>
            {isChangingPassword ? (
              <div className="space-y-4">
                <Input
                  type="password"
                  label="Current Password"
                  placeholder="Enter current password"
                />
                <Input
                  type="password"
                  label="New Password"
                  placeholder="Enter new password"
                />
                <Input
                  type="password"
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                />
                <div className="flex gap-3">
                  <Button>Update Password</Button>
                  <Button variant="ghost" onClick={() => setIsChangingPassword(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={() => setIsChangingPassword(true)}
              >
                <Key className="w-4 h-4" />
                Change Password
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Environment info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Environment
            </CardTitle>
            <CardDescription>Application configuration status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Supabase</span>
                <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'success' : 'danger'}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Connected' : 'Not configured'}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Mapbox</span>
                <Badge variant={process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? 'success' : 'danger'}>
                  {process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? 'Configured' : 'Not configured'}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Authentication</span>
                <Badge variant="success">NextAuth.js</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
