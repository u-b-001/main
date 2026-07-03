'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import * as LucideIcons from 'lucide-react'

import { Media } from '@/components/Media'

type FeatureTag = { icon?: string; text: string }
type HeroButton = { label: string; url: string; variant?: 'primary' | 'secondary' | 'outline'; icon?: string }
type Slide = any
type CarouselSettings = any
type OverlaySettings = any
type ConstantOverlay = any
type QuickAccessBar = any

export type HeroBlockProps = {
  mode?: 'single' | 'carousel'
  layout?: 'fullWidth' | 'fullscreenOverlayCarousel' | 'mosiaFullscreen' | 'split' | 'contained'
  splitDirection?: 'textLeft' | 'textRight'
  splitTheme?: 'dark' | 'light'
  splitTextBehavior?: 'static' | 'slide'
  splitFeatures?: FeatureTag[]
  height?: number
  textAlignment?: 'left' | 'center' | 'right' | 'justify'
  textVerticalPosition?: 'top' | 'center' | 'bottom'
  contentMaxWidth?: number
  contentPaddingX?: number
  contentPaddingY?: number
  constantOverlayContent?: boolean
  constantOverlay?: ConstantOverlay
  overlay?: OverlaySettings
  headerGlass?: any
  carouselSettings?: CarouselSettings
  singleSlide?: Slide
  slides?: Slide[]
  mosiaFloatingCard?: any
  mosiaShowSlideCounter?: boolean
  mosiaShowPlayPause?: boolean
  quickAccessBar?: QuickAccessBar
}

function hexToRgba(hex: string, opacity: number) {
  if (!hex) return 'rgba(0,0,0,0)'
  const r = parseInt(hex.slice(1, 3), 16) || 0
  const g = parseInt(hex.slice(3, 5), 16) || 0
  const b = parseInt(hex.slice(5, 7), 16) || 0
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
}

function alignmentClasses(align?: 'left' | 'center' | 'right' | 'justify') {
  if (align === 'right') return 'text-right items-end'
  if (align === 'left') return 'text-left items-start'
  if (align === 'justify') return 'text-justify items-start'
  return 'text-center items-center mx-auto'
}

function verticalClasses(val?: 'top' | 'center' | 'bottom') {
  if (val === 'top') return 'items-start'
  if (val === 'bottom') return 'items-end'
  return 'items-center'
}

function SlideMedia({ slide, priority }: { slide: any; priority?: boolean }) {
  if (!slide) return null
  const mediaType = slide.mediaType || 'image'

  if (mediaType === 'image') {
    return (
      <Media
        resource={slide.image}
        priority={priority}
        fill
        imgClassName="object-cover"
        className="w-full h-full"
      />
    )
  }

  if (mediaType === 'video') {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
        poster={typeof slide.videoPoster === 'object' ? slide.videoPoster?.url : slide.videoPoster}
      >
        <source src={slide.videoUrl} type="video/mp4" />
      </video>
    )
  }

  if (mediaType === 'externalVideo') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <iframe
          src={slide.externalVideoUrl}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-[177.78vh] h-[56.25vw] max-w-none max-h-none border-0"
          style={{ aspectRatio: '16/9' }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (mediaType === 'animation') {
    return <img src={slide.animationUrl} className="h-full w-full object-contain" alt="" />
  }

  if (mediaType === 'dataViz') {
    if (!slide.dataVizEmbed) return null
    return (
      <div
        className="absolute inset-0 h-full w-full overflow-hidden"
        dangerouslySetInnerHTML={{ __html: slide.dataVizEmbed }}
      />
    )
  }

  return null
}

/* ────────────────────────────────────────────────────────────────────────
   Text overlay block (heading / subtitle / buttons) — shared by layouts
   ──────────────────────────────────────────────────────────────────────── */

function isUrl(str?: string) {
  if (!str) return false
  return str.startsWith('/') || str.startsWith('http://') || str.startsWith('https://')
}

