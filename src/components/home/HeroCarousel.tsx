'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
  image: string | MediaType
  alt?: string | null
  link?: string | null
  id?: string | null
}

interface HeroCarouselProps {
  slides: Slide[]
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  if (!slides || slides.length === 0) return null

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length)
  }

  return (
    <div className="relative w-full h-[320px] sm:h-[450px] md:h-[580px] bg-slate-900 overflow-hidden group">
      {/* Slides */}
      {slides.map((slide, idx) => {
        const isCurrent = idx === activeIndex
        const img = slide.image

        const content = (
          <div className="absolute inset-0 w-full h-full">
            {img && typeof img === 'object' && (
              <Media
                resource={img}
                className="w-full h-full object-cover transition-transform duration-[6000ms] ease-out scale-100 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />
          </div>
        )

        return (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {slide.link ? (
              <Link href={slide.link} className="block w-full h-full relative">
                {content}
              </Link>
            ) : (
              <div className="w-full h-full relative">{content}</div>
            )}
          </div>
        )
      })}

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/30 text-white hover:bg-brand-red opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-hidden hover:scale-110"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/30 text-white hover:bg-brand-red opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-hidden hover:scale-110"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-hidden ${
                idx === activeIndex
                  ? 'bg-brand-red w-8 shadow-sm'
                  : 'bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
