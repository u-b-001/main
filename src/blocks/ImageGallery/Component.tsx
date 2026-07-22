'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/utilities/ui'
import CircularGallery from '@/components/ui/CircularGallery'
import { MagicBento } from '@/components/MagicBento'

type MediaDoc = { url: string; alt?: string } | string

type ManualImage = { image: MediaDoc; caption?: string }
type GalleryDoc = { id: string; image?: MediaDoc; caption?: string; title?: string }

type ImageGalleryProps = {
  heading?: string
  imageSource?: 'manual' | 'gallery'
  images?: ManualImage[]
  galleryItems?: GalleryDoc[]
  layout?: 'grid' | 'masonry' | 'bento' | 'carousel' | 'circular'
  columns?: '2' | '3' | '4'
  hoverEffect?: 'none' | 'zoom' | 'overlay' | 'lift' | 'grayscale'
  autoplay?: boolean
  autoplaySpeed?: number
  enableViewMore?: boolean
  initialVisibleCount?: number
  circularBend?: number
  circularTextColor?: string
  circularBorderRadius?: number
  bentoHoverColor?: string
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
): ManualImage[] {
  if (imageSource === 'gallery') {
    return galleryItems
      .filter((item): item is GalleryDoc & { image: MediaDoc } => !!item.image)
      .map((item) => ({
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
  autoplay = false,
  autoplaySpeed = 1,
  enableViewMore = false,
  initialVisibleCount = 6,
  circularBend = 3,
  circularTextColor = '#ffffff',
  circularBorderRadius = 0.05,
  bentoHoverColor = '#8400ff',
}) => {
  const allImages = normalizeImages(imageSource, images, galleryItems)
  const [expanded, setExpanded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>(undefined)
  const isHovered = useRef(false)

  useEffect(() => {
    if (layout === 'carousel' && autoplay) {
      const speed = autoplaySpeed || 1
      const animate = () => {
        if (scrollRef.current && !isHovered.current) {
          scrollRef.current.scrollLeft += speed
        }
        requestRef.current = requestAnimationFrame(animate)
      }
      requestRef.current = requestAnimationFrame(animate)

      return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current)
      }
    }
  }, [layout, autoplay, autoplaySpeed])

  const visibleImages =
    enableViewMore && !expanded && layout !== 'carousel' ? allImages.slice(0, initialVisibleCount) : allImages

  const carouselImages = layout === 'carousel' 
    ? Array.from({ length: 40 }).flatMap(() => visibleImages)
    : visibleImages

  // Start in the middle of the cloned lists to allow infinite scrolling in both directions
  useEffect(() => {
    if (layout === 'carousel' && scrollRef.current) {
      const middlePosition = scrollRef.current.scrollWidth / 2
      scrollRef.current.scrollLeft = middlePosition
    }
  }, [layout, visibleImages.length])

  const hasMore = enableViewMore && allImages.length > initialVisibleCount

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      {heading && <h2 className="text-3xl font-bold text-center mb-10">{heading}</h2>}

      {layout === 'circular' ? (
        <div className="w-full h-[600px] relative">
          <CircularGallery
            bend={circularBend ?? 3}
            textColor={circularTextColor || '#ffffff'}
            borderRadius={circularBorderRadius ?? 0.05}
            items={visibleImages.map((img) => {
              const url = typeof img.image === 'object' ? img.image?.url : undefined
              return {
                image: url || '',
                text: img.caption || ''
              }
            })}
          />
        </div>
      ) : layout === 'carousel' ? (
        <div 
          className="relative group/carousel -mx-6 px-6 py-12 -my-12 overflow-hidden"
          onMouseEnter={() => (isHovered.current = true)}
          onMouseLeave={() => (isHovered.current = false)}
        >
          {/* Scroll Container */}
          <div 
            ref={scrollRef}
            className={cn(
              "flex gap-2 overflow-x-auto py-4 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
              !(layout === 'carousel' && autoplay) && "snap-x snap-mandatory"
            )}
          >
            {carouselImages.map((img, i) => {
              const url = typeof img.image === 'object' ? img.image?.url : undefined
              const alt = typeof img.image === 'object' ? img.image?.alt : ''

              return (
                <figure
                  key={i}
                  className="relative flex-none w-[80vw] sm:w-[400px] h-[300px] snap-center rounded-lg group cursor-pointer transition-all duration-500 hover:scale-[1.15] hover:z-20 hover:shadow-2xl"
                >
                  {url && (
                    <Image
                      src={url}
                      alt={alt || img.caption || ''}
                      fill
                      className="object-cover rounded-lg"
                    />
                  )}
                  {hoverEffect === 'overlay' && img.caption && (
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm p-4">{img.caption}</p>
                    </div>
                  )}
                </figure>
              )
            })}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-brand-navy rounded-full flex items-center justify-center shadow-md opacity-100 transition-opacity z-30 hover:bg-gray-50 text-brand-navy disabled:opacity-0"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-brand-navy rounded-full flex items-center justify-center shadow-md opacity-100 transition-opacity z-30 hover:bg-gray-50 text-brand-navy disabled:opacity-0"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      ) : layout === 'bento' ? (
        <MagicBento 
          cards={visibleImages.map((img) => ({
            title: img.caption,
            image: typeof img.image === 'object' ? img.image?.url : undefined,
            alt: typeof img.image === 'object' ? img.image?.alt : undefined
          }))}
          glowColor={bentoHoverColor}
        />
      ) : (
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
                  layout === 'masonry'
                    ? 'mb-4'
                    : 'w-full h-64'
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
      )}

      {hasMore && layout !== 'carousel' && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-navy dark:border-slate-700 hover:border-brand-red dark:hover:border-brand-gold rounded-xl font-semibold text-sm text-brand-navy dark:text-white hover:text-brand-red dark:hover:text-brand-gold shadow-2xs hover:shadow-xs transition-all duration-200 group"
          >
            <span>{expanded ? 'View Less' : 'View More'}</span>
            <ChevronDown
              size={16}
              className={cn(
                'transition-transform duration-300',
                expanded ? 'rotate-180' : 'group-hover:translate-y-0.5',
              )}
            />
          </button>
        </div>
      )}
    </section>
  )
}
