'use client'

import React, { useState } from 'react'
import type { Gallery as GalleryType } from '@/payload-types'
import { Media } from '@/components/Media'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface GalleryArchiveClientProps {
  items: GalleryType[]
}

export const GalleryArchiveClient: React.FC<GalleryArchiveClientProps> = ({ items }) => {
  const [selectedAlbum, setSelectedAlbum] = useState<string>('ALL')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400 font-serif italic">
        No gallery items found.
      </div>
    )
  }

  // Extract unique albums (filter out blank ones)
  const uniqueAlbums = Array.from(
    new Set(
      items
        .map((item) => item.album)
        .filter((album): album is string => Boolean(album))
    )
  )

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedAlbum === 'ALL') return true
    return item.album === selectedAlbum
  })

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const handleCloseLightbox = () => {
    setLightboxIndex(null)
  }

  const handlePrevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length)
  }

  const handleNextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => (prev! + 1) % filteredItems.length)
  }

  const currentLightboxImage = lightboxIndex !== null ? filteredItems[lightboxIndex] : null

  return (
    <div className="space-y-8">
      {/* Album Filters */}
      {uniqueAlbums.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-6">
          <button
            onClick={() => setSelectedAlbum('ALL')}
            className={cn(
              'px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer',
              selectedAlbum === 'ALL'
                ? 'bg-brand-navy border-brand-navy text-white dark:bg-slate-200 dark:border-slate-200 dark:text-slate-900 shadow-sm'
                : 'bg-white border-gray-200 text-slate-600 hover:text-brand-navy hover:border-brand-navy dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 dark:hover:text-slate-100'
            )}
          >
            All Albums
          </button>
          {uniqueAlbums.map((album) => (
            <button
              key={album}
              onClick={() => setSelectedAlbum(album)}
              className={cn(
                'px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer',
                selectedAlbum === album
                  ? 'bg-brand-navy border-brand-navy text-white dark:bg-slate-200 dark:border-slate-200 dark:text-slate-900 shadow-sm'
                  : 'bg-white border-gray-200 text-slate-600 hover:text-brand-navy hover:border-brand-navy dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 dark:hover:text-slate-100'
              )}
            >
              {album}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => {
          const hasImage = item.image && typeof item.image === 'object'

          return (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(index)}
              className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-xs hover:shadow-lg cursor-pointer border border-gray-150 dark:border-slate-850"
            >
              {hasImage && (
                <Media
                  resource={item.image}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              {/* Overlay Hover */}
              <div className="absolute inset-0 bg-brand-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <Maximize2 className="absolute top-4 right-4 w-5 h-5 text-white/80" />
                <span className="font-serif font-bold text-sm truncate">
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
    </div>
  )
}
