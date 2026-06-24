import React from 'react'
import Link from 'next/link'
import type { Service as ServiceType } from '@/payload-types'
import { Media } from '@/components/Media'
import { ArrowRight } from 'lucide-react'

interface ServicesGridProps {
  heading: string
  services: (string | ServiceType)[]
  headingAlignment?: 'left' | 'center' | 'right'
  headingSize?: 'small' | 'medium' | 'large'
  backgroundColor?: 'white' | 'slate' | 'cream'
  showUnderline?: boolean
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  heading,
  services,
  headingAlignment = 'center',
  headingSize = 'medium',
  backgroundColor = 'slate',
  showUnderline = true,
}) => {
  const list = (services || []).filter((s): s is ServiceType => typeof s === 'object')

  if (list.length === 0) return null

  // Sizing styles mapping
  const sizeClasses = {
    small: 'text-xl md:text-2xl',
    medium: 'text-2xl md:text-4xl',
    large: 'text-3xl md:text-5xl',
  }

  // Alignment styles mapping
  const alignClass = headingAlignment === 'left' ? 'text-left' : headingAlignment === 'right' ? 'text-right' : 'text-center'
  const underlineAlignClass = headingAlignment === 'left' ? 'mr-auto ml-0' : headingAlignment === 'right' ? 'ml-auto mr-0' : 'mx-auto'

  // Background style mapping
  const bgClasses = {
    white: 'bg-white dark:bg-slate-950',
    slate: 'bg-slate-50 dark:bg-slate-900/50',
    cream: 'bg-brand-cream/40 dark:bg-slate-900/20',
  }

  return (
    <section className={`py-16 bg-pattern ${bgClasses[backgroundColor] || bgClasses.slate}`}>
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className={`${alignClass} mb-12`}>
          <h2 className={`font-bold font-serif text-brand-navy dark:text-white tracking-wide uppercase relative inline-block pb-3 ${sizeClasses[headingSize]}`}>
            {heading}
          </h2>
          {showUnderline && (
            <div className={`w-12 h-1 bg-brand-red mt-2 rounded-full ${underlineAlignClass}`} />
          )}
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
                      fill
                      className="w-full h-full"
                      imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
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
