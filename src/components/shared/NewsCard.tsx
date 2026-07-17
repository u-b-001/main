import React from 'react'
import Link from 'next/link'
import type { News as NewsType } from '@/payload-types'
import { format } from 'date-fns'
import { Calendar, ArrowUpRight } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface NewsCardProps {
  news: NewsType
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const { title, tag, excerpt, slug, externalLink, publishedAt, titleColor, excerptColor } = news as any

  // Select tag colors
  const tagColors = {
    ANNOUNCEMENT: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
    EVENT: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900',
    OPPORTUNITY: 'bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
    RESULT: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900',
    NOTICE: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900',
  }

  const isExternal = Boolean(externalLink)
  const linkHref = externalLink || `/news/${slug}`

  // Format date
  const formattedDate = publishedAt
    ? format(new Date(publishedAt), 'MMM dd, yyyy')
    : ''

  return (
    <div className="bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800/80 p-6 rounded-xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:border-brand-gold/40">
      <div className="space-y-3">
        {/* Header: Tag + Date */}
        <div className="flex items-center justify-between gap-4">
          <span
            className={cn(
              'px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md border uppercase',
              tagColors[tag as keyof typeof tagColors] || tagColors.NOTICE
            )}
          >
            {tag}
          </span>
          {formattedDate && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 
          className="font-serif font-bold text-lg text-brand-navy dark:text-white leading-snug group-hover:text-brand-red transition-colors pt-1"
          style={{ color: titleColor || undefined }}
        >
          {isExternal ? (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              {title}
              <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0 inline-block align-middle group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          ) : (
            <Link href={linkHref} className="hover:underline">
              {title}
            </Link>
          )}
        </h3>

        {/* Excerpt */}
        <p 
          className="text-sm text-brand-text dark:text-slate-400 leading-relaxed font-serif pt-1 line-clamp-3"
          style={{ color: excerptColor || undefined }}
        >
          {excerpt}
        </p>
      </div>

      {/* Footer Link */}
      <div className="pt-5 border-t border-slate-100 dark:border-slate-800/60 mt-4 flex items-center justify-between">
        {isExternal ? (
          <a
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-wider text-brand-red hover:underline inline-flex items-center gap-1"
          >
            Visit Link
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        ) : (
          <Link
            href={linkHref}
            className="text-xs font-bold uppercase tracking-wider text-brand-red hover:underline"
          >
            Read Article
          </Link>
        )}
      </div>
    </div>
  )
}
