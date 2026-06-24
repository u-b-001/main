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
                <div className="flex flex-col h-full">
                  {/* Render Image on Top */}
                  {column.imagePosition === 'top' && imageEl}

                  {/* Content wrapper */}
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

                  {/* Render Image at Bottom */}
                  {column.imagePosition === 'bottom' && imageEl}
                </div>

                {/* Action Button */}
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
            )
          })}
        </div>
      </div>
    </div>
  )
}
