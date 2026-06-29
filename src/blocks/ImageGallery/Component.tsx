'use client'

import React, { useState } from 'react'
import Image from 'next/image'

type MediaDoc = { url: string; alt?: string } | string

type ManualImage = { image: MediaDoc; caption?: string }
type GalleryDoc = { id: string; image?: MediaDoc; caption?: string; title?: string }

type ImageGalleryProps = {
  heading?: string
  imageSource?: 'manual' | 'gallery'
  images?: ManualImage[]
  galleryItems?: GalleryDoc[]
  layout?: 'grid' | 'masonry'
  columns?: '2' | '3' | '4'
  hoverEffect?: 'none' | 'zoom' | 'overlay' | 'lift' | 'grayscale'
  enableViewMore?: boolean
  initialVisibleCount?: number
}

const colsMap: Record<string, string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-4',
}

const hoverClassMap: Record<string, string> = {
  none: '',
  zoom: 'transition-transform duration-300 group-hover:scale-110',
  lift: 'transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl',
  grayscale: 'transition-all duration-500 grayscale group-hover:grayscale-0',
  overlay: '',
}

// 👇 if Gallery collection field names differ, just edit this mapping
function normalizeImages(
  imageSource: 'manual' | 'gallery' = 'manual',
  images: ManualImage[] = [],
  galleryItems: GalleryDoc[] = [],
) {
  if (imageSource === 'gallery') {
    return galleryItems.map((item) => ({
      image: item.image,
      caption: item.caption || item.title,
    }))
  }
  return images
}

export const ImageGalleryBlock: React.FC<ImageGalleryProps> = ({
  heading,
  imageSource = 'manual',
  images = [],
  galleryItems = [],
  layout = 'grid',
  columns = '3',
  hoverEffect = 'none',
  enableViewMore = false,
  initialVisibleCount = 6,
}) => {
  const allImages = normalizeImages(imageSource, images, galleryItems)
  const [expanded, setExpanded] = useState(false)

  const visibleImages =
    enableViewMore && !expanded ? allImages.slice(0, initialVisibleCount) : allImages

  const hasMore = enableViewMore && allImages.length > initialVisibleCount

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      {heading && <h2 className="text-3xl font-bold text-center mb-10">{heading}</h2>}

      <div
        className={
          layout === 'masonry'
            ? `columns-1 ${colsMap[columns].replace('grid-cols', 'columns')} gap-4`
            : `grid grid-cols-1 ${colsMap[columns]} gap-4`
        }
      >
        {visibleImages.map((img, i) => {
          const url = typeof img.image === 'object' ? img.image?.url : undefined
          const alt = typeof img.image === 'object' ? img.image?.alt : ''

          return (
            <figure
              key={i}
              className={`group relative overflow-hidden rounded-md ${
                layout === 'masonry' ? 'mb-4' : 'w-full h-64'
              }`}
            >
              {url && (
                <Image
                  src={url}
                  alt={alt || img.caption || ''}
                  width={layout === 'masonry' ? 600 : undefined}
                  height={layout === 'masonry' ? 400 : undefined}
                  fill={layout !== 'masonry'}
                  className={`object-cover w-full h-full ${hoverClassMap[hoverEffect]}`}
                />
              )}

              {hoverEffect === 'overlay' && img.caption && (
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm p-3">{img.caption}</p>
                </div>
              )}

              {hoverEffect !== 'overlay' && img.caption && (
                <figcaption className="text-sm text-gray-500 mt-1">{img.caption}</figcaption>
              )}
            </figure>
          )
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="px-6 py-2 rounded-full border border-gray-300 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            {expanded ? 'View Less' : 'View More'}
          </button>
        </div>
      )}
    </section>
  )
}