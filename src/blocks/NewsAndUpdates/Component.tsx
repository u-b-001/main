import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { ArrowRight, Calendar, Pin } from 'lucide-react'
import { cn } from '@/utilities/ui'
import type { NewsAndUpdatesBlock as NewsAndUpdatesProps } from '@/payload-types'

// Format dates nicely (e.g., Jun 27, 2026)
const formatDate = (dateString?: string | null) => {
  if (!dateString) return ''
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return ''
  }
}

// Get day/month labels for the List View layout date-badges
const getDateParts = (dateString?: string | null) => {
  if (!dateString) return { day: '', month: '' }
  try {
    const d = new Date(dateString)
    return {
      day: d.toLocaleDateString('en-US', { day: '2-digit' }),
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    }
  } catch {
    return { day: '', month: '' }
  }
}

// Map database tags to aesthetic visual badges
const getTagBadgeStyles = (tag?: string | null) => {
  if (!tag) return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  const normalized = tag.toUpperCase()
  switch (normalized) {
    case 'ANNOUNCEMENT':
      return 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 border border-red-100/50 dark:border-red-900/30'
    case 'EVENT':
      return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30'
    case 'OPPORTUNITY':
      return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30'
    case 'RESULT':
      return 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/30'
    case 'NOTICE':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/30'
    default:
      return 'bg-slate-150 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-transparent'
  }
}

