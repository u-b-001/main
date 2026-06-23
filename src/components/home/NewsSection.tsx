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
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  heading,
  subheading,
  newsItems,
  viewAllLink,
}) => {
  if (!newsItems || newsItems.length === 0) return null

  return (
    <section className="py-16 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-4xl font-bold font-serif text-brand-navy dark:text-white tracking-wide uppercase relative inline-block pb-3">
            {heading}
          </h2>
          <div className="w-12 h-1 bg-brand-red mx-auto mt-2 rounded-full mb-4" />
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
              View All Notifications
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
