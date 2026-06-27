import React from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import type { CallToActionBlock as CallToActionProps } from '@/payload-types'

const buttonStyles = {
  primary: 'bg-brand-red text-white hover:bg-red-750 focus:ring-brand-red border-transparent',
  secondary: 'bg-brand-gold text-slate-900 hover:bg-yellow-500 focus:ring-brand-gold border-transparent',
  outline: 'bg-transparent border-2 border-white hover:bg-white hover:text-slate-950 focus:ring-white',
  ghost: 'bg-transparent text-white/90 hover:bg-white/10 border-transparent',
}

const lightButtonStyles = {
  primary: 'bg-brand-navy text-white hover:bg-slate-950 focus:ring-brand-navy border-transparent',
  secondary: 'bg-brand-red text-white hover:bg-red-750 focus:ring-brand-red border-transparent',
  outline: 'bg-transparent border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white focus:ring-brand-navy',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 border-transparent',
}

export const CallToActionBlock: React.FC<CallToActionProps> = ({
  sectionHeading,
  sectionDescription,
  align = 'center',
  layout = 'gradient',
  heading,
  description,
  buttons,
  bgType = 'color',
  backgroundColor = '#1E40AF',
  bgImage,
}) => {
  const isCenter = align === 'center'
  const isRight = align === 'right'
  const alignmentClass = isCenter ? 'text-center' : isRight ? 'text-right' : 'text-left'

  // Determine if text should be light or dark based on background color choice
  const lightBgHexes = ['#ffffff', '#fff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#fefefe']
  const isLightBg = bgType === 'color' && lightBgHexes.includes((backgroundColor || '').toLowerCase())
  const textColorClass = isLightBg ? 'text-slate-900' : 'text-white'
  const descColorClass = isLightBg ? 'text-slate-650' : 'text-white/80'

  const activeButtonStyles = isLightBg ? lightButtonStyles : buttonStyles

  // Build the CSS background properties
  let bgStyles: React.CSSProperties = {}
  if (bgType === 'color' && backgroundColor) {
    bgStyles = { backgroundColor }
  } else if (bgType === 'gradient' && backgroundColor) {
    // Generate a sleek gradient fading into a darker shade
    bgStyles = {
      background: `linear-gradient(135deg, ${backgroundColor} 0%, rgba(15, 23, 42, 0.45) 100%)`,
      backgroundColor: backgroundColor,
    }
  }

  return (
    <section className="w-full py-16 md:py-24 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-4">
        {/* Optional Header Section Heading */}
        {(sectionHeading || sectionDescription) && (
          <div className={cn('mb-12 md:mb-18 max-w-3xl', alignmentClass, isCenter ? 'mx-auto' : '')}>
            {sectionHeading && (
              <h3 className="text-2xl md:text-3xl font-serif font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                {sectionHeading}
              </h3>
            )}
            <div
              className={cn(
                'w-16 h-1 bg-brand-red dark:bg-brand-gold mt-4 mb-5 rounded-full',
                isCenter ? 'mx-auto' : isRight ? 'ml-auto' : ''
              )}
            />
            {sectionDescription && (
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {sectionDescription}
              </p>
            )}
          </div>
        )}

        {/* ── Gradient Card Layout ── */}
        {layout === 'gradient' && (
          <div
            className={cn(
              'rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-lg border border-white/10 flex flex-col justify-center min-h-[300px]',
              alignmentClass
            )}
            style={bgStyles}
          >
            {bgType === 'image' && bgImage && typeof bgImage === 'object' && (
              <>
                <div className="absolute inset-0 z-0">
                  <Media resource={bgImage} className="w-full h-full" imgClassName="object-cover w-full h-full" />
                </div>
                <div className="absolute inset-0 bg-slate-950/70 z-0" />
              </>
            )}

            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center justify-center">
              <h2 className={cn('text-2xl md:text-4xl font-extrabold font-serif mb-4 leading-snug', textColorClass)}>
                {heading}
              </h2>
              {description && (
                <p className={cn('text-sm md:text-base mb-8 leading-relaxed max-w-2xl', descColorClass)}>
                  {description}
                </p>
              )}
              {buttons && buttons.length > 0 && (
                <div className="flex flex-wrap gap-4 justify-center items-center">
                  {buttons.map((btn, idx) => (
                    <Link
                      key={idx}
                      href={btn.url}
                      className={cn(
                        'px-6 py-3 rounded-lg font-semibold tracking-wide shadow-2xs hover:shadow-xs transition-all duration-200 border',
                        activeButtonStyles[btn.variant || 'primary']
                      )}
                    >
                      {btn.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Centered Compact Card Layout ── */}
        {layout === 'compact' && (
          <div className="max-w-3xl mx-auto">
            <div
              className={cn(
                'rounded-2xl p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-md text-center flex flex-col items-center justify-center relative overflow-hidden',
                textColorClass
              )}
              style={bgStyles}
            >
              {bgType === 'image' && bgImage && typeof bgImage === 'object' && (
                <>
                  <div className="absolute inset-0 z-0">
                    <Media resource={bgImage} className="w-full h-full" imgClassName="object-cover w-full h-full" />
                  </div>
                  <div className="absolute inset-0 bg-slate-950/70 z-0" />
                </>
              )}

              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold font-serif mb-4 leading-snug max-w-xl mx-auto">
                  {heading}
                </h2>
                {description && (
                  <p className={cn('text-sm leading-relaxed mb-8 max-w-lg mx-auto', descColorClass)}>
                    {description}
                  </p>
                )}
                {buttons && buttons.length > 0 && (
                  <div className="flex flex-wrap gap-3 justify-center items-center">
                    {buttons.map((btn, idx) => (
                      <Link
                        key={idx}
                        href={btn.url}
                        className={cn(
                          'px-5 py-2.5 rounded-lg text-sm font-semibold shadow-2xs hover:shadow-xs transition-all duration-200 border',
                          activeButtonStyles[btn.variant || 'primary']
                        )}
                      >
                        {btn.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Split Image Banner Layout ── */}
        {layout === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-850 overflow-hidden shadow-md">
            {/* Left Column content */}
            <div className="lg:col-span-7 p-8 md:p-14 flex flex-col justify-center">
              <h2 className="text-2xl md:text-4xl font-extrabold font-serif text-brand-navy dark:text-white mb-4 leading-snug">
                {heading}
              </h2>
              {description && (
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
                  {description}
                </p>
              )}
              {buttons && buttons.length > 0 && (
                <div className="flex flex-wrap gap-3 items-center">
                  {buttons.map((btn, idx) => (
                    <Link
                      key={idx}
                      href={btn.url}
                      className={cn(
                        'px-5.5 py-3 rounded-lg text-sm font-semibold shadow-2xs hover:shadow-xs transition-all duration-200 border',
                        lightButtonStyles[btn.variant || 'primary']
                      )}
                    >
                      {btn.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column image or color banner */}
            <div
              className="lg:col-span-5 min-h-[300px] lg:min-h-auto relative overflow-hidden"
              style={bgType !== 'image' ? bgStyles : undefined}
            >
              {bgImage && typeof bgImage === 'object' && (
                <Media resource={bgImage} className="w-full h-full" imgClassName="object-cover w-full h-full absolute inset-0" />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
