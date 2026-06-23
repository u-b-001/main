'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

export const Breadcrumb: React.FC = () => {
  const pathname = usePathname()

  if (pathname === '/') return null

  // Split paths and filter out empty strings
  const paths = pathname.split('/').filter(Boolean)

  const formatSegment = (str: string) => {
    return str
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <nav aria-label="Breadcrumb" className="bg-slate-50 dark:bg-slate-900 border-b border-gray-150 dark:border-slate-800 py-3.5">
      <div className="container mx-auto px-4 flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-brand-red dark:hover:text-brand-red transition-colors"
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
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {isLast ? (
                <span className="text-slate-800 dark:text-slate-200 font-semibold font-serif truncate max-w-[200px] sm:max-w-none">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-brand-red dark:hover:text-brand-red transition-colors truncate max-w-[150px] sm:max-w-none"
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
