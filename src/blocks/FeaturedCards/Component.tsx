import React from 'react'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
const {
  GraduationCap,
  Globe,
  Calendar,
  Award,
  BookOpen,
  Users,
  Info,
  Star,
  ArrowRight,
} = LucideIcons
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import type { FeaturedCardsBlock as FeaturedCardsProps } from '@/payload-types'

const iconMap = {
  academic: GraduationCap,
  globe: Globe,
  calendar: Calendar,
  award: Award,
  book: BookOpen,
  group: Users,
  info: Info,
  star: Star,
}

const columnClasses = {
  '2': 'grid-cols-1 md:grid-cols-2 gap-8',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
}

const cardThemeClasses = {
  standard: 'bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-xs hover:shadow-md text-slate-800 dark:text-slate-200',
  glassmorphism: 'bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-slate-800/50 shadow-xs hover:shadow-md text-slate-800 dark:text-slate-200',
  navy: 'bg-brand-navy text-white border border-slate-800/20 shadow-md hover:shadow-lg',
  red: 'bg-brand-red text-white border border-red-700/20 shadow-md hover:shadow-lg',
  bordered: 'bg-transparent border-2 border-slate-200 dark:border-slate-800 hover:border-brand-gold/60 text-slate-800 dark:text-slate-200',
}

export const FeaturedCardsComponent: React.FC<FeaturedCardsProps> = ({
  heading,
  subheading,
  columns = '3',
  cardStyle = 'standard',
  cards,
}) => {
  if (!cards || cards.length === 0) return null

  const isLightCardText = cardStyle === 'navy' || cardStyle === 'red'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Headers */}
      {(heading || subheading) && (
        <div className="text-center max-w-2xl mx-auto mb-12">
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-brand-navy dark:text-white mb-4 uppercase tracking-wide">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
              {subheading}
            </p>
          )}
          <div className="w-16 h-1 bg-brand-red mx-auto mt-4 rounded-full" />
        </div>
      )}

      {/* Grid of Cards */}
      <div className={cn('grid', columnClasses[columns || '3'])}>
        {cards.map((card, idx) => {
          const IconComponent = card.icon && card.icon !== 'none' 
            ? (iconMap[card.icon as keyof typeof iconMap] || (LucideIcons as any)[card.icon]) 
            : null
          const hasImage = card.image && typeof card.image === 'object'

          return (
            <div
              key={idx}
              className={cn(
                'group flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1',
                cardThemeClasses[cardStyle || 'standard']
              )}
            >
              {/* Optional Top Image */}
              {hasImage && (
                <div className="w-full h-48 overflow-hidden relative">
                  <Media
                    resource={card.image}
                    fill
                    className="w-full h-full"
                    imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {card.tag && (
                    <span className="absolute top-4 right-4 bg-brand-red text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                      {card.tag}
                    </span>
                  )}
                </div>
              )}

              {/* Card Body */}
              <div className="p-6 md:p-8 flex flex-col flex-grow justify-between relative">
                <div>
                  {/* Badge (if no top image) */}
                  {!hasImage && card.tag && (
                    <div className="mb-4">
                      <span className="bg-brand-red/10 dark:bg-brand-red/20 text-brand-red dark:text-red-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {card.tag}
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  {IconComponent && (
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 shadow-xs',
                        isLightCardText
                          ? 'bg-white/10 text-brand-gold'
                          : 'bg-brand-navy/5 text-brand-navy dark:bg-white/5 dark:text-brand-gold'
                      )}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                  )}

                  {/* Title */}
                  <h3
                    className={cn(
                      'text-lg md:text-xl font-bold font-serif mb-3 tracking-wide uppercase',
                      isLightCardText ? 'text-white' : 'text-brand-navy dark:text-white'
                    )}
                  >
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={cn(
                      'text-sm leading-relaxed mb-6 flex-grow',
                      isLightCardText ? 'text-white/80' : 'text-slate-600 dark:text-slate-400'
                    )}
                  >
                    {card.description}
                  </p>
                </div>

                {/* Card CTA Link */}
                {card.link && (
                  <div className="pt-2">
                    <Link
                      href={card.link}
                      className={cn(
                        'inline-flex items-center text-xs font-bold uppercase tracking-wider transition-colors duration-250',
                        isLightCardText
                          ? 'text-brand-gold hover:text-white'
                          : 'text-brand-red hover:text-brand-navy dark:hover:text-white'
                      )}
                    >
                      <span>{card.linkLabel || 'Learn More'}</span>
                      <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
