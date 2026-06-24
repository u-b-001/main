import React from 'react'
import Link from 'next/link'
import type { News as NewsType } from '@/payload-types'
import { NewsCard } from '../shared/NewsCard'
import { ArrowRight } from 'lucide-react'

interface NewsSectionProps {
  heading: string
  subheading?: string
  newsItems: NewsType[]
  viewAllLink: string
  headingAlignment?: 'left' | 'center' | 'right'
  headingSize?: 'small' | 'medium' | 'large'
  backgroundColor?: 'white' | 'slate' | 'cream'
  showUnderline?: boolean
  viewAllLabel?: string
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  heading,
  subheading,
  newsItems,
  viewAllLink,
  headingAlignment = 'center',
  headingSize = 'medium',
  backgroundColor = 'white',
  showUnderline = true,
  viewAllLabel = 'View All Notifications',
}) => {
  if (!newsItems || newsItems.length === 0) return null

  // Sizing styles mapping
  const sizeClasses = {
    small: 'text-xl md:text-2xl',
    medium: 'text-2xl md:text-4xl',
    large: 'text-3xl md:text-5xl',
  }

  // Alignment styles mapping
  const alignClass = headingAlignment === 'left' ? 'text-left' : headingAlignment === 'right' ? 'text-right' : 'text-center'
  const wrapperAlignClass = headingAlignment === 'left' ? 'ml-0 mr-auto' : headingAlignment === 'right' ? 'mr-0 ml-auto' : 'mx-auto'
  const underlineAlignClass = headingAlignment === 'left' ? 'mr-auto ml-0' : headingAlignment === 'right' ? 'ml-auto mr-0' : 'mx-auto'

  // Background style mapping
  const bgClasses = {
    white: 'bg-white dark:bg-slate-950',
    slate: 'bg-slate-50 dark:bg-slate-900/50',
    cream: 'bg-brand-cream/40 dark:bg-slate-900/20',
  }

  return (
    <section className={`py-16 bg-pattern ${bgClasses[backgroundColor] || bgClasses.white}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className={`max-w-2xl mb-12 ${alignClass} ${wrapperAlignClass}`}>
          <h2 className={`font-bold font-serif text-brand-navy dark:text-white tracking-wide uppercase relative inline-block pb-3 ${sizeClasses[headingSize]}`}>
            {heading}
          </h2>
          {showUnderline && (
            <div className={`w-12 h-1 bg-brand-red mt-2 rounded-full mb-4 ${underlineAlignClass}`} />
          )}
          {subheading && (
            <p className="text-sm md:text-base text-brand-text dark:text-slate-400 font-serif leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>

        {/* View All Button */}
        {viewAllLink && (
          <div className="text-center mt-12">
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white font-semibold px-8 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 tracking-wide uppercase text-sm cursor-pointer"
            >
              {viewAllLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
