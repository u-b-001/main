'use client'

import React, { useState } from 'react'
import type { Gallery as GalleryType } from '@/payload-types'
import { Media } from '@/components/Media'
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react'

interface GallerySectionProps {
  heading: string
  images: GalleryType[]
  displayCount: number
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  heading,
  images,
  displayCount = 8,
}) => {
  const [showAll, setShowAll] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images || images.length === 0) return null

  const itemsToRender = showAll ? images : images.slice(0, displayCount)

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const handleCloseLightbox = () => {
    setLightboxIndex(null)
  }

  const handlePrevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => (prev! - 1 + images.length) % images.length)
  }

  const handleNextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => (prev! + 1) % images.length)
  }

  const currentLightboxImage = lightboxIndex !== null ? images[lightboxIndex] : null

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {itemsToRender.map((item, index) => {
            const hasImage = item.image && typeof item.image === 'object'

            return (
              <div
                key={item.id}
                onClick={() => handleOpenLightbox(index)}
                className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-xs hover:shadow-lg cursor-pointer border border-gray-150 dark:border-slate-800/80"
              >
                {hasImage && (
                  <Media
                    resource={item.image}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                {/* Overlay Hover Effect */}
                <div className="absolute inset-0 bg-brand-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <Maximize2 className="absolute top-4 right-4 w-5 h-5 text-white/80" />
                  <span className="font-serif font-bold text-sm truncate leading-snug">
                    {item.title}
                  </span>
                  {item.album && (
                    <span className="text-[10px] text-brand-gold font-semibold uppercase tracking-wider mt-1">
                      {item.album}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Show More / Show Less Controls */}
        {images.length > displayCount && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1.5 bg-transparent border-2 border-brand-navy dark:border-slate-200 text-brand-navy dark:text-slate-200 font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-navy hover:text-white dark:hover:bg-slate-200 dark:hover:text-slate-900 transition-all duration-200 uppercase text-xs tracking-wider cursor-pointer"
            >
              {showAll ? 'Show Less' : 'View All Images'}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {currentLightboxImage && (
        <div
          className="fixed inset-0 bg-black/95 z-55 flex items-center justify-center p-4 animate-fade-in"
          onClick={handleCloseLightbox}
        >
          {/* Close button */}
          <button
            onClick={handleCloseLightbox}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-800 text-white cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation controls */}
          <button
            onClick={handlePrevLightbox}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/60 hover:bg-slate-800 text-white cursor-pointer hover:scale-105 transition-transform"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextLightbox}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/60 hover:bg-slate-800 text-white cursor-pointer hover:scale-105 transition-transform"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Content */}
          <div
            className="relative max-w-4xl w-full max-h-[80vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {currentLightboxImage.image && typeof currentLightboxImage.image === 'object' && (
              <div className="relative overflow-hidden rounded-lg bg-slate-950 border border-slate-900 shadow-2xl flex items-center justify-center max-h-[70vh] w-auto">
                <Media
                  resource={currentLightboxImage.image}
                  className="max-h-[70vh] max-w-full object-contain"
                />
              </div>
            )}
            
            {/* Title & Metadata */}
            <div className="text-center text-white max-w-lg mt-2">
              <h4 className="font-serif font-bold text-lg leading-snug">
                {currentLightboxImage.title}
              </h4>
              {(currentLightboxImage.album || currentLightboxImage.date) && (
                <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-3">
                  {currentLightboxImage.album && (
                    <span className="font-semibold text-brand-gold uppercase tracking-wider">
                      {currentLightboxImage.album}
                    </span>
                  )}
                  {currentLightboxImage.date && (
                    <span>
                      {new Date(currentLightboxImage.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
