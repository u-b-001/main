import React from 'react'
import Link from 'next/link'
import type { Service as ServiceType } from '@/payload-types'
import { Media } from '@/components/Media'
import { ArrowRight } from 'lucide-react'

interface ServicesGridProps {
  heading: string
  services: (string | ServiceType)[]
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ heading, services }) => {
  const list = (services || []).filter((s): s is ServiceType => typeof s === 'object')

  if (list.length === 0) return null

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold font-serif text-brand-navy dark:text-white tracking-wide uppercase relative inline-block pb-3">
            {heading}
          </h2>
          <div className="w-12 h-1 bg-brand-red mx-auto mt-2 rounded-full" />
        </div>

        {/* 4-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {list.map((item) => {
            const hasImage = item.image && typeof item.image === 'object'

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-350 border border-gray-100 dark:border-slate-800 flex flex-col group hover:-translate-y-1.5"
              >
                {/* Image top */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  {hasImage && (
                    <Media
                      resource={item.image}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-serif font-bold text-lg text-brand-navy dark:text-white mb-3 group-hover:text-brand-red transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-brand-text dark:text-slate-400 mb-6 leading-relaxed flex-grow">
                    {item.excerpt}
                  </p>
                  
                  {/* Read More button */}
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-brand-navy dark:text-slate-200 hover:text-brand-red transition-colors group/link mt-auto uppercase"
                  >
                    Read More
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
