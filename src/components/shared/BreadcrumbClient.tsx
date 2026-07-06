'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

export const BreadcrumbClient: React.FC<{
  settings?: {
    transparentBackground?: boolean | null
    textColor?: string | null
  }
}> = ({ settings }) => {
  const pathname = usePathname()

  if (pathname === '/') return null

  // Split paths and filter out empty strings
  const paths = pathname.split('/').filter(Boolean)

  const formatSegment = (str: string) => {
    return str
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const isTransparent = settings?.transparentBackground
  const customTextColor = settings?.textColor || undefined

  const colorClass = !customTextColor ? 'text-slate-500' : ''
  const iconColorClass = !customTextColor ? 'text-slate-400' : ''
  const activeColorClass = !customTextColor ? 'text-slate-800 dark:text-slate-200' : ''

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`py-3.5 ${isTransparent ? 'bg-transparent border-transparent' : 'bg-slate-50 dark:bg-slate-900 border-b border-gray-150 dark:border-slate-800'}`}
    >
      <div 
        className={`container mx-auto px-4 flex items-center gap-2 text-xs font-medium ${colorClass}`}
        style={{ color: customTextColor }}
      >
        <Link
          href="/"
          className={`flex items-center gap-1 hover:text-brand-red dark:hover:text-brand-red transition-colors ${colorClass}`}
          style={{ color: customTextColor }}
        >
          <Home className="w-3.5 h-3.5" />
          <span className="sr-only">Home</span>
        </Link>

        {paths.map((segment, index) => {
          const href = `/${paths.slice(0, index + 1).join('/')}`
          const isLast = index === paths.length - 1
          const label = formatSegment(segment)

          return (
            <React.Fragment key={index}>
              <ChevronRight 
                className={`w-3.5 h-3.5 shrink-0 ${iconColorClass}`} 
                style={{ color: customTextColor }}
              />
              {isLast ? (
                <span 
                  className={`font-semibold font-serif truncate max-w-[200px] sm:max-w-none ${activeColorClass}`}
                  style={{ color: customTextColor }}
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className={`hover:text-brand-red dark:hover:text-brand-red transition-colors truncate max-w-[150px] sm:max-w-none ${colorClass}`}
                  style={{ color: customTextColor }}
                >
                  {label}
                </Link>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </nav>
  )
}