function TextBlock({
  eyebrowText,
  heading,
  headingColor,
  subtitle,
  subtitleColor,
  buttons,
  align,
}: {
  eyebrowText?: string
  heading?: string
  headingColor?: string
  subtitle?: string
  subtitleColor?: string
  buttons?: HeroButton[]
  align?: 'left' | 'center' | 'right' | 'justify'
}) {
  return (
    <div className={`flex flex-col gap-4 ${alignmentClasses(align)}`}>
      {eyebrowText && (
        <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
          {eyebrowText}
        </span>
      )}
      <h1
        className="text-4xl md:text-6xl font-bold max-w-3xl relative z-10"
        style={headingColor ? { color: headingColor } : undefined}
      >
        {heading}
      </h1>
      {subtitle && (
        <p
          className="mt-4 text-lg text-gray-300 max-w-2xl relative z-10"
          style={subtitleColor ? { color: subtitleColor } : undefined}
        >
          {subtitle}
        </p>
      )}
      {buttons && buttons.length > 0 && (
        <div className="mt-8 flex gap-4 relative z-10 flex-wrap">
          {buttons.map((btn, i) => {
            const buttonStyle: React.CSSProperties = {}
            if (btn.backgroundColor) {
              buttonStyle.backgroundColor = btn.backgroundColor
            }
            if (btn.textColor) {
              buttonStyle.color = btn.textColor
            }

            // Determine default classes based on variant
            let defaultClasses = ''
            if (btn.variant === 'secondary') {
              defaultClasses = 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            } else if (btn.variant === 'outline') {
              defaultClasses = 'border-2 border-white/80 text-white hover:bg-white hover:text-black'
            } else {
              defaultClasses = 'bg-brand-red text-white hover:bg-brand-red/90'
            }

            // If custom colors are provided, override default classes
            const customClasses = btn.backgroundColor || btn.textColor ? '' : defaultClasses
            const hasUrlLabel = isUrl(btn.label)

            return (
              <Link
                key={`${btn.label}-${i}`}
                href={btn.url || '#'}
                className={`inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${customClasses}`}
                style={buttonStyle}
              >
                {btn.icon && <HeroIcon name={btn.icon} className="h-4 w-4 shrink-0" />}
                {!hasUrlLabel && btn.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function FeatureTags({ features }: { features?: FeatureTag[] }) {
  if (!features || features.length === 0) return null
  return (
    <div className="mt-4 flex flex-wrap gap-4">
      {features.map((f, i) => {
        const style: React.CSSProperties = {}
        if (f.color) {
          style.color = f.color
        }

        return (
          <div
            key={`${f.text}-${i}`}
            className={cn("flex items-center gap-2 text-sm", f.color ? "" : "opacity-80")}
            style={style}
          >
            {f.icon ? (
              <HeroIcon name={f.icon} className="h-4 w-4 shrink-0" />
            ) : (
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: f.color || 'currentColor' }}
              />
            )}
            <span>{f.text}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Carousel controller hook — shared by all carousel-capable layouts
   ──────────────────────────────────────────────────────────────────────── */

function useCarousel(count: number, settings?: CarouselSettings) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(settings?.autoPlay !== false)

  useEffect(() => {
    if (!playing || count <= 1) return
    const interval = Math.max(1000, settings?.autoPlayInterval ?? 5000)
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % count)
    }, interval)
    return () => clearInterval(timer)
  }, [playing, count, settings?.autoPlayInterval])

  const goTo = (i: number) => setIndex(((i % count) + count) % count)
  const next = () => goTo(index + 1)
  const prev = () => goTo(index - 1)
  const togglePlay = () => setPlaying((p) => !p)

  return { index, goTo, next, prev, playing, togglePlay }
}

/* ────────────────────────────────────────────────────────────────────────
   Overlay (color wash on top of media)
   ──────────────────────────────────────────────────────────────────────── */

function MediaOverlay({ overlay }: { overlay?: OverlaySettings }) {
  if (!overlay || overlay.enabled === false) return null
  return (
    <div
      className="absolute inset-0"
      style={{ backgroundColor: hexToRgba(overlay.color, overlay.opacity) }}
    />
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Layout: Full-Width Background
   ──────────────────────────────────────────────────────────────────────── */

function FullWidthHero(props: HeroBlockProps) {
  const isCarousel = props.mode === 'carousel'
  const slides = isCarousel ? props.slides || [] : props.singleSlide ? [props.singleSlide] : []
  const { index, goTo, next, prev } = useCarousel(slides.length, props.carouselSettings)
  const activeSlide = slides[index] || {}

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col"
      style={{ minHeight: props.height ? `${props.height}px` : '600px' }}
    >
      <div className="absolute inset-0">
        <SlideMedia slide={activeSlide} priority />
      </div>
      <MediaOverlay overlay={props.overlay} />
      {activeSlide.showText !== false && (
        <div
          className={`relative z-10 flex flex-1 w-full ${verticalClasses(props.textVerticalPosition)}`}
        >
          <div
            className="mx-auto w-full"
            style={{
              maxWidth: props.contentMaxWidth ? `${props.contentMaxWidth}px` : '1200px',
              paddingLeft: props.contentPaddingX ? `${props.contentPaddingX}px` : '24px',
              paddingRight: props.contentPaddingX ? `${props.contentPaddingX}px` : '24px',
              paddingTop: props.contentPaddingY ? `${props.contentPaddingY}px` : '32px',
              paddingBottom: props.contentPaddingY ? `${props.contentPaddingY}px` : '32px',
            }}
          >
            <TextBlock
              eyebrowText={activeSlide.eyebrowText}
              heading={activeSlide.heading}
              headingColor={activeSlide.headingColor}
              subtitle={activeSlide.subtitle}
              subtitleColor={activeSlide.subtitleColor}
              buttons={activeSlide.buttons}
              align={props.textAlignment}
            />
          </div>
        </div>
      )}
      {isCarousel && slides.length > 1 && (
        <CarouselControls
          count={slides.length}
          activeIndex={index}
          settings={props.carouselSettings}
          onGoTo={goTo}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Carousel arrows + dots (shared visual chrome)
   ──────────────────────────────────────────────────────────────────────── */

function CarouselControls({
  count,
  activeIndex,
  settings,
  onGoTo,
  onPrev,
  onNext,
}: {
  count: number
  activeIndex: number
  settings?: CarouselSettings
  onGoTo?: (i: number) => void
  onPrev?: () => void
  onNext?: () => void
}) {
  return (
    <>
      {settings?.showArrows !== false && onPrev && onNext && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={onPrev}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={onNext}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}
      {settings?.showDots !== false && onGoTo && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {Array.from({ length: count }).map((_: unknown, i: number) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => onGoTo(i)}
              className={`h-2 w-2 rounded-full transition-all ${
                i === activeIndex ? 'w-6 bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Layout: Fullscreen Overlay Carousel
   ──────────────────────────────────────────────────────────────────────── */

function FullscreenOverlayCarouselHero(props: HeroBlockProps) {
  const isCarousel = props.mode === 'carousel'
  const slides = isCarousel ? props.slides || [] : props.singleSlide ? [props.singleSlide] : []
  const { index, goTo, next, prev } = useCarousel(slides.length, props.carouselSettings)
  const activeSlide = slides[index] || {}

  const useConstantOverlay = isCarousel && props.constantOverlayContent && props.constantOverlay
  const textSource: Slide | ConstantOverlay = useConstantOverlay
    ? props.constantOverlay || {}
    : activeSlide

  const glass = props.headerGlass

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col"
      style={{ minHeight: props.height ? `${props.height}px` : '600px' }}
    >
      <div className="absolute inset-0">
        <SlideMedia slide={activeSlide} priority />
      </div>
      <MediaOverlay overlay={props.overlay} />

      {textSource.showText !== false && (
        <div
          className={`relative z-10 flex flex-1 w-full ${verticalClasses(props.textVerticalPosition)}`}
        >
          <div
            className="mx-auto w-full"
            style={{
              maxWidth: props.contentMaxWidth ? `${props.contentMaxWidth}px` : '1200px',
              paddingLeft: props.contentPaddingX ? `${props.contentPaddingX}px` : '24px',
              paddingRight: props.contentPaddingX ? `${props.contentPaddingX}px` : '24px',
              paddingTop: props.contentPaddingY ? `${props.contentPaddingY}px` : '32px',
              paddingBottom: props.contentPaddingY ? `${props.contentPaddingY}px` : '32px',
            }}
          >
            <TextBlock
              eyebrowText={'eyebrowText' in textSource ? textSource.eyebrowText : undefined}
              heading={textSource.heading}
              headingColor={textSource.headingColor}
              subtitle={textSource.subtitle}
              subtitleColor={textSource.subtitleColor}
              buttons={textSource.buttons}
              align={props.textAlignment}
            />
          </div>
        </div>
      )}

      {isCarousel && slides.length > 1 && (
        <CarouselControls
          count={slides.length}
          activeIndex={index}
          settings={props.carouselSettings}
          onGoTo={goTo}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Layout: Fullscreen Overlay (Split + Floating Card) — "mosiaFullscreen"
   ──────────────────────────────────────────────────────────────────────── */

function MosiaFullscreenHero(props: HeroBlockProps) {
  const isCarousel = props.mode === 'carousel'
  const slides = isCarousel ? props.slides || [] : props.singleSlide ? [props.singleSlide] : []
  const { index, next, prev, playing, togglePlay } = useCarousel(
    slides.length,
    props.carouselSettings,
  )
  const activeSlide = slides[index] || {}
  const card = props.mosiaFloatingCard

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col"
      style={{ minHeight: props.height ? `${props.height}px` : '600px' }}
    >
      <div className="absolute inset-0">
        <SlideMedia slide={activeSlide} priority />
      </div>
      <MediaOverlay overlay={props.overlay} />

      <div className="relative z-10 flex flex-1 w-full items-center">
        <div
          className="mx-auto grid w-full grid-cols-1 gap-8 md:grid-cols-2 md:items-center"
          style={{
            maxWidth: props.contentMaxWidth ? `${props.contentMaxWidth}px` : '1200px',
            paddingLeft: props.contentPaddingX ? `${props.contentPaddingX}px` : '24px',
            paddingRight: props.contentPaddingX ? `${props.contentPaddingX}px` : '24px',
          }}
        >
          {activeSlide.showText !== false && (
            <TextBlock
              eyebrowText={activeSlide.eyebrowText}
              heading={activeSlide.heading}
              headingColor={activeSlide.headingColor}
              subtitle={activeSlide.subtitle}
              subtitleColor={activeSlide.subtitleColor}
              buttons={activeSlide.buttons}
              align={props.textAlignment === 'right' ? 'right' : 'left'}
            />
          )}

          {card?.enabled !== false && card && (
            <div className="hidden md:block">
              <div className="ml-auto w-full max-w-sm rounded-2xl bg-white/95 p-6 shadow-xl backdrop-blur">
                {card.badgeLabel && (
                  <span className="inline-block rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    {card.badgeLabel}
                  </span>
                )}
                {card.stats && card.stats.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {card.stats.map((stat: { label: string; value: string }, i: number) => (
                      <div key={`${stat.label}-${i}`}>
                        <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
                        <div className="text-xs text-neutral-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                {(card.footerText || card.footerLink) && (
                  <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 text-xs text-neutral-500">
                    <span>{card.footerText}</span>
                    {card.footerLink && (
                      <Link
                        href={card.footerLink}
                        className="font-medium text-neutral-900 hover:underline"
                      >
                        {card.footerLinkLabel || 'View →'}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isCarousel && slides.length > 1 && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-3 text-white">
          {props.mosiaShowPlayPause !== false && (
            <button
              type="button"
              aria-label={playing ? 'Pause' : 'Play'}
              onClick={togglePlay}
              className="rounded-full bg-black/40 p-2 hover:bg-black/60"
            >
              {playing ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          )}
          {props.mosiaShowSlideCounter !== false && (
            <span className="text-sm font-medium tabular-nums">
              {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          )}
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="rounded-full bg-black/40 p-2 hover:bg-black/60"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="rounded-full bg-black/40 p-2 hover:bg-black/60"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Layout: 50/50 Split (Text + Media) - FIXED WITH PADDING AND BUTTONS
   ──────────────────────────────────────────────────────────────────────── */

function SplitHero(props: HeroBlockProps) {
  const isCarousel = props.mode === 'carousel'
  const slides = isCarousel ? props.slides || [] : props.singleSlide ? [props.singleSlide] : []
  const { index, goTo, next, prev } = useCarousel(slides.length, props.carouselSettings)
  const activeSlide = slides[index] || {}

  const textOnRight = props.splitDirection === 'textRight'
  const isDark = props.splitTheme !== 'light'
  const textChangesPerSlide = props.splitTextBehavior === 'slide'

  // "static" behavior: always use the first slide's text content while media changes.
  const textSlide = textChangesPerSlide ? activeSlide : slides[0] || {}

  const themeWrapperClass = isDark ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-900'
  const subtitleDefaultColor = isDark ? '#E5E7EB' : '#4B5563'
  const headingDefaultColor = isDark ? '#FFFFFF' : '#111827'

  // Get padding values with defaults
  const paddingX = props.contentPaddingX ?? 48
  const paddingY = props.contentPaddingY ?? 48

  // Helper function for button classes in split layout
  const getSplitButtonClasses = (btn: HeroButton) => {
    // If custom colors are provided, use them
    if (btn.backgroundColor || btn.textColor) {
      return ''
    }

    // Otherwise use variant-based styling
    if (isDark) {
      if (btn.variant === 'secondary')
        return 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
      if (btn.variant === 'outline')
        return 'border-2 border-white/80 text-white hover:bg-white hover:text-black'
      return 'bg-brand-red text-white hover:bg-brand-red/90'
    } else {
      if (btn.variant === 'outline')
        return 'border border-neutral-900 text-neutral-900 hover:bg-neutral-900/5'
      if (btn.variant === 'secondary') return 'bg-neutral-700 text-white hover:bg-neutral-600'
      return 'bg-neutral-900 text-white hover:bg-neutral-800'
    }
  }

  const textColumn = (
    <div
      className={`flex h-full flex-col justify-center gap-4 ${alignmentClasses(
        props.textAlignment || 'left',
      )}`}
      style={{
        paddingLeft: `${paddingX}px`,
        paddingRight: `${paddingX}px`,
        paddingTop: `${paddingY}px`,
        paddingBottom: `${paddingY}px`,
      }}
    >
      {textSlide.eyebrowText && (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
            isDark ? 'bg-white/10 text-white' : 'bg-neutral-900/10 text-neutral-900'
          }`}
        >
          {textSlide.eyebrowText}
        </span>
      )}
      {textSlide.heading && (
        <h1
          className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
          style={{ color: textSlide.headingColor || headingDefaultColor }}
        >
          {textSlide.heading}
        </h1>
      )}
      {textSlide.subtitle && (
        <p
          className="max-w-xl text-base sm:text-lg"
          style={{ color: textSlide.subtitleColor || subtitleDefaultColor }}
        >
          {textSlide.subtitle}
        </p>
      )}
      {textSlide.buttons && textSlide.buttons.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-3">
          {textSlide.buttons.map((btn: HeroButton, i: number) => {
            const buttonStyle: React.CSSProperties = {}
            if (btn.backgroundColor) {
              buttonStyle.backgroundColor = btn.backgroundColor
            }
            if (btn.textColor) {
              buttonStyle.color = btn.textColor
            }

            const defaultClasses = getSplitButtonClasses(btn)
            const customClasses = btn.backgroundColor || btn.textColor ? '' : defaultClasses

            const hasUrlLabel = isUrl(btn.label)

            return (
              <Link
                key={`${btn.label}-${i}`}
                href={btn.url || '#'}
                className={`inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${customClasses}`}
                style={buttonStyle}
              >
                {btn.icon && <HeroIcon name={btn.icon} className="h-4 w-4 shrink-0" />}
                {!hasUrlLabel && btn.label}
              </Link>
            )
          })}
        </div>
      )}
      <FeatureTags features={props.splitFeatures} />
    </div>
  )

  const mediaColumn = (
    <div className="relative h-full min-h-[300px] w-full overflow-hidden md:min-h-0">
      <div className="absolute inset-0">
        <SlideMedia slide={activeSlide} priority />
      </div>
      <MediaOverlay overlay={props.overlay} />
      {isCarousel && slides.length > 1 && (
        <CarouselControls
          count={slides.length}
          activeIndex={index}
          settings={props.carouselSettings}
          onGoTo={goTo}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  )

  return (
    <section
      className={`grid w-full grid-cols-1 md:grid-cols-2 ${themeWrapperClass}`}
      style={{ minHeight: props.height ? `${props.height}px` : '600px' }}
    >
      {textOnRight ? (
        <>
          <div className="order-2 h-full md:order-1">{mediaColumn}</div>
          <div className="order-1 h-full md:order-2">{textColumn}</div>
        </>
      ) : (
        <>
          <div className="order-1 h-full">{textColumn}</div>
          <div className="order-2 h-full">{mediaColumn}</div>
        </>
      )}
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Layout: Contained
   ──────────────────────────────────────────────────────────────────────── */

function ContainedHero(props: HeroBlockProps) {
  const isCarousel = props.mode === 'carousel'
  const slides = isCarousel ? props.slides || [] : props.singleSlide ? [props.singleSlide] : []
  const { index, goTo, next, prev } = useCarousel(slides.length, props.carouselSettings)
  const activeSlide = slides[index] || {}

  return (
    <section className="w-full px-4 py-10 sm:px-6 lg:px-8">
      <div
        className="relative mx-auto overflow-hidden rounded-2xl flex flex-col"
        style={{
          maxWidth: props.contentMaxWidth ? `${props.contentMaxWidth}px` : '1200px',
          minHeight: props.height ? `${props.height}px` : '500px',
        }}
      >
        <div className="absolute inset-0">
          <SlideMedia slide={activeSlide} priority />
        </div>
        <MediaOverlay overlay={props.overlay} />
        {activeSlide.showText !== false && (
          <div
            className={`relative z-10 flex flex-1 w-full ${verticalClasses(props.textVerticalPosition)}`}
          >
            <div
              className="w-full"
              style={{
                paddingLeft: props.contentPaddingX ? `${props.contentPaddingX}px` : '24px',
                paddingRight: props.contentPaddingX ? `${props.contentPaddingX}px` : '24px',
                paddingTop: props.contentPaddingY ? `${props.contentPaddingY}px` : '32px',
                paddingBottom: props.contentPaddingY ? `${props.contentPaddingY}px` : '32px',
              }}
            >
              <TextBlock
                eyebrowText={activeSlide.eyebrowText}
                heading={activeSlide.heading}
                headingColor={activeSlide.headingColor}
                subtitle={activeSlide.subtitle}
                subtitleColor={activeSlide.subtitleColor}
                buttons={activeSlide.buttons}
                align={props.textAlignment}
              />
            </div>
          </div>
        )}
        {isCarousel && slides.length > 1 && (
          <CarouselControls
            count={slides.length}
            activeIndex={index}
            settings={props.carouselSettings}
            onGoTo={goTo}
            onPrev={prev}
            onNext={next}
          />
        )}
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Quick Access Bar — overlapping card grid below the hero
   ──────────────────────────────────────────────────────────────────────── */

function QuickAccessBarSection({ bar }: { bar?: QuickAccessBar }) {
  if (!bar || bar.enabled === false || !bar.items || bar.items.length === 0) return null

  return (
    <div
      className="relative z-20 mx-auto -mt-1 w-full max-w-6xl px-4"
      style={{ marginTop: `-${bar.overlapAmount ?? 80}px` }}
    >
      <div
        className="grid gap-4 rounded-xl p-4 sm:grid-cols-2 md:grid-cols-4"
        style={{
          gridTemplateColumns: `repeat(${Math.min(bar.items.length, 4)}, minmax(0, 1fr))`,
        }}
      >
        {bar.items.map((item: any, i: number) => {
          const cardStyle: React.CSSProperties = {}

          // Use custom colors if provided
          if (item.backgroundColor) {
            cardStyle.backgroundColor = item.backgroundColor
          } else {
            // Fallback to colorVariant
            const isDark = item.colorVariant === 'dark'
            cardStyle.backgroundColor = isDark ? '#1A103D' : '#4B2E83'
          }

          if (item.textColor) {
            cardStyle.color = item.textColor
          } else {
            cardStyle.color = '#FFFFFF'
          }

          const content = (
            <div
              className="flex h-full flex-col items-center justify-center gap-2 rounded-xl p-5 text-center shadow-lg transition-transform hover:-translate-y-1"
              style={cardStyle}
            >
              {item.icon && <HeroIcon name={item.icon} className="h-6 w-6 shrink-0" />}
              <span className="text-sm font-semibold">{item.label}</span>
              {item.description && <span className="text-xs opacity-80">{item.description}</span>}
            </div>
          )

          return item.external ? (
            <a
              key={`${item.label}-${i}`}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          ) : (
            <Link key={`${item.label}-${i}`} href={item.link}>
              {content}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Main export — picks the right layout renderer
   ──────────────────────────────────────────────────────────────────────── */

export const HeroBlock: React.FC<HeroBlockProps> = (props) => {
  const layout = props.layout || 'fullWidth'

  const heroContent = useMemo(() => {
    switch (layout) {
      case 'split':
        return <SplitHero {...props} />
      case 'fullscreenOverlayCarousel':
        return <FullscreenOverlayCarouselHero {...props} />
      case 'mosiaFullscreen':
        return <MosiaFullscreenHero {...props} />
      case 'contained':
        return <ContainedHero {...props} />
      default:
        return <FullWidthHero {...props} />
    }
  }, [layout, props])

  return (
    <div className="relative">
      {heroContent}
      <QuickAccessBarSection bar={props.quickAccessBar} />
    </div>
  )
}

export default HeroBlock
