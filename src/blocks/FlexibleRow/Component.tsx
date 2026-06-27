import React from 'react'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import { StatsImpactBlock } from '@/blocks/Statistics/Component'
import { FileDownloadsComponent } from '@/blocks/FileDownloads/Component'

// Simple placeholder renderer for missing complex blocks
const PlaceholderBlock = ({ name }: { name: string }) => (
  <div className="p-4 bg-gray-100 border border-dashed border-gray-400 rounded text-center text-sm text-gray-500">
    [ {name} Block - Frontend implementation pending ]
  </div>
)

export const FlexibleRowComponent: React.FC<any> = ({
  sectionHeading,
  sectionDescription,
  headingAlignment,
  sectionBgColor,
  radialGlow,
  gap,
  verticalAlign,
  columns,
}) => {
  if (!columns || columns.length === 0) return null

  // Process Gap
  const gapClassMap: Record<string, string> = {
    '0': 'gap-0',
    '4': 'gap-4',
    '6': 'gap-6',
    '8': 'gap-8',
    '12': 'gap-12',
  }

  // Process Alignment
  const alignClassMap: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  // Process Width
  const widthClassMap: Record<string, string> = {
    auto: 'col-span-1 lg:col-span-auto flex-1',
    '25': 'col-span-1 lg:col-span-3',
    '33': 'col-span-1 lg:col-span-4',
    '50': 'col-span-1 lg:col-span-6',
    '66': 'col-span-1 lg:col-span-8',
    '75': 'col-span-1 lg:col-span-9',
    '100': 'col-span-1 lg:col-span-12 w-full',
  }

  const paddingClassMap: Record<string, string> = {
    '0': 'p-0',
    '4': 'p-4',
    '6': 'p-6 md:p-8',
    '8': 'p-8 md:p-12',
  }

  return (
    <div
      className={cn('w-full relative overflow-hidden py-16')}
      style={{ backgroundColor: sectionBgColor || 'transparent' }}
    >
      {radialGlow && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[800px] h-[800px] bg-brand-gold/10 rounded-full blur-[100px]" />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        {(sectionHeading || sectionDescription) && (
          <div
            className={cn('mb-12 flex flex-col', {
              'items-start text-left': headingAlignment === 'left',
              'items-center text-center': headingAlignment === 'center' || !headingAlignment,
              'items-end text-right': headingAlignment === 'right',
            })}
          >
            {sectionHeading && <h2 className="text-3xl md:text-4xl font-bold mb-4">{sectionHeading}</h2>}
            {sectionDescription && <p className="text-lg opacity-80 max-w-3xl">{sectionDescription}</p>}
          </div>
        )}

        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-12',
            gapClassMap[gap || '6'],
            alignClassMap[verticalAlign || 'start']
          )}
        >
          {columns.map((column: any, idx: number) => {
            const colWidth = widthClassMap[column.width || 'auto']
            const colPadding = paddingClassMap[column.padding || '0']
            
            return (
              <div
                key={idx}
                className={cn('flex flex-col', colWidth, colPadding)}
                style={{ backgroundColor: column.columnBgColor || 'transparent' }}
              >
                {column.blocks && column.blocks.map((block: any, bIdx: number) => {
                  switch (block.blockType) {
                    case 'flexRichText':
                      return (
                        <div key={bIdx} className="prose prose-sm md:prose-base max-w-none" style={{ color: block.textColor }}>
                          <RichText data={block.content} enableGutter={false} />
                        </div>
                      )
                    case 'flexImage':
                      return (
                        <div key={bIdx} className="w-full">
                          {block.image && typeof block.image === 'object' && (
                            <div className={cn('relative w-full overflow-hidden mb-2', {
                              'rounded-none': block.rounded === 'none',
                              'rounded-sm': block.rounded === 'sm',
                              'rounded-md': block.rounded === 'md',
                              'rounded-lg': block.rounded === 'lg' || !block.rounded,
                              'rounded-full aspect-square': block.rounded === 'full',
                            })}>
                              <Media
                                resource={block.image}
                                className={cn('w-full', {
                                  'object-cover h-full': block.objectFit === 'cover',
                                  'object-contain': block.objectFit === 'contain',
                                  'object-none': block.objectFit === 'none',
                                })}
                              />
                            </div>
                          )}
                          {block.caption && (
                            <p className="text-sm mt-1 text-center" style={{ color: block.captionColor }}>
                              {block.caption}
                            </p>
                          )}
                        </div>
                      )
                    case 'flexButtons':
                      return (
                        <div key={bIdx} className={cn('flex flex-wrap gap-4 py-4', {
                          'justify-start': block.alignment === 'left',
                          'justify-center': block.alignment === 'center',
                          'justify-end': block.alignment === 'right',
                        })}>
                          {block.buttons && block.buttons.map((btn: any, btnIdx: number) => {
                            const btnBase = "inline-flex items-center justify-center font-medium transition-all"
                            const sizeClasses = {
                              sm: "px-3 py-1.5 text-sm",
                              md: "px-5 py-2.5 text-base rounded-md",
                              lg: "px-6 py-3 text-lg rounded-lg",
                            }
                            const variantClasses = {
                              primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
                              secondary: "bg-gray-800 text-white hover:bg-gray-900 shadow-md",
                              outline: "border-2 border-gray-300 hover:border-gray-800 text-gray-800",
                              ghost: "bg-transparent text-blue-600 hover:bg-blue-50",
                            }
                            
                            return (
                              <Link
                                key={btnIdx}
                                href={btn.url || '#'}
                                target={btn.openInNewTab ? '_blank' : '_self'}
                                className={cn(
                                  btnBase,
                                  sizeClasses[btn.size as keyof typeof sizeClasses] || sizeClasses.md,
                                  variantClasses[btn.variant as keyof typeof variantClasses] || variantClasses.primary
                                )}
                              >
                                {btn.label}
                              </Link>
                            )
                          })}
                        </div>
                      )
                    case 'flexIcon': {
                      const IconComponent = block.icon ? (LucideIcons as any)[block.icon] : null;
                      const sizeClasses = {
                        sm: 'w-6 h-6',
                        md: 'w-8 h-8',
                        lg: 'w-12 h-12',
                        xl: 'w-16 h-16',
                        '2xl': 'w-20 h-20',
                        '3xl': 'w-24 h-24',
                        '4xl': 'w-32 h-32',
                        '5xl': 'w-40 h-40',
                      };
                      return (
                        <div key={bIdx} className={cn('flex py-4', {
                          'justify-start': block.alignment === 'left',
                          'justify-center': block.alignment === 'center',
                          'justify-end': block.alignment === 'right',
                        })}>
                          {IconComponent ? (
                            <IconComponent 
                              className={cn(sizeClasses[block.size as keyof typeof sizeClasses] || 'w-8 h-8')} 
                              style={{ color: block.color || '#1F2937' }} 
                            />
                          ) : (
                            <div className="text-gray-400 text-sm italic border border-dashed border-gray-300 p-2 rounded">
                              [Icon: {block.icon || 'None'}]
                            </div>
                          )}
                        </div>
                      )
                    }
                    case 'statsImpact':
                      return <StatsImpactBlock key={bIdx} {...block} />
                    case 'fileDownloads':
                      return <FileDownloadsComponent key={bIdx} {...block} />
                    case 'flexVideo':
                      return <PlaceholderBlock key={bIdx} name="Video Embed" />
                    case 'flexCarousel':
                      return <PlaceholderBlock key={bIdx} name="Media Carousel" />
                    case 'flexMapEmbed':
                      return <PlaceholderBlock key={bIdx} name="Map/iFrame Embed" />
                    case 'flexAnimation':
                      return <PlaceholderBlock key={bIdx} name="Lottie/GIF Animation" />
                    case 'flexStatsCards':
                      return <PlaceholderBlock key={bIdx} name="Stats Cards" />
                    case 'flexFeatureCards':
                      return <PlaceholderBlock key={bIdx} name="Feature Cards" />
                    case 'flexHighlightCards': {
                      const cols = block.columns || '2';
                      const gridClasses = {
                        '1': 'grid-cols-1',
                        '2': 'grid-cols-1 sm:grid-cols-2',
                        '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
                      };
                      const titleSizes = {
                        sm: 'text-sm',
                        base: 'text-base',
                        lg: 'text-lg',
                        xl: 'text-xl',
                        '2xl': 'text-2xl',
                      };
                      const isDark = block.theme === 'dark';
                      const alignClasses = {
                        left: 'text-left items-start',
                        center: 'text-center items-center',
                        right: 'text-right items-end',
                      };

                      return (
                        <div key={bIdx} className={cn('grid gap-6 w-full py-4', gridClasses[cols as keyof typeof gridClasses])}>
                          {block.cards && block.cards.map((card: any, cIdx: number) => {
                            const CardIcon = card.icon ? (LucideIcons as any)[card.icon] : null;
                            const animClass = {
                              none: '',
                              hoverLift: 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg',
                              pulse: 'animate-pulse',
                              float: 'animate-bounce',
                            };
                            return (
                              <div
                                key={cIdx}
                                className={cn(
                                  'flex flex-col p-6 rounded-2xl shadow-sm border transition-all duration-300',
                                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-800',
                                  alignClasses[block.iconAlignment as keyof typeof alignClasses] || alignClasses.left,
                                  animClass[card.animation as keyof typeof animClass] || ''
                                )}
                              >
                                {CardIcon && (
                                  <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shrink-0"
                                    style={{ backgroundColor: block.iconBgColor || '#EEF2FF', color: card.iconColor || '#f59e0b' }}
                                  >
                                    <CardIcon className="w-6 h-6" />
                                  </div>
                                )}
                                <h4 className={cn('font-bold mb-2', titleSizes[block.titleSize as keyof typeof titleSizes] || 'text-base')}>
                                  {card.title}
                                </h4>
                                {card.description && (
                                  <p className={cn('text-sm opacity-80', isDark ? 'text-slate-300' : 'text-slate-600')}>
                                    {card.description}
                                  </p>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )
                    }
                    case 'flexDashboardMock':
                      return <PlaceholderBlock key={bIdx} name="Dashboard Mock Panel" />
                    default:
                      return <div key={bIdx}>Unknown block type: {block.blockType}</div>
                  }
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
