'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  Building2,
  Globe,
  Upload,
  ScrollText,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Stethoscope,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { usePendingClinicsCount } from '@/hooks/useClinics'

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Distributors', href: '/admin/distributors', icon: Building2 },
  { name: 'Clinics', href: '/admin/clinics', icon: Stethoscope, showPendingBadge: true },
  { name: 'Knowledgebase', href: '/admin/knowledgebase', icon: BookOpen },
  { name: 'Countries', href: '/admin/countries', icon: Globe },
  { name: 'Import/Export', href: '/admin/import', icon: Upload },
  { name: 'Audit Log', href: '/admin/audit-log', icon: ScrollText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)
  const { data: pendingClinicsCount } = usePendingClinicsCount()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 flex flex-col bg-turbo-navy text-white transition-all duration-300',
          collapsed ? 'w-16 -translate-x-full lg:translate-x-0' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-turbo-navy-light">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-turbo-navy font-bold">T</span>
              </div>
              <span className="font-semibold">TurboMed Admin</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 hover:bg-turbo-navy-light rounded-lg transition-colors"
          >
            <ChevronLeft
              className={cn(
                'w-5 h-5 transition-transform',
                collapsed && 'rotate-180'
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const showBadge = item.showPendingBadge && (pendingClinicsCount ?? 0) > 0
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive(item.href)
                    ? 'bg-white/10 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm flex-1 flex items-center justify-between">
                    {item.name}
                    {showBadge && (
                      <span className="bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {pendingClinicsCount}
                      </span>
                    )}
                  </span>
                )}
                {collapsed && showBadge && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-turbo-navy-light">
          {!collapsed && session?.user && (
            <div className="mb-3">
              <p className="text-sm font-medium truncate">{session.user.name || session.user.email}</p>
              <p className="text-xs text-gray-400 capitalize">{session.user.role}</p>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full',
              'text-gray-300 hover:text-white hover:bg-white/5'
            )}
            title={collapsed ? 'Sign out' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  )
}
