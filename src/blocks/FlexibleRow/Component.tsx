import React from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import type { FlexibleRowBlock as FlexibleRowProps } from '@/payload-types'

const colSpanClasses = {
  'col-span-12': 'col-span-12',
  'col-span-6': 'col-span-12 lg:col-span-6',
  'col-span-4': 'col-span-12 lg:col-span-4',
  'col-span-8': 'col-span-12 lg:col-span-8',
  'col-span-3': 'col-span-12 lg:col-span-3',
  'col-span-9': 'col-span-12 lg:col-span-9',
}

const rowBgClasses = {
  transparent: 'bg-transparent',
  slate50: 'bg-slate-50 dark:bg-slate-900/60 border-y border-slate-100 dark:border-slate-800/80',
  brandNavy: 'bg-brand-navy text-white border-y border-slate-850',
  brandRed: 'bg-brand-red text-white border-y border-red-700',
  brandCream: 'bg-brand-cream dark:bg-slate-900 border-y border-brand-gold/10',
}

const rowPaddingClasses = {
  none: 'py-0',
  small: 'py-6 md:py-8',
  medium: 'py-12 md:py-16',
  large: 'py-20 md:py-28',
}

const containerWidthClasses = {
  boxed: 'container mx-auto px-4',
  fullWidth: 'w-full px-4 md:px-8',
}

const pureBgClasses = {
  transparent: 'bg-transparent',
  slate50: 'bg-slate-50 dark:bg-slate-900/80 border border-slate-150 dark:border-slate-800',
  brandNavy: 'bg-brand-navy text-white',
  brandRed: 'bg-brand-red text-white',
  brandCream: 'bg-brand-cream dark:bg-slate-900 border border-brand-gold/25 dark:border-slate-800',
}

const columnStyleThemeClasses = {
  simple: 'bg-transparent',
  card: 'bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-xs hover:shadow-md rounded-2xl transition-all duration-300 hover:-translate-y-0.5',
  bordered: 'bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-2xl hover:border-brand-gold/50 transition-all duration-250',
  glassmorphism: 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-850 shadow-xs hover:shadow-md rounded-2xl transition-all duration-300',
}

const paddingClasses = {
  none: 'p-0',
  small: 'p-4 md:p-5',
  medium: 'p-6 md:p-8',
  large: 'p-10 md:p-12',
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center flex flex-col items-center justify-center',
  right: 'text-right flex flex-col items-end justify-center',
}

const gapClasses = {
  small: 'gap-4 md:gap-6',
  medium: 'gap-8 md:gap-10',
  large: 'gap-12 md:gap-16',
}

const alignItemClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

const imageShapeClasses = {
  rounded: 'rounded-xl object-cover w-full h-full',
  circle: 'rounded-full aspect-square object-cover mx-auto max-w-[200px]',
  square: 'rounded-none aspect-square object-cover w-full h-full',
  original: 'rounded-xl object-contain w-full h-auto',
}

