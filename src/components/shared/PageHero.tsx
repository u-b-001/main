import React from 'react'
import { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

interface PageHeroProps {
  title: string
  heroImage?: string | number | MediaType | null
}

export const PageHero: React.FC<PageHeroProps> = ({ title, heroImage }) => {
  return (
    <div className="relative w-full h-[280px] md:h-[350px] bg-slate-900 overflow-hidden flex items-center justify-center">
      {/* Background Image Banner */}
      {heroImage && typeof heroImage === 'object' ? (
        <div className="absolute inset-0 w-full h-full">
          <Media
            resource={heroImage}
            className="w-full h-full object-cover opacity-60 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-black/30" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy to-slate-950 opacity-90" />
      )}

      {/* Overlay Text */}
      <div className="relative container mx-auto px-4 text-center z-10">
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-white uppercase tracking-wider drop-shadow-md leading-tight">
          {title}
        </h1>
        <div className="w-16 h-1 bg-brand-red mx-auto mt-4 rounded-full" />
      </div>
    </div>
  )
}
