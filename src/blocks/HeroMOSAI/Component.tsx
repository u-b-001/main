'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { CMSLink } from '../../components/Link'
import RichText from '../../components/RichText'
import * as LucideIcons from 'lucide-react'

function HeroIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (LucideIcons as any)[name]
  if (!IconComponent) return null
  return <IconComponent className={className} />
}

// Type definitions matching the Payload config
type Media = { url: string; alt?: string; width?: number; height?: number }
type LinkType = any // CMSLink handles the shape
type Decoration = {
  image?: Media
  x?: number
  y?: number
  scale?: number
  opacity?: number
  rotation?: number
}
type Feature = {
  icon?: string
  title: string
  description: string
}

export type HeroMOSAIBlockProps = {
  subtitle?: string
  heading?: any
  description?: any
  textColor?: string
  buttons?: { link: LinkType; buttonColor?: string; buttonTextColor?: string }[]
  backgroundImage?: Media
  heroImage?: Media
  mode?: 'single' | 'carousel'
  heroSlides?: { image?: Media }[]
  height?: number
  textAlignment?: 'left' | 'center' | 'right'
  textVerticalPosition?: 'top' | 'center' | 'bottom'
  contentMaxWidth?: number
  contentPaddingX?: number
  contentPaddingY?: number
  bgImageScaleX?: number
  bgImageScaleY?: number
  bgImageOpacity?: number
  bgImageShiftX?: number
  bgImageShiftY?: number
  heroImageScaleX?: number
  heroImageScaleY?: number
  heroImageOpacity?: number
  heroImageShiftX?: number
  heroImageShiftY?: number
  heroImageShadow?: string
  heroImageEdgeBlend?: string
  heroImageEdgePixelBlur?: boolean
  ribbonImage?: Media
  ribbonImageScaleX?: number
  ribbonImageScaleY?: number
  ribbonImageOpacity?: number
  ribbonImageShiftX?: number
  ribbonImageShiftY?: number
  features?: Feature[]
  featureStripScale?: number
  featureStripShiftX?: number
  featureStripShiftY?: number
  enabled?: boolean
  backgroundColor?: string
  containerWidth?: string
  paddingTop?: number
  paddingBottom?: number
  backgroundSettings?: {
    backgroundGradient?: boolean
    radialGlow?: boolean
    overlayOpacity?: number
    paperTexture?: Media
  }
}


