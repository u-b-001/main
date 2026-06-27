'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'



type MediaDoc = {
  url?: string
  alt?: string
  width?: number
  height?: number
}

// Payload returns either the populated doc, just the ID string, or nothing.
type MediaRelation = MediaDoc | string | null | undefined

type MediaType = 'textOnly' | 'image' | 'video' | 'externalVideo' | 'animation' | 'dataViz'

type ButtonVariant = 'primary' | 'secondary' | 'outline'

type HeroButton = {
  label: string
  url: string
  variant?: ButtonVariant
  icon?: string
}

type FeatureTag = {
  icon?: string
  text: string
}

type Slide = {
  mediaType?: MediaType
  image?: MediaRelation
  videoUrl?: string
  videoPoster?: MediaRelation
  externalVideoUrl?: string
  animationUrl?: string
  dataVizEmbed?: string
  eyebrowText?: string
  showText?: boolean
  heading?: string
  headingColor?: string
  subtitle?: string
  subtitleColor?: string
  buttons?: HeroButton[]
}

type ConstantOverlay = {
  showText?: boolean
  heading?: string
  headingColor?: string
  subtitle?: string
  subtitleColor?: string
  buttons?: HeroButton[]
}

type OverlaySettings = {
  enabled?: boolean
  color?: string
  opacity?: number
}

type HeaderGlass = {
  enabled?: boolean
  fillColor?: string
  fillOpacity?: number
  blurAmount?: number
  showDivider?: boolean
}

type CarouselSettings = {
  autoPlay?: boolean
  autoPlayInterval?: number
  showArrows?: boolean
  showDots?: boolean
}

type FloatingCardStat = {
  value: string
  label: string
}

type mosiaFloatingCard = {
  enabled?: boolean
  badgeLabel?: string
  footerText?: string
  footerLink?: string
  footerLinkLabel?: string
  stats?: FloatingCardStat[]
}

type QuickAccessItem = {
  label: string
  icon?: string
  link: string
  external?: boolean
  colorVariant?: 'primary' | 'dark'
}

type QuickAccessBar = {
  enabled?: boolean
  overlapAmount?: number
  items?: QuickAccessItem[]
}

export type HeroBlockProps = {
  mode?: 'single' | 'carousel'
  layout?: 'fullWidth' | 'fullscreenOverlayCarousel' | 'mosiaFullscreen' | 'split' | 'contained'
  splitDirection?: 'textLeft' | 'textRight'
  splitTheme?: 'dark' | 'light'
  splitTextBehavior?: 'static' | 'slide'
  splitFeatures?: FeatureTag[]
  height?: number
  textAlignment?: 'left' | 'center' | 'right'
  textVerticalPosition?: 'top' | 'center' | 'bottom'
  contentMaxWidth?: number
  contentPaddingX?: number
  contentPaddingY?: number
  constantOverlayContent?: boolean
  constantOverlay?: ConstantOverlay
  overlay?: OverlaySettings
  headerGlass?: HeaderGlass
  carouselSettings?: CarouselSettings
  singleSlide?: Slide
  slides?: Slide[]
  mosiaFloatingCard?: mosiaFloatingCard
  mosiaShowSlideCounter?: boolean
  mosiaShowPlayPause?: boolean
  quickAccessBar?: QuickAccessBar
}

/* ────────────────────────────────────────────────────────────────────────
   Small helpers
   ──────────────────────────────────────────────────────────────────────── */

function getMediaUrl(media: MediaRelation): string | undefined {
  if (!media) return undefined
  if (typeof media === 'string') return undefined // unpopulated relation ID — nothing renderable
  return media.url
}

function getMediaAlt(media: MediaRelation, fallback = ''): string {
  if (!media || typeof media === 'string') return fallback
  return media.alt || fallback
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace('/', '')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
      // handles /embed/ links already
      if (u.pathname.startsWith('/embed/')) return url
    }
    return null
  } catch {
    return null
  }
}

function getVimeoEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop()
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
    return null
  } catch {
    return null
  }
}

function getExternalEmbedUrl(url?: string): string | null {
  if (!url) return null
  return getYouTubeEmbedUrl(url) || getVimeoEmbedUrl(url) || null
}