export const FlexibleRowComponent: React.FC<FlexibleRowProps> = ({
  containerWidth = 'boxed',
  rowBackground = 'transparent',
  rowPadding = 'none',
  gridGap = 'medium',
  alignItems = 'stretch',
  columns,
}) => {
  if (!columns || columns.length === 0) return null

  const isRowLightText = rowBackground === 'brandNavy' || rowBackground === 'brandRed'

  return (
    <div className={cn('w-full transition-all duration-300', rowBgClasses[rowBackground || 'transparent'], rowPaddingClasses[rowPadding || 'none'])}>
      <div className={cn(containerWidthClasses[containerWidth || 'boxed'])}>
        <div
          className={cn(
            'grid grid-cols-12 w-full',
            gapClasses[gridGap || 'medium'],
            alignItemClasses[alignItems || 'stretch']
          )}
        >
          {columns.map((column, idx) => {
            const colSpan = colSpanClasses[column.width || 'col-span-6']
            const isLightText = isRowLightText || column.textColor === 'light' || column.backgroundColor === 'brandNavy' || column.backgroundColor === 'brandRed'
            const alignClass = alignClasses[column.alignment || 'left']

            // Base style class
            let styleClass = columnStyleThemeClasses[column.columnStyle || 'simple']
            // If background is defined inside pureBgClasses, apply it
            if (column.backgroundColor && column.backgroundColor !== 'transparent') {
              styleClass = cn(styleClass, pureBgClasses[column.backgroundColor])
            }
            // Add padding class
            styleClass = cn(styleClass, paddingClasses[column.columnPadding || 'none'])

            const imageShapeClass = imageShapeClasses[column.imageShape || 'rounded']
            const imageEl = column.image && typeof column.image === 'object' && (
              <div className={cn(
                "w-full mb-4 overflow-hidden relative",
                column.imageShape === 'circle' ? 'rounded-full max-w-[200px] mx-auto aspect-square' : 'rounded-xl shadow-xs',
                column.imageShape === 'original' ? 'max-h-none' : 'max-h-[300px]'
              )}>
                <Media resource={column.image} className="w-full h-full" imgClassName={imageShapeClass} />
              </div>
            )

            // Check if this column has dynamic blocks configuration
            // @ts-ignore
            const hasDynamicBlocks = column.blocks && Array.isArray(column.blocks) && column.blocks.length > 0

            return (
              <div
                key={idx}
                className={cn(
                  'flex flex-col h-full justify-between transition-all duration-200',
                  colSpan,
                  styleClass,
                  isLightText ? 'text-white' : 'text-slate-800 dark:text-slate-200'
                )}
              >
                {hasDynamicBlocks ? (
                  <div className={cn("flex flex-col w-full space-y-6 h-full", alignClass)}>
                    {/* @ts-ignore */}
                    {column.blocks.map((block: any, bIdx: number) => {
                      switch (block.blockType) {
                        case 'colRichText':
                          return (
                            <div
                              key={bIdx}
                              className={cn(
                                'w-full prose prose-sm dark:prose-invert',
                                isLightText
                                  ? 'prose-headings:text-white prose-p:text-white/90 prose-strong:text-white prose-a:text-brand-gold'
                                  : 'prose-headings:text-brand-navy prose-a:text-brand-red'
                              )}
                            >
                              <RichText data={block.content} enableGutter={false} />
                            </div>
                          )
                        case 'colCard': {
                          const hasCardImg = block.image && typeof block.image === 'object'
                          const cardThemeStyles = {
                            standard: 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs text-slate-800 dark:text-slate-200',
                            slate: 'bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 text-slate-800 dark:text-slate-200',
                            border: 'bg-transparent border-2 border-brand-gold/30 dark:border-brand-gold/20',
                          }
                          return (
                            <div
                              key={bIdx}
                              className={cn(
                                'rounded-xl p-5 border text-left flex flex-col w-full transition-all duration-300 hover:shadow-md',
                                cardThemeStyles[block.cardStyle as keyof typeof cardThemeStyles] || cardThemeStyles.standard
                              )}
                            >
                              {hasCardImg && (
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4 bg-slate-100 dark:bg-slate-800">
                                  <Media resource={block.image} fill className="w-full h-full object-cover" />
                                </div>
                              )}
                              {block.title && (
                                <h4 className="text-lg font-bold font-serif text-brand-navy dark:text-white mb-2 uppercase tracking-wide">
                                  {block.title}
                                </h4>
                              )}
                              {block.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 flex-grow">
                                  {block.description}
                                </p>
                              )}
                              {block.ctaLabel && block.ctaLink && (
                                <div className="mt-auto">
                                  <Link
                                    href={block.ctaLink}
                                    className="inline-flex items-center text-sm font-semibold text-brand-red dark:text-brand-gold hover:underline"
                                  >
                                    {block.ctaLabel}
                                    <span className="ml-1">→</span>
                                  </Link>
                                </div>
                              )}
                            </div>
                          )
                        }
                        case 'colImage': {
                          const hasImg = block.image && typeof block.image === 'object'
                          if (!hasImg) return null
                          const shapeClasses = {
                            original: 'rounded-xl object-contain w-full h-auto',
                            square: 'rounded-none aspect-square object-cover w-full h-full',
                            video: 'rounded-xl aspect-video object-cover w-full h-full',
                            circle: 'rounded-full aspect-square object-cover mx-auto max-w-[200px]',
                          }
                          return (
                            <div key={bIdx} className="w-full">
                              <div className={cn(
                                "w-full overflow-hidden relative shadow-xs",
                                block.aspectRatio === 'circle' ? 'rounded-full max-w-[200px] mx-auto aspect-square' : 'rounded-xl',
                                block.aspectRatio === 'original' ? 'max-h-none' : 'max-h-[300px]'
                              )}>
                                <Media resource={block.image} className="w-full h-full" imgClassName={shapeClasses[block.aspectRatio as keyof typeof shapeClasses]} />
                              </div>
                              {block.caption && (
                                <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2 italic">
                                  {block.caption}
                                </p>
                              )}
                            </div>
                          )
                        }
                        case 'colCta': {
                          const btnStyleClasses = {
                            primary: 'bg-brand-navy text-white border-brand-navy hover:bg-slate-900 hover:border-slate-900',
                            secondary: 'bg-brand-red text-white border-brand-red hover:bg-red-750',
                            outline: 'bg-transparent text-brand-navy dark:text-white border-brand-navy dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800',
                          }
                          return (
                            <div key={bIdx} className="w-full py-1">
                              <Link
                                href={block.link}
                                className={cn(
                                  'inline-block px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wider transition-all duration-200 border-2 shadow-xs hover:shadow-sm',
                                  btnStyleClasses[block.style as keyof typeof btnStyleClasses] || btnStyleClasses.primary
                                )}
                              >
                                {block.label}
                              </Link>
                            </div>
                          )
                        }
                        case 'colEmbed': {
                          const getEmbedUrl = (url: string) => {
                            if (!url) return ''
                            let id = ''
                            if (url.includes('youtube.com/watch')) {
                              id = url.split('v=')[1]?.split('&')[0] || ''
                            } else if (url.includes('youtu.be/')) {
                              id = url.split('youtu.be/')[1]?.split('?')[0] || ''
                            } else if (url.includes('youtube.com/embed/')) {
                              id = url.split('youtube.com/embed/')[1]?.split('?')[0] || ''
                            }
                            if (id) return `https://www.youtube.com/embed/${id}`
                            
                            if (url.includes('vimeo.com/')) {
                              id = url.split('vimeo.com/')[1]?.split('?')[0] || ''
                              if (id) return `https://player.vimeo.com/video/${id}`
                            }
                            return url
                          }
                          const embedUrl = getEmbedUrl(block.videoUrl)
                          if (!embedUrl) return null
                          return (
                            <div key={bIdx} className="w-full aspect-video rounded-xl overflow-hidden shadow-xs bg-black">
                              <iframe
                                src={embedUrl}
                                className="w-full h-full border-0"
                                allowFullScreen
                                loading="lazy"
                                title="Embedded video player"
                              />
                            </div>
                          )
                        }
                        default:
                          return null
                      }
                    })}
                  </div>
                ) : (
                  // Fallback to legacy static fields
                  <div className="flex flex-col h-full justify-between w-full">
                    <div className="flex flex-col h-full w-full">
                      {column.imagePosition === 'top' && imageEl}

                      <div className={cn('w-full flex-grow', alignClass)}>
                        {column.title && (
                          <h3
                            className={cn(
                              'text-xl md:text-2xl font-serif font-bold mb-3 tracking-wide uppercase',
                              isLightText ? 'text-white' : 'text-brand-navy dark:text-white'
                            )}
                          >
                            {column.title}
                          </h3>
                        )}

                        {column.content && (
                          <div className={cn('w-full prose prose-sm dark:prose-invert', isLightText ? 'prose-headings:text-white prose-p:text-white/90 prose-strong:text-white prose-a:text-brand-gold' : 'prose-headings:text-brand-navy prose-a:text-brand-red')}>
                            <RichText data={column.content} enableGutter={false} />
                          </div>
                        )}
                      </div>

                      {column.imagePosition === 'bottom' && imageEl}
                    </div>

                    {column.ctaLabel && column.ctaLink && (
                      <div className={cn('mt-6 w-full', alignClass)}>
                        <Link
                          href={column.ctaLink}
                          className={cn(
                            'inline-block px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wider transition-all duration-200 border-2 shadow-xs hover:shadow-sm',
                            isLightText
                              ? 'bg-white text-brand-navy border-white hover:bg-slate-100'
                              : column.backgroundColor === 'transparent' && column.columnStyle === 'simple'
                              ? 'bg-brand-navy text-white border-brand-navy hover:bg-slate-900 hover:border-slate-900'
                              : 'bg-brand-red text-white border-brand-red hover:bg-red-750'
                          )}
                        >
                          {column.ctaLabel}
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