export const NewsAndUpdatesComponent = async ({
  heading,
  description,
  align = 'left',
  layout = 'spotlight',
  newsSource = 'fetch',
  limit = 5,
  sortBy = 'latest',
  category,
  fetchOnlyFeatured = false,
  manualNews,
  viewAllEnabled = true,
  viewAllLabel = 'All news',
  viewAllUrl = '/news',
  sectionBgColor = '#FFFFFF',
}: NewsAndUpdatesProps) => {
  let newsItems: any[] = []

  if (newsSource === 'fetch') {
    try {
      const payload = await getPayload({ config: configPromise })

      // Build database query filters
      const whereClause: any = {
        status: { equals: 'published' },
      }

      if (fetchOnlyFeatured) {
        whereClause.featured = { equals: true }
      }

      if (category) {
        whereClause.tag = { equals: category }
      }

      // Map sortBy property
      let sort = '-publishedAt'
      if (sortBy === 'oldest') {
        sort = 'publishedAt'
      } else if (sortBy === 'featured') {
        sort = '-featured,-publishedAt'
      }

      const fetched = await payload.find({
        collection: 'news',
        where: whereClause,
        limit: limit || 5,
        sort: sort,
        depth: 1,
      })

      newsItems = fetched.docs
    } catch (err: any) {
      console.error('Error fetching dynamic news articles:', err)
    }
  } else {
    newsItems = manualNews || []
  }

  if (newsItems.length === 0) return null

  const isCenter = align === 'center'
  const isRight = align === 'right'

  const alignmentClass = isCenter ? 'text-center' : isRight ? 'text-right' : 'text-left'

  // Divide news into primary and secondary items for Spotlight layout
  const [featuredItem, ...sidebarItems] = newsItems

  return (
    <section
      className="w-full py-16 md:py-24 relative overflow-hidden transition-all duration-300 border-t border-slate-100 dark:border-slate-850"
      style={{ backgroundColor: sectionBgColor || undefined }}
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Block */}
        {(heading || description) && (
          <div className={cn('mb-12 md:mb-18 max-w-3xl', alignmentClass, isCenter ? 'mx-auto' : '')}>
            {heading && (
              <h2 className="text-3xl md:text-4xl font-serif font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                {heading}
              </h2>
            )}
            <div
              className={cn(
                'w-16 h-1 bg-brand-red dark:bg-brand-gold mt-4 mb-5 rounded-full',
                isCenter ? 'mx-auto' : isRight ? 'ml-auto' : ''
              )}
            />
            {description && (
              <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {description}
              </p>
            )}
          </div>
        )}

        {/* ── Spotlight Layout ── */}
        {layout === 'spotlight' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Featured Left Spotlight Card */}
            {featuredItem && (
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 md:p-10 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 group">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className={cn('px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full', getTagBadgeStyles(featuredItem.tag))}>
                      {featuredItem.tag}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-semibold">
                      <Calendar size={14} />
                      <span>{formatDate(featuredItem.publishedAt)}</span>
                      {featuredItem.featured && (
                        <span className="flex items-center text-amber-500 gap-0.5 ml-2 font-bold uppercase text-[9px] tracking-wider bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded-md">
                          <Pin size={10} className="rotate-45" /> PINNED
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold font-serif text-brand-navy dark:text-white mb-4 uppercase leading-snug group-hover:text-brand-red dark:group-hover:text-brand-gold transition-colors duration-250">
                    {featuredItem.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
                    {featuredItem.excerpt}
                  </p>
                </div>
                <div>
                  <Link
                    href={featuredItem.externalLink || `/news/${featuredItem.slug || ''}`}
                    target={featuredItem.externalLink ? '_blank' : undefined}
                    className="inline-flex items-center gap-2 text-xs font-extrabold text-brand-red dark:text-brand-gold hover:text-brand-navy dark:hover:text-white uppercase tracking-widest transition-colors duration-250"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            )}

            {/* Sidebar Right Rows */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="space-y-4">
                {sidebarItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.externalLink || `/news/${item.slug || ''}`}
                    target={item.externalLink ? '_blank' : undefined}
                    className="flex flex-col bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 border border-slate-100/50 dark:border-slate-800/40 hover:border-slate-200 dark:hover:border-slate-800 hover:shadow-xs p-5 rounded-2xl group transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3.5">
                      <span className={cn('px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full', getTagBadgeStyles(item.tag))}>
                        {item.tag}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide group-hover:text-brand-red dark:group-hover:text-brand-gold transition-colors duration-200 line-clamp-2">
                      {item.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Card Grid Layout ── */}
        {layout === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 md:p-8 rounded-3xl flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className={cn('px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full', getTagBadgeStyles(item.tag))}>
                      {item.tag}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">
                      {formatDate(item.publishedAt)}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold font-serif text-brand-navy dark:text-white mb-3 uppercase tracking-wide leading-snug group-hover:text-brand-red dark:group-hover:text-brand-gold transition-colors duration-250 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>
                <Link
                  href={item.externalLink || `/news/${item.slug || ''}`}
                  target={item.externalLink ? '_blank' : undefined}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-red dark:text-brand-gold hover:text-brand-navy dark:hover:text-white uppercase tracking-wider transition-colors duration-200"
                >
                  <span>Read Article</span>
                  <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* ── List View Layout ── */}
        {layout === 'list' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {newsItems.map((item, idx) => {
              const { day, month } = getDateParts(item.publishedAt)
              return (
                <Link
                  key={idx}
                  href={item.externalLink || `/news/${item.slug || ''}`}
                  target={item.externalLink ? '_blank' : undefined}
                  className="flex gap-4 md:gap-6 items-start bg-slate-50/50 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 md:p-6 rounded-2xl group shadow-2xs hover:shadow-xs transition-all duration-300"
                >
                  {/* Date Badge Left */}
                  <div className="w-14 md:w-16 h-14 md:h-16 rounded-xl flex-shrink-0 bg-brand-navy dark:bg-slate-800 text-white flex flex-col items-center justify-center font-mono">
                    <span className="text-lg md:text-xl font-bold tracking-tight">{day}</span>
                    <span className="text-[9px] md:text-[10px] font-semibold text-slate-300 tracking-wider mt-0.5">{month}</span>
                  </div>

                  {/* Body Info Right */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn('px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-md', getTagBadgeStyles(item.tag))}>
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide group-hover:text-brand-red dark:group-hover:text-brand-gold transition-colors duration-200 line-clamp-1 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-slate-650 dark:text-slate-400 text-xs md:text-sm leading-relaxed line-clamp-2">
                      {item.excerpt}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* View All Footer Callout */}
        {viewAllEnabled && (
          <div className={cn('mt-12 md:mt-16', layout === 'list' ? 'text-center' : alignmentClass)}>
            <Link
              href={viewAllUrl || '/news'}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-navy dark:border-slate-700 hover:border-brand-red dark:hover:border-brand-gold rounded-xl font-semibold text-sm text-brand-navy dark:text-white hover:text-brand-red dark:hover:text-brand-gold shadow-2xs hover:shadow-xs transition-all duration-200 group"
            >
              <span>{viewAllLabel}</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