function hexToRgba(hex: string | undefined, opacityPercent: number | undefined): string {
  const safeHex = hex || '#000000'
  const safeOpacity = typeof opacityPercent === 'number' ? opacityPercent : 50
  const clean = safeHex.replace('#', '')
  const bigint = parseInt(
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean,
    16,
  )
  if (Number.isNaN(bigint)) return `rgba(0,0,0,${safeOpacity / 100})`
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${safeOpacity / 100})`
}

function buttonClasses(variant?: ButtonVariant): string {
  switch (variant) {
    case 'secondary':
      return 'bg-neutral-700 text-white hover:bg-neutral-600'
    case 'outline':
      return 'bg-transparent text-white border border-white hover:bg-white/10'
    default:
      return 'bg-white text-black hover:bg-neutral-200'
  }
}

function alignmentClasses(align?: 'left' | 'center' | 'right'): string {
  switch (align) {
    case 'left':
      return 'items-start text-left'
    case 'right':
      return 'items-end text-right'
    default:
      return 'items-center text-center'
  }
}

function verticalClasses(pos?: 'top' | 'center' | 'bottom'): string {
  switch (pos) {
    case 'top':
      return 'justify-start'
    case 'bottom':
      return 'justify-end'
    default:
      return 'justify-center'
  }
}

/* ────────────────────────────────────────────────────────────────────────
   Media renderer — handles all 6 mediaType variants for a given slide
   ──────────────────────────────────────────────────────────────────────── */

function SlideMedia({
  slide,
  priority,
  fill = true,
}: {
  slide: Slide
  priority?: boolean
  fill?: boolean
}) {
  const mediaType = slide.mediaType || 'image'

  if (mediaType === 'textOnly') {
    return null
  }

  if (mediaType === 'image') {
    const url = getMediaUrl(slide.image)
    if (!url) return null
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={getMediaAlt(slide.image, slide.heading || '')}
        loading={priority ? 'eager' : 'lazy'}
        className={fill ? 'absolute inset-0 h-full w-full object-cover' : 'h-full w-full object-cover'}
      />
    )
  }

  if (mediaType === 'video') {
    if (!slide.videoUrl) return null
    const posterUrl = getMediaUrl(slide.videoPoster)
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={posterUrl}
      >
        <source src={slide.videoUrl} />
      </video>
    )
  }

  if (mediaType === 'externalVideo') {
    const embedUrl = getExternalEmbedUrl(slide.externalVideoUrl)
    if (!embedUrl) return null
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={embedUrl}
        title={slide.heading || 'video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  if (mediaType === 'animation') {
    if (!slide.animationUrl) return null
    // GIFs render directly as images. Lottie JSON files are intentionally
    // not rendered here — doing so would require installing a Lottie player
    // package (e.g. lottie-web or @lottiefiles/dotlottie-wc), which isn't
    // part of this project yet. Add one of those and swap in a small player
    // component if you need Lottie playback; for now this avoids depending
    // on a package that may not be installed.
    const isGif = /\.gif($|\?)/i.test(slide.animationUrl)
    if (isGif) {
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <img
          src={slide.animationUrl}
          alt={slide.heading || ''}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )
    }
    return null
  }

  if (mediaType === 'dataViz') {
    if (!slide.dataVizEmbed) return null
    return (
      <div
        className="absolute inset-0 h-full w-full overflow-hidden"
        // dataVizEmbed is authored by trusted CMS editors (admin-only field), not end users.
        dangerouslySetInnerHTML={{ __html: slide.dataVizEmbed }}
      />
    )
  }

  return null
}

/* ────────────────────────────────────────────────────────────────────────
   Text overlay block (heading / subtitle / buttons) — shared by layouts
   ──────────────────────────────────────────────────────────────────────── */

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
  align?: 'left' | 'center' | 'right'
}) {
  return (
    <div className={`flex flex-col gap-4 ${alignmentClasses(align)}`}>
      {eyebrowText && (
        <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
          {eyebrowText}
        </span>
      )}
      {heading && (
        <h1
          className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
          style={{ color: headingColor || '#FFFFFF' }}
        >
          {heading}
        </h1>
      )}
      {subtitle && (
        <p
          className="max-w-2xl text-base sm:text-lg"
          style={{ color: subtitleColor || '#E5E7EB' }}
        >
          {subtitle}
        </p>
      )}
      {buttons && buttons.length > 0 && (
        <div
          className={`mt-2 flex flex-wrap gap-3 ${
            align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'
          }`}
        >
          {buttons.map((btn, i) => (
            <Link
              key={`${btn.label}-${i}`}
              href={btn.url || '#'}
              className={`inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${buttonClasses(
                btn.variant,
              )}`}
            >
              {btn.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function FeatureTags({ features }: { features?: FeatureTag[] }) {
  if (!features || features.length === 0) return null
  return (
    <div className="mt-4 flex flex-wrap gap-4">
      {features.map((f, i) => (
        <div key={`${f.text}-${i}`} className="flex items-center gap-2 text-sm text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
          <span>{f.text}</span>
        </div>
      ))}
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
  const { index } = useCarousel(slides.length, props.carouselSettings)
  const activeSlide = slides[index] || {}

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: props.height ? `${props.height}px` : '600px' }}
    >
      <div className="absolute inset-0">
        <SlideMedia slide={activeSlide} priority />
      </div>
      <MediaOverlay overlay={props.overlay} />
      {activeSlide.showText !== false && (
        <div
          className={`relative z-10 flex h-full w-full ${verticalClasses(props.textVerticalPosition)}`}
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={onNext}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}
      {settings?.showDots !== false && onGoTo && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {Array.from({ length: count }).map((_, i) => (
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
      className="relative w-full overflow-hidden"
      style={{ height: props.height ? `${props.height}px` : '600px' }}
    >
      {glass?.enabled !== false && glass && (
        <div
          className={`absolute inset-x-0 top-0 z-30 h-16 ${glass.showDivider !== false ? 'border-b border-white/10' : ''}`}
          style={{
            backgroundColor: hexToRgba(glass.fillColor, glass.fillOpacity),
            backdropFilter: `blur(${glass.blurAmount ?? 16}px)`,
            WebkitBackdropFilter: `blur(${glass.blurAmount ?? 16}px)`,
          }}
        />
      )}

      <div className="absolute inset-0">
        <SlideMedia slide={activeSlide} priority />
      </div>
      <MediaOverlay overlay={props.overlay} />

      {textSource.showText !== false && (
        <div
          className={`relative z-10 flex h-full w-full ${verticalClasses(props.textVerticalPosition)}`}
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
      className="relative w-full overflow-hidden"
      style={{ height: props.height ? `${props.height}px` : '600px' }}
    >
      <div className="absolute inset-0">
        <SlideMedia slide={activeSlide} priority />
      </div>
      <MediaOverlay overlay={props.overlay} />

      <div className="relative z-10 flex h-full w-full items-center">
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
                    {card.stats.map((stat, i) => (
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
                      <Link href={card.footerLink} className="font-medium text-neutral-900 hover:underline">
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="rounded-full bg-black/40 p-2 hover:bg-black/60"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Layout: 50/50 Split (Text + Media)
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

  const textColumn = (
    <div
      className={`flex flex-col justify-center gap-4 px-6 py-12 md:px-12 ${alignmentClasses(
        props.textAlignment || 'left',
      )}`}
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
          {textSlide.buttons.map((btn, i) => (
            <Link
              key={`${btn.label}-${i}`}
              href={btn.url || '#'}
              className={`inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${
                isDark
                  ? buttonClasses(btn.variant)
                  : btn.variant === 'outline'
                    ? 'border border-neutral-900 text-neutral-900 hover:bg-neutral-900/5'
                    : btn.variant === 'secondary'
                      ? 'bg-neutral-700 text-white hover:bg-neutral-600'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
            >
              {btn.label}
            </Link>
          ))}
        </div>
      )}
      <FeatureTags features={props.splitFeatures} />
    </div>
  )

  const mediaColumn = (
    <div className="relative min-h-[300px] overflow-hidden md:min-h-0">
      <SlideMedia slide={activeSlide} priority />
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
          <div className="order-2 md:order-1">{mediaColumn}</div>
          <div className="order-1 md:order-2">{textColumn}</div>
        </>
      ) : (
        <>
          <div className="order-1">{textColumn}</div>
          <div className="order-2">{mediaColumn}</div>
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
        className="relative mx-auto overflow-hidden rounded-2xl"
        style={{
          maxWidth: props.contentMaxWidth ? `${props.contentMaxWidth}px` : '1200px',
          height: props.height ? `${props.height}px` : '500px',
        }}
      >
        <div className="absolute inset-0">
          <SlideMedia slide={activeSlide} priority />
        </div>
        <MediaOverlay overlay={props.overlay} />
        {activeSlide.showText !== false && (
          <div className={`relative z-10 flex h-full w-full ${verticalClasses(props.textVerticalPosition)}`}>
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
        {bar.items.map((item, i) => {
          const isDark = item.colorVariant === 'dark'
          const content = (
            <div
              className={`flex h-full flex-col items-center justify-center gap-2 rounded-xl p-5 text-center shadow-lg transition-transform hover:-translate-y-1 ${
                isDark ? 'bg-[#1A103D] text-white' : 'bg-[#4B2E83] text-white'
              }`}
            >
              <span className="text-sm font-semibold">{item.label}</span>
            </div>
          )
          return item.external ? (
            <a key={`${item.label}-${i}`} href={item.link} target="_blank" rel="noopener noreferrer">
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