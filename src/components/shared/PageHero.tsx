import React from 'react'
import { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

interface PageHeroProps {
  title: string
  heroImage?: string | number | MediaType | null
  heroStyle?: 'none' | 'small' | 'medium' | 'large' | null
  heroType?: 'image' | 'gradient' | 'color' | null
  heroGradientPreset?: 'blue' | 'navy' | 'purple' | 'emerald' | null
  heroShape?: 'straight' | 'curved' | 'wavy' | null
  heroEyebrow?: string | null
  heroEyebrowColor?: string | null
  heroSubtitle?: string | null
  heroPaddingTop?: 'none' | 'small' | 'medium' | 'large' | 'xlarge' | null
  heroPaddingBottom?: 'none' | 'small' | 'medium' | 'large' | 'xlarge' | null
  heroMarginBottom?: 'none' | 'small' | 'medium' | 'large' | 'xlarge' | null
  bgTheme?: string | null
  customBgColor?: string | null
  heroBgColor?: string | null
}

const paddingTopClasses = {
  none: 'pt-0',
  small: 'pt-10 md:pt-14',
  medium: 'pt-16 md:pt-24',
  large: 'pt-24 md:pt-36',
  xlarge: 'pt-32 md:pt-44',
}

const paddingBottomClasses = {
  none: 'pb-0',
  small: 'pb-10 md:pb-14',
  medium: 'pb-16 md:pb-24',
  large: 'pb-24 md:pb-36',
  xlarge: 'pb-32 md:pb-44',
}

const marginBottomClasses = {
  none: 'mb-0',
  small: 'mb-0',
  medium: 'mb-0',
  large: 'mb-0',
  xlarge: 'mb-0',
}

const gradientPresets = {
  blue: 'bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500',
  navy: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950',
  purple: 'bg-gradient-to-r from-indigo-900 via-purple-700 to-pink-500',
  emerald: 'bg-gradient-to-r from-emerald-800 via-teal-700 to-cyan-600',
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  heroImage,
  heroStyle = 'medium',
  heroType = 'image',
  heroGradientPreset = 'blue',
  heroShape = 'straight',
  heroEyebrow,
  heroEyebrowColor,
  heroSubtitle,
  heroPaddingTop = 'medium',
  heroPaddingBottom = 'medium',
  heroMarginBottom = 'none',
  bgTheme,
  customBgColor,
  heroBgColor,
}) => {
  if (heroStyle === 'none') {
    return (
      <div className="container mx-auto px-4 pt-10 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-brand-navy dark:text-white leading-tight uppercase tracking-wide">
          {title}
        </h1>
      </div>
    )
  }

  // Spacing classes
  const ptClass = paddingTopClasses[heroPaddingTop || 'medium']
  const pbClass = paddingBottomClasses[heroPaddingBottom || 'medium']
  const mbClass = marginBottomClasses[heroMarginBottom || 'none']

  // Background Class
  const isGradient = heroType === 'gradient'
  const isColor = heroType === 'color'
  const gradientClass = gradientPresets[heroGradientPreset || 'blue']

  const containerStyle: React.CSSProperties = {}
  if (isColor) {
    containerStyle.backgroundColor = heroBgColor || '#0f172a'
  }

  // SVG Bottom Shape Curve
  let shapePath = ''
  if (heroShape === 'curved') {
    shapePath = 'M0,80 C480,120 960,40 1440,80 L1440,130 L0,130 Z'
  } else if (heroShape === 'wavy') {
    shapePath = 'M0,60 C180,90 360,90 540,60 C720,30 900,30 1080,60 C1260,90 1350,90 1440,60 L1440,130 L0,130 Z'
  }

  // Dynamic Fill Color for SVG path to blend seamlessly with breadcrumb / content background
  let curveFillClass = 'fill-slate-50 dark:fill-slate-900'
  let curveStyle: React.CSSProperties = {}

  if (bgTheme === 'light-gray') {
    curveFillClass = 'fill-slate-50 dark:fill-slate-900'
  } else if (bgTheme === 'dark-navy') {
    curveFillClass = 'fill-slate-900'
  } else if (bgTheme === 'custom' && customBgColor) {
    curveFillClass = ''
    curveStyle = { fill: customBgColor }
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden flex items-center transition-all duration-300',
        isGradient ? gradientClass : (!isColor ? 'bg-slate-900' : ''),
        ptClass,
        pbClass,
        mbClass,
      )}
      style={containerStyle}
    >
      {/* Background Image Banner if Type is Image */}
      {heroType === 'image' && (
        <>
          {heroImage && typeof heroImage === 'object' ? (
            <div className="absolute inset-0 w-full h-full">
              <Media
                resource={heroImage}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover opacity-75 filter brightness-110 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-black/30" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-navy to-slate-950 opacity-90" />
          )}
        </>
      )}

      {/* Overlay Text */}
      <div className="relative container mx-auto px-4 z-10 w-full max-w-6xl">
        <div className="flex flex-col items-start text-left max-w-3xl">
          {heroEyebrow && (
            <span 
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 text-white border border-white/20 mb-4 backdrop-blur-xs"
              style={heroEyebrowColor ? { color: heroEyebrowColor, borderColor: heroEyebrowColor } : undefined}
            >
              {heroEyebrow}
            </span>
          )}
          
          <h1 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-wider drop-shadow-xs leading-tight font-sans">
            {title}
          </h1>

          {heroSubtitle && (
            <p className="mt-4 text-white/90 text-sm md:text-base font-light leading-relaxed max-w-2xl drop-shadow-xs">
              {heroSubtitle}
            </p>
          )}

          {!heroEyebrow && !heroSubtitle && null}
        </div>
      </div>

      {/* Curve SVG bottom overlay */}
      {heroShape !== 'straight' && shapePath && (
        <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-10 md:h-16 translate-y-1 scale-y-105 origin-bottom"
          >
            <path
              d={shapePath}
              className={curveFillClass}
              style={curveStyle}
            />
          </svg>
        </div>
      )}
    </div>
  )
}
