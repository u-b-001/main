import React from 'react'
import { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

interface PageHeroProps {
  title: string
  heroImage?: string | number | MediaType | null
  heroStyle?: 'none' | 'small' | 'medium' | 'large' | null
}

const heightClasses = {
  small: 'h-[160px] md:h-[220px]',
  medium: 'h-[280px] md:h-[350px]',
  large: 'h-[400px] md:h-[500px]',
}

export const PageHero: React.FC<PageHeroProps> = ({ title, heroImage, heroStyle = 'medium' }) => {
  if (heroStyle === 'none') {
    return (
      <div className="container mx-auto px-4 pt-10 pb-6 border-b border-slate-100 dark:border-slate-800">
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-brand-navy dark:text-white leading-tight uppercase tracking-wide">
          {title}
        </h1>
        <div className="w-12 h-1 bg-brand-red mt-3 rounded-full" />
      </div>
    )
  }

  const heightClass = heightClasses[heroStyle || 'medium']

  return (
    <div
      className={cn(
        'relative w-full bg-slate-900 overflow-hidden flex items-center justify-center transition-all duration-300',
        heightClass,
      )}
    >
      {/* Background Image Banner */}
      {heroImage && typeof heroImage === 'object' ? (
        <div className="absolute inset-0 w-full h-full">
          <Media
            resource={heroImage}
            className="w-full h-full"
            imgClassName="w-full h-full object-cover opacity-60 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-black/30" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy to-slate-950 opacity-90" />
      )}

      {/* Overlay Text */}
      <div className="relative container mx-auto px-4 text-center z-10">
        <h1
          className={cn(
            'font-bold font-serif text-white uppercase tracking-wider drop-shadow-md leading-tight transition-all duration-300',
            heroStyle === 'small' ? 'text-2xl md:text-3xl' : 'text-3xl md:text-5xl',
          )}
        >
          {title}
        </h1>
        <div
          className={cn(
            'bg-brand-red mx-auto rounded-full transition-all duration-300',
            heroStyle === 'small' ? 'w-10 h-0.5 mt-2' : 'w-16 h-1 mt-4',
          )}
        />
      </div>
    </div>
  )
}