export const HeroMOSAIBlock: React.FC<HeroMOSAIBlockProps> = (props) => {
  if (props.enabled === false) return null

  const {
    subtitle,
    heading,
    description,
    textColor = '#1a2e4a',
    buttons,
    backgroundImage,
    heroImage,
    mode = 'single',
    heroSlides = [],
    bgImageScaleX = 100,
    bgImageScaleY = 100,
    bgImageOpacity = 100,
    bgImageShiftX = 0,
    bgImageShiftY = 0,
    height = 600,
    textAlignment = 'left',
    textVerticalPosition = 'center',
    contentMaxWidth = 1200,
    contentPaddingX = 24,
    contentPaddingY = 30,
    heroImageScaleX = 100,
    heroImageScaleY = 100,
    heroImageOpacity = 100,
    heroImageShiftX = 0,
    heroImageShiftY = 0,
    heroImageShadow = 'none',
    heroImageEdgeBlend = 'none',
    heroImageEdgePixelBlur = false,
    ribbonImage,
    ribbonImageScaleX = 100,
    ribbonImageScaleY = 100,
    ribbonImageOpacity = 100,
    ribbonImageShiftX = 0,
    ribbonImageShiftY = 0,
    features,
    featureStripScale = 100,
    featureStripShiftX = 0,
    featureStripShiftY = 0,
    backgroundColor = 'transparent',
  } = props

  const isCarousel = mode === 'carousel' && heroSlides && heroSlides.length > 0
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!isCarousel) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isCarousel, heroSlides])

  const activeImage = isCarousel ? heroSlides[currentIndex]?.image : heroImage
  const placeholderImage = isCarousel && heroSlides.length > 0 ? heroSlides[0]?.image : heroImage

  const getShadowClass = (shadow?: string) => {
    switch (shadow) {
      case 'sm': return 'drop-shadow-sm'
      case 'md': return 'drop-shadow-md'
      case 'lg': return 'drop-shadow-lg'
      case 'xl': return 'drop-shadow-xl'
      case '2xl': return 'drop-shadow-2xl'
      case 'glow': return 'drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]'
      default: return ''
    }
  }

  const getEdgeBlendStyle = (blend?: string) => {
    switch (blend) {
      case 'linear-top':
        return {
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%)',
        }
      case 'radial':
        return {
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
        }
      case 'radial-bottom':
        return {
          WebkitMaskImage: 'radial-gradient(ellipse at bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          maskImage: 'radial-gradient(ellipse at bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
        }
      case 'radial-top':
        return {
          WebkitMaskImage: 'radial-gradient(ellipse at top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          maskImage: 'radial-gradient(ellipse at top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
        }
      case 'soft-blended-sides':
        return {
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
        }
      case 'blob':
      case 'blob-soft':
      case 'blob-soft-sides': {
        const isSoft = true
        const stdDeviation = 3
        let path = 'M0,0 L100,0 L100,85 Q75,100 50,85 T0,85 Z'
        if (blend === 'blob') {
          path = 'M 15,0 L 85,0 C 100,20 100,60 90,70 C 80,80 75,95 50,95 C 25,95 20,80 10,70 C 0,60 0,20 15,0 Z'
        } else if (blend === 'blob-soft-sides') {
          path = 'M 0,0 L 100,0 C 100,50 80,100 50,100 C 20,100 0,50 0,0 Z'
        }
        
        const svg = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  ${isSoft ? `<defs><filter id="b"><feGaussianBlur stdDeviation="${stdDeviation}"/></filter></defs>` : ''}
  <path fill="#000" ${isSoft ? 'filter="url(#b)"' : ''} d="${path}" />
</svg>`
        const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22")
        const url = `url("data:image/svg+xml;charset=utf-8,${encoded}")`
        return {
          WebkitMaskImage: url,
          maskImage: url,
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }
      }
      case 'none':
      default:
        return {}
    }
  }

  return (
    <section
      className="relative overflow-hidden flex flex-col justify-center"
      style={{ backgroundColor: `#${backgroundColor.replace('#', '')}`, minHeight: `${height}px` }}
    >
      {/* --- BACKGROUND DECORATIONS --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {backgroundImage?.url && (
          <img
            src={backgroundImage.url}
            alt={backgroundImage.alt || 'Background'}
            className="absolute inset-0 w-full h-full object-cover object-top"
            style={{
              transform: `translate(${bgImageShiftX}%, ${bgImageShiftY}%) scale(${bgImageScaleX / 100}, ${bgImageScaleY / 100})`,
              opacity: bgImageOpacity / 100,
              transformOrigin: 'top center',
              WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 85%)',
              maskImage: 'linear-gradient(to bottom, black 40%, transparent 85%)',
            }}
          />
        )}
        
        {props.backgroundSettings?.paperTexture?.url && (
          <div
            className="absolute inset-0 opacity-40 mix-blend-multiply"
            style={{
              backgroundImage: `url(${props.backgroundSettings.paperTexture.url})`,
              backgroundSize: 'cover',
            }}
          />
        )}
        
        {props.backgroundSettings?.radialGlow && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent opacity-60" />
        )}
        
      </div>

      {ribbonImage?.url && (
        <div
          className="absolute bottom-0 left-0 w-full h-auto z-50 pointer-events-none"
          style={{
            transform: `translate(${ribbonImageShiftX}%, ${ribbonImageShiftY}%) scale(${ribbonImageScaleX / 100}, ${ribbonImageScaleY / 100})`,
            opacity: ribbonImageOpacity / 100,
            transformOrigin: 'bottom center',
          }}
        >
          <img
            src={ribbonImage.url}
            alt={ribbonImage.alt || 'Ribbon'}
            className="w-full h-auto object-cover transform translate-y-[20%] lg:translate-y-[30%]"
          />
        </div>
      )}

      {/* --- MAIN HERO CONTENT (Desktop 45/55 split) --- */}
      <div 
        className="relative mx-auto w-full z-40"
        style={{
          maxWidth: contentMaxWidth ? `${contentMaxWidth}px` : '1200px',
          paddingLeft: `${contentPaddingX}px`,
          paddingRight: `${contentPaddingX}px`,
          paddingTop: `${contentPaddingY}px`,
          paddingBottom: `${contentPaddingY}px`,
        }}
      >
        <div className={`flex flex-col lg:flex-row gap-12 lg:gap-8 ${
          textVerticalPosition === 'top' ? 'items-start' : textVerticalPosition === 'bottom' ? 'items-end' : 'items-center'
        }`}>
          
          {/* LEFT: Text Content */}
          <div className={`w-full lg:w-[45%] flex flex-col gap-6 relative z-40 ${
            textAlignment === 'center' ? 'text-center items-center' : textAlignment === 'right' ? 'text-right items-end' : 'text-left items-start'
          }`}>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-[#7a1a28] font-bold tracking-widest text-sm uppercase"
              >
                {subtitle}
              </motion.p>
            )}

            {heading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
                style={{ color: textColor }}
              >
                <RichText data={heading} enableGutter={false} />
              </motion.div>
            )}

            {description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-lg max-w-lg"
                style={{ color: textColor }}
              >
                <RichText data={description} enableGutter={false} />
              </motion.div>
            )}

            {buttons && buttons.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={`flex flex-wrap gap-4 mt-4 ${
                  textAlignment === 'center' ? 'justify-center' : textAlignment === 'right' ? 'justify-end' : 'justify-start'
                }`}
              >
                <style dangerouslySetInnerHTML={{ __html: `
                  .mosai-btn-wrapper a, .mosai-btn-wrapper button {
                    background-color: var(--btn-bg) !important;
                    color: var(--btn-text) !important;
                    border-color: var(--btn-bg) !important;
                  }
                `}} />
                {buttons.map((button, i) => (
                  <div key={i} style={{ '--btn-bg': button.buttonColor || '#7a1a28', '--btn-text': button.buttonTextColor || '#ffffff' } as React.CSSProperties} className="mosai-btn-wrapper">
                    <CMSLink {...button.link} className="rounded-full font-semibold px-6 py-3" />
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          <div className="hidden lg:flex w-full lg:w-[55%] h-[460px] relative z-20 pointer-events-none items-center justify-center">
            <AnimatePresence mode="wait">
              {activeImage?.url ? (
                <motion.div
                  key={activeImage.url}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: heroImageOpacity / 100 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                  style={{
                    transform: `translate(${heroImageShiftX}%, ${heroImageShiftY}%) scale(${heroImageScaleX / 100}, ${heroImageScaleY / 100})`,
                    transformOrigin: 'center center'
                  }}
                  className={`relative w-full h-full flex items-center justify-center ${getShadowClass(heroImageShadow)}`}
                >
                  {heroImageEdgePixelBlur && heroImageEdgeBlend !== 'none' && (
                    <img
                      src={activeImage.url}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none blur-xl opacity-90 scale-105 brightness-110 contrast-105"
                      style={getEdgeBlendStyle(heroImageEdgeBlend)}
                    />
                  )}
                  <img
                    src={activeImage.url}
                    alt={activeImage.alt || 'Hero Image'}
                    className="w-full h-full object-cover pointer-events-auto relative z-10 brightness-110 contrast-105"
                    style={getEdgeBlendStyle(heroImageEdgeBlend)}
                  />
                </motion.div>
              ) : (
                /* The right side is empty if no hero image is provided so the background image can be seen clearly */
                null
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* --- FEATURE STRIP (Red Bar at bottom) --- */}
      {features && features.length === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 lg:-mt-24 mb-12"
        >
          <div 
            className="bg-[#7a1a28] rounded-2xl shadow-xl p-6 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/20"
            style={{
              transform: `translate(${featureStripShiftX}%, ${featureStripShiftY}%) scale(${featureStripScale / 100})`,
              transformOrigin: 'top center',
            }}
          >
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4 px-4 w-full md:w-1/4 pt-6 md:pt-0 first:pt-0">
                {feature.icon && (
                  <div className="flex-shrink-0 text-white">
                    <HeroIcon name={feature.icon} className="w-10 h-10 lg:w-12 lg:h-12" />
                  </div>
                )}
                <div className="flex flex-col">
                  <h3 className="text-white font-bold text-sm lg:text-base leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 text-xs lg:text-sm mt-1 leading-snug">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </section>
  )
}

export default HeroMOSAIBlock
