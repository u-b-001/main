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

                  {/* Status Badge */}
                  {card.status && (
                    <div className="mb-3">
                      <span className={cn(
                        "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full",
                        card.status === 'completed'
                          ? "bg-emerald-50 text-emerald-650 dark:bg-emerald-950/30 dark:text-emerald-500"
                          : card.status === 'ongoing'
                          ? "bg-blue-50 text-blue-650 dark:bg-blue-950/30 dark:text-blue-500"
                          : "bg-amber-50 text-amber-650 dark:bg-amber-950/30 dark:text-amber-500"
                      )}>
                        {card.status}
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

                  {/* Progress bar */}
                  {card.progress && (
                    <div className="mb-6">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className={isLightCardText ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}>Progress</span>
                        <span className={isLightCardText ? 'text-white' : 'text-slate-800 dark:text-slate-200'}>{card.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${card.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Feature Points list */}
                  {card.featurePoints && card.featurePoints.length > 0 && (
                    <ul className="mb-6 space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                      {card.featurePoints.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 text-sm">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span className={isLightCardText ? 'text-white/80' : 'text-slate-600 dark:text-slate-400'}>
                            {pt.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Training Info section */}
                  {(card.level || card.duration || card.mode || card.audience || card.date) && (
                    <div className="grid grid-cols-2 gap-3 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                      {card.level && (
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <GraduationCap size={14} className="text-brand-navy dark:text-brand-gold" />
                          <span><strong className="text-slate-700 dark:text-slate-300">Level:</strong> {card.level}</span>
                        </div>
                      )}
                      {card.duration && (
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Calendar size={14} className="text-brand-navy dark:text-brand-gold" />
                          <span><strong className="text-slate-700 dark:text-slate-300">Duration:</strong> {card.duration}</span>
                        </div>
                      )}
                      {card.mode && (
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Info size={14} className="text-brand-navy dark:text-brand-gold" />
                          <span><strong className="text-slate-700 dark:text-slate-300">Mode:</strong> {card.mode}</span>
                        </div>
                      )}
                      {card.audience && (
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Users size={14} className="text-brand-navy dark:text-brand-gold" />
                          <span><strong className="text-slate-700 dark:text-slate-300">Audience:</strong> {card.audience}</span>
                        </div>
                      )}
                      {card.date && (
                        <div className="flex items-center gap-1.5 col-span-2 text-slate-500 dark:text-slate-400">
                          <Calendar size={14} className="text-brand-navy dark:text-brand-gold" />
                          <span>
                            <strong className="text-slate-700 dark:text-slate-300">Next Batch:</strong> {new Date(card.date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card CTA Link */}
                {card.buttonUrl && (
                  <div className="pt-2">
                    <Link
                      href={card.buttonUrl}
                      target={card.externalLink ? '_blank' : undefined}
                      className={cn(
                        'inline-flex items-center text-xs font-bold uppercase tracking-wider transition-colors duration-250',
                        isLightCardText
                          ? 'text-brand-gold hover:text-white'
                          : 'text-brand-red hover:text-brand-navy dark:hover:text-white'
                      )}
                    >
                      <span>{card.buttonLabel || 'View More'}</span>
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
