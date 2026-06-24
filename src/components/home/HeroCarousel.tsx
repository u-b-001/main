'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface Slide {
  image: string | MediaType
  alt?: string | null
  link?: string | null
  imageAlignment?: 'center' | 'top' | 'bottom' | 'left' | 'right' | null
  overlayOpacity?: 'none' | 'light' | 'medium' | 'dark' | 'extraDark' | null
  textAlignment?: 'left' | 'center' | 'right' | null
  title?: string | null
  subtitle?: string | null
  buttonLabel?: string | null
  buttonLink?: string | null
  id?: string | null
}

interface HeroCarouselProps {
  slides: Slide[]
  height?: 'short' | 'medium' | 'tall' | 'fullscreen' | null
  layout?: 'fullWidth' | 'boxed' | null
  autoplay?: boolean
  autoplayInterval?: number
  imageOpacity?: '100' | '90' | '80' | '70' | '60' | '50' | null
}

const opacityClasses = {
  '100': 'opacity-100',
  '90': 'opacity-90',
  '80': 'opacity-80',
  '70': 'opacity-70',
  '60': 'opacity-60',
  '50': 'opacity-50',
}

const heightClasses = {
  short: 'h-[300px] sm:h-[380px] md:h-[450px]',
  medium: 'h-[380px] sm:h-[480px] md:h-[580px]',
  tall: 'h-[450px] sm:h-[580px] md:h-[700px]',
  fullscreen: 'h-[calc(100vh-96px)] lg:h-[calc(100vh-104px)]',
}

const getObjectPositionClass = (alignment?: string | null) => {
  switch (alignment) {
    case 'top':
      return 'object-top'
    case 'bottom':
      return 'object-bottom'
    case 'left':
      return 'object-left'
    case 'right':
      return 'object-right'
    case 'center':
    default:
      return 'object-center'
  }
}

const getTextAlignmentClass = (alignment?: string | null) => {
  switch (alignment) {
    case 'center':
      return 'text-center items-center'
    case 'right':
      return 'text-right items-end'
    case 'left':
    default:
      return 'text-left items-start'
  }
}

const getOverlayOpacityClass = (opacity?: string | null) => {
  switch (opacity) {
    case 'none':
      return 'bg-transparent'
    case 'light':
      return 'bg-black/20'
    case 'dark':
      return 'bg-black/60'
    case 'extraDark':
      return 'bg-black/80'
    case 'medium':
    default:
      return 'bg-black/40'
  }
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  height = 'medium',
  layout = 'fullWidth',
  autoplay = true,
  autoplayInterval = 5000,
  imageOpacity = '100',
}) => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1 || !autoplay) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, autoplayInterval)
    return () => clearInterval(timer)
  }, [slides.length, autoplay, autoplayInterval])

  if (!slides || slides.length === 0) return null

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length)
  }

  const carouselHtml = (
    <div
      className={cn(
        'relative w-full overflow-hidden group transition-all duration-500 bg-slate-900',
        heightClasses[height || 'medium'],
        layout === 'boxed' ? 'rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800' : '',
      )}
    >
      {/* Slides */}
      {slides.map((slide, idx) => {
        const isCurrent = idx === activeIndex
        const img = slide.image

        return (
          <div
            key={slide.id || idx}
            className={cn(
              'absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out',
              isCurrent ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95 pointer-events-none',
            )}
          >
            {/* Background Image Container */}
            <div className="absolute inset-0 w-full h-full">
              {img && typeof img === 'object' && (
                <Media
                  resource={img}
                  className={cn(
                    'w-full h-full transition-opacity duration-500',
                    opacityClasses[imageOpacity || '100'],
                  )}
                  imgClassName={cn(
                    'w-full h-full object-cover transition-transform duration-[8000ms] ease-out',
                    isCurrent ? 'scale-105' : 'scale-100',
                    getObjectPositionClass(slide.imageAlignment),
                  )}
                />
              )}
              {/* Opacity mask */}
              <div
                className={cn(
                  'absolute inset-0 transition-colors duration-500',
                  getOverlayOpacityClass(slide.overlayOpacity),
                )}
              />
              {/* Soft bottom fade gradient for overlay typography reading */}
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none z-10" />
            </div>

            {/* Slide Content Overlay */}
            {(slide.title || slide.subtitle || (slide.buttonLabel && slide.buttonLink)) && (
              <div
                className={cn(
                  'absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 select-none transition-all duration-700 delay-300',
                  getTextAlignmentClass(slide.textAlignment),
                  isCurrent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
                )}
              >
                <div className="max-w-3xl space-y-4">
                  {slide.title && (
                    <h2 className="font-serif font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                      {slide.title}
                    </h2>
                  )}
                  {slide.subtitle && (
                    <p className="text-sm sm:text-base md:text-lg text-slate-100 font-sans leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] max-w-2xl">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.buttonLabel && slide.buttonLink && (
                    <div className="pt-3">
                      {slide.link ? (
                        // If whole slide is already a link, we just present it as a styled button-like element without nesting anchors
                        <span className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold tracking-wide bg-brand-red text-white transition-all duration-200 shadow-md">
                          {slide.buttonLabel}
                        </span>
                      ) : (
                        <Link
                          href={slide.buttonLink}
                          className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold tracking-wide bg-brand-red text-white hover:bg-brand-red-dark hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          {slide.buttonLabel}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Fallback whole slide clickable link if content buttons are not present */}
            {slide.link && !slide.buttonLink && (
              <Link href={slide.link} className="absolute inset-0 z-30 cursor-pointer" />
            )}
          </div>
        )
      })}

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/30 text-white hover:bg-brand-red opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-hidden hover:scale-110 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/30 text-white hover:bg-brand-red opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-hidden hover:scale-110 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'h-2.5 rounded-full transition-all duration-350 focus:outline-hidden cursor-pointer',
                idx === activeIndex ? 'bg-brand-red w-8 shadow-md' : 'bg-white/50 hover:bg-white w-2.5',
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )

  if (layout === 'boxed') {
    return <div className="container mx-auto px-4 py-8 lg:py-12">{carouselHtml}</div>
  }

  return carouselHtml
}
