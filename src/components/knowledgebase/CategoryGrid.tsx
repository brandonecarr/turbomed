import Link from 'next/link'
import {
  BookOpen,
  HelpCircle,
  Package,
  FileText,
  Shield,
  Wrench,
  Heart,
  Globe,
  type LucideIcon,
} from 'lucide-react'
import type { KbCategory } from '@/types'

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  HelpCircle,
  Package,
  FileText,
  Shield,
  Wrench,
  Heart,
  Globe,
}

interface CategoryGridProps {
  categories: KbCategory[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat) => {
        const Icon = (cat.icon && iconMap[cat.icon]) || BookOpen
        return (
          <Link
            key={cat.id}
            href={`/knowledgebase?category=${cat.slug}`}
            className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-turbo-blue-light transition-all group"
          >
            <div className="w-10 h-10 bg-turbo-blue-pale rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-turbo-blue" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-turbo-blue transition-colors">
                {cat.name}
              </h3>
              {cat.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
