import React from 'react'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import { StatsImpactBlock } from '@/blocks/Statistics/Component'
import { FileDownloadsComponent } from '@/blocks/FileDownloads/Component'
import { blockComponents } from '@/blocks/RenderBlocks'

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
            
            const colTheme = column.colorTheme || 'default'
            const themeClasses: Record<string, string> = {
              none: '',
              default: '',
              light: 'bg-white text-slate-900 border border-slate-100 rounded-2xl shadow-sm',
              dark: 'bg-slate-900 text-white rounded-2xl shadow-md',
              primary: 'bg-primary text-primary-foreground rounded-2xl shadow-md',
              secondary: 'bg-secondary text-secondary-foreground rounded-2xl shadow-md',
            }

            return (
              <div
                key={idx}
                className={cn('flex flex-col relative overflow-hidden', colWidth, colPadding, themeClasses[colTheme])}
                style={column.columnBgColor && column.columnBgColor !== 'transparent' ? { backgroundColor: column.columnBgColor } : {}}
                data-theme={colTheme === 'dark' ? 'dark' : undefined}
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
                      // Determine max width and height styles
                      let maxWidthStyle = '100%'
                      let heightStyle = 'auto'
                      if (block.imageSize === 'large') {
                        maxWidthStyle = '75%'
                      } else if (block.imageSize === 'medium') {
                        maxWidthStyle = '50%'
                      } else if (block.imageSize === 'small') {
                        maxWidthStyle = '25%'
                      } else if (block.imageSize === 'custom') {
                        maxWidthStyle = block.customWidth || '300px'
                        heightStyle = block.customHeight || 'auto'
                      }

                      // Determine flex horizontal alignment for parent wrapper
                      const flexAlignmentClass = cn('w-full flex', {
                        'justify-start': block.alignment === 'left',
                        'justify-center': block.alignment === 'center' || !block.alignment,
                        'justify-end': block.alignment === 'right',
                      })

                      const isHeightFixed = heightStyle !== 'auto'

                      return (
                        <div key={bIdx} className={flexAlignmentClass}>
                          <div
                            className="w-full flex flex-col items-stretch"
                            style={{
                              maxWidth: maxWidthStyle,
                              height: isHeightFixed ? heightStyle : undefined,
                            }}
                          >
                            {block.image && typeof block.image === 'object' && (
                              <div
                                className={cn('relative w-full overflow-hidden mb-2', {
                                  'rounded-none': block.rounded === 'none',
                                  'rounded-sm': block.rounded === 'sm',
                                  'rounded-md': block.rounded === 'md',
                                  'rounded-lg': block.rounded === 'lg' || !block.rounded,
                                  'rounded-full aspect-square': block.rounded === 'full',
                                })}
                                style={{
                                  height: isHeightFixed ? '100%' : undefined,
                                }}
                              >
                                <Media
                                  resource={block.image}
                                  className={cn('w-full', {
                                    'object-cover h-full': block.objectFit === 'cover' || isHeightFixed,
                                    'object-contain h-full': block.objectFit === 'contain' && isHeightFixed,
                                    'object-contain': block.objectFit === 'contain' && !isHeightFixed,
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
                    case 'flexVideo': {
                      const getUrl = () => {
                        if (block.videoSource === 'youtube') return block.youtubeUrl;
                        if (block.videoSource === 'vimeo') return block.vimeoUrl;
                        if (block.videoSource === 'externalUrl') return block.externalVideoUrl;
                        if (block.videoSource === 'upload' && block.uploadedVideo) {
                           return typeof block.uploadedVideo === 'object' ? block.uploadedVideo.url : block.uploadedVideo;
                        }
                        return null;
                      };
                      const url = getUrl();
                      if (!url) return <div key={bIdx} className="text-gray-400 text-sm">No video source provided</div>;

                      const containerClasses = cn(
                        "w-full rounded-xl overflow-hidden shadow-lg bg-card border border-border flex flex-col",
                        block.hoverLift && "transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                      );

                      const renderVideo = () => {
                        if (block.videoSource === 'youtube' || block.videoSource === 'vimeo') {
                          let embedUrl = url;
                          if (block.videoSource === 'youtube' && url.includes('watch?v=')) {
                            embedUrl = url.replace('watch?v=', 'embed/');
                          }
                          return (
                            <div className="relative w-full aspect-video bg-black">
                              <iframe 
                                src={`${embedUrl}${block.autoplay ? '?autoplay=1&mute=1' : ''}`}
                                className="absolute inset-0 w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen 
                              />
                            </div>
                          )
                        }
                        
                        const poster = block.poster && typeof block.poster === 'object' ? block.poster.url : undefined;
                        return (
                          <div className="w-full bg-black flex justify-center">
                            <video 
                              src={url}
                              poster={poster}
                              className="w-full h-auto max-h-[600px] object-contain"
                              autoPlay={block.autoplay}
                              loop={block.loop}
                              controls={block.controls !== false}
                              muted={block.autoplay}
                              playsInline
                            />
                          </div>
                        )
                      };

                      return (
                        <div key={bIdx} className={containerClasses}>
                          {renderVideo()}
                          {(block.videoTitle || block.videoDescription) && (
                            <div className="p-6 flex flex-col gap-2">
                              {block.videoTitle && (
                                <h3 className="text-xl font-bold text-card-foreground">
                                  {block.videoTitle}
                                </h3>
                              )}
                              {block.videoDescription && (
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                  {block.videoDescription}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    }
                    case 'flexCarousel': {
                      if (!block.slides || block.slides.length === 0) return null;
                      return (
                        <div key={bIdx} className="w-full overflow-hidden rounded-xl shadow-lg relative group">
                          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4">
                            {block.slides.map((slide: any, sIdx: number) => {
                              return (
                                <div key={sIdx} className="min-w-[85%] md:min-w-[65%] snap-center shrink-0 flex flex-col rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800">
                                  {slide.mediaType === 'image' && slide.image && typeof slide.image === 'object' && (
                                    <div className="relative w-full h-64 md:h-80">
                                      <Media resource={slide.image} fill imgClassName="object-cover" />
                                    </div>
                                  )}
                                  {slide.mediaType === 'video' && slide.video && typeof slide.video === 'object' && (
                                    <video src={slide.video.url} className="w-full h-64 md:h-80 object-cover" autoPlay muted loop playsInline />
                                  )}
                                  {slide.mediaType === 'youtube' && slide.youtubeUrl && (
                                    <iframe src={slide.youtubeUrl.replace('watch?v=', 'embed/')} className="w-full h-64 md:h-80 border-0" allowFullScreen />
                                  )}
                                  {slide.caption && (
                                    <div className="p-4 text-sm text-center text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700">
                                      {slide.caption}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    }
                    case 'flexMapEmbed': {
                      const height = block.height || 400;
                      if (block.embedType === 'html' && block.html) {
                        return <div key={bIdx} className="w-full overflow-hidden rounded-xl shadow-md" style={{ minHeight: height }} dangerouslySetInnerHTML={{ __html: block.html }} />
                      }
                      if (block.embedType === 'iframe' && block.iframeUrl) {
                        return (
                          <div key={bIdx} className="w-full overflow-hidden rounded-xl shadow-md" style={{ height }}>
                            <iframe src={block.iframeUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                          </div>
                        )
                      }
                      return <PlaceholderBlock key={bIdx} name="Map/iFrame Embed" />
                    }
                    case 'flexAnimation': {
                      return (
                        <div key={bIdx} className="w-full flex justify-center py-4">
                          {block.animationType === 'gif' && block.gif && typeof block.gif === 'object' ? (
                            <img src={block.gif.url} alt={block.gif.alt || 'Animation'} className="max-w-full rounded-xl" />
                          ) : (
                            <div className="p-8 border border-dashed border-gray-300 rounded-xl text-gray-500 text-center w-full bg-gray-50">
                              [ Lottie Animation Placeholder: {block.lottieUrl || 'No URL'} ]<br/>
                              <span className="text-xs">Requires lottie-react package to render JSON</span>
                            </div>
                          )}
                        </div>
                      )
                    }
                    case 'flexStatsCards': {
                      const cols = block.columns || '4';
                      const gridClasses = {
                        '1': 'grid-cols-1',
                        '2': 'grid-cols-1 sm:grid-cols-2',
                        '3': 'grid-cols-1 sm:grid-cols-3',
                        '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
                      };
                      const cardStyle = block.cardStyle || 'outline';

                      return (
                        <div key={bIdx} className={cn('grid gap-6 w-full py-4', gridClasses[cols as keyof typeof gridClasses])}>
                          {block.cards && block.cards.map((card: any, cIdx: number) => {
                            const StatIcon = card.icon ? (LucideIcons as any)[card.icon] : null;
                            const animClass = {
                              none: '',
                              hoverLift: 'transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl',
                              pulse: 'animate-pulse',
                              float: 'animate-bounce',
                            };
                            
                            const styleClasses = {
                              outline: 'border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900',
                              elevated: 'bg-white shadow-lg shadow-gray-200/50 border border-gray-100 dark:shadow-none dark:border-gray-800 dark:bg-gray-800',
                              soft: 'bg-gray-50 border border-transparent dark:bg-gray-800/50 dark:border-gray-800',
                              duccAbout: 'border-t-4 bg-white shadow-sm dark:bg-gray-800',
                            };

                            const isDucc = cardStyle === 'duccAbout';

                            return (
                              <div
                                key={cIdx}
                                className={cn(
                                  'flex flex-col p-6 rounded-2xl transition-all duration-300 relative overflow-hidden',
                                  styleClasses[cardStyle as keyof typeof styleClasses] || styleClasses.outline,
                                  animClass[card.animation as keyof typeof animClass] || '',
                                  isDucc && 'items-center text-center'
                                )}
                                style={isDucc ? { borderTopColor: card.iconColor || 'var(--color-primary)' } : {}}
                              >
                                {/* Decorative background element for elevated style */}
                                {cardStyle === 'elevated' && (
                                  <div 
                                    className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 pointer-events-none"
                                    style={{ backgroundColor: card.iconColor || 'var(--color-primary)' }}
                                  />
                                )}

                                <div className={cn("flex w-full mb-4", isDucc ? "justify-center" : "items-start justify-between")}>
                                  {StatIcon && (
                                    <div 
                                      className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-gray-800/80 shadow-inner"
                                      style={isDucc ? { backgroundColor: card.iconColor ? `${card.iconColor}15` : '' } : {}}
                                    >
                                      <StatIcon className="w-7 h-7" style={{ color: card.iconColor || 'var(--color-primary)' }} />
                                    </div>
                                  )}
                                  {!isDucc && (card.trend || card.trendLabel) && (
                                    <div className={cn(
                                      "flex items-center space-x-1 text-xs font-bold px-3 py-1 rounded-full",
                                      (card.trend?.includes('+') || card.trend?.includes('Up') || card.trend?.includes('increase')) 
                                        ? "text-emerald-700 bg-emerald-100/80 dark:bg-emerald-900/40 dark:text-emerald-400" 
                                        : "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
                                    )}>
                                      {card.trend && <span>{card.trend}</span>}
                                    </div>
                                  )}
                                </div>
                                <div className={cn("w-full", isDucc && "flex flex-col items-center")}>
                                  <h3 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2">
                                    {card.value}
                                  </h3>
                                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                    {card.label}
                                  </p>
                                  {isDucc && (card.trend || card.trendLabel) && (
                                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-3 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
                                      {card.trend} {card.trendLabel}
                                    </p>
                                  )}
                                  {!isDucc && card.trendLabel && (
                                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-3">
                                      {card.trendLabel}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    }
                    case 'flexFeatureCards': {
                      const cols = block.columns || '3';
                      const gridClasses = {
                        '1': 'grid-cols-1',
                        '2': 'grid-cols-1 sm:grid-cols-2',
                        '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
                        '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
                      };
                      const cardStyle = block.cardStyle || 'borderTop';
                      const styleClasses = {
                        borderTop: 'bg-white border-t-4 border-gray-100 shadow-md dark:bg-gray-800 dark:border-gray-700',
                        outline: 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700',
                        darkGlass: 'bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-white shadow-xl',
                      };

                      return (
                        <div key={bIdx} className={cn('grid gap-6 w-full py-4', gridClasses[cols as keyof typeof gridClasses])}>
                          {block.cards && block.cards.map((card: any, cIdx: number) => {
                            const CardIcon = card.icon ? (LucideIcons as any)[card.icon] : null;
                            const animClass = {
                              none: '',
                              hoverLift: 'transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl',
                              pulse: 'animate-pulse',
                              float: 'animate-bounce',
                            };
                            
                            const isDarkGlass = cardStyle === 'darkGlass';

                            return (
                              <div
                                key={cIdx}
                                className={cn(
                                  'flex flex-col p-6 rounded-2xl relative overflow-hidden transition-all duration-300',
                                  styleClasses[cardStyle as keyof typeof styleClasses] || styleClasses.borderTop,
                                  animClass[card.animation as keyof typeof animClass] || ''
                                )}
                                style={cardStyle === 'borderTop' ? { borderTopColor: card.accentColor || 'var(--color-primary)' } : {}}
                              >
                                {CardIcon && (
                                  <div 
                                    className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-5 shrink-0", isDarkGlass ? 'bg-white/10' : 'bg-gray-50 dark:bg-gray-700')}
                                  >
                                    <CardIcon className="w-7 h-7" style={{ color: card.iconColor || (isDarkGlass ? '#fff' : 'var(--color-primary)') }} />
                                  </div>
                                )}
                                
                                {card.title && (
                                  <div className={cn("prose prose-sm md:prose-base max-w-none mb-2", isDarkGlass ? "prose-invert" : "dark:prose-invert")}>
                                    <RichText data={card.title} enableGutter={false} />
                                  </div>
                                )}

                                {card.subtitle && (
                                  <p className={cn("text-sm font-semibold tracking-wider uppercase mb-3", isDarkGlass ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400')}>
                                    {card.subtitle}
                                  </p>
                                )}

                                {card.description && (
                                  <div className={cn("prose prose-sm md:prose-base max-w-none mb-4", isDarkGlass ? "prose-invert text-gray-300" : "text-gray-600 dark:text-gray-300 dark:prose-invert")}>
                                    <RichText data={card.description} enableGutter={false} />
                                  </div>
                                )}
                                
                                {card.points && card.points.length > 0 && (
                                  <ul className="mt-auto space-y-2 pt-4">
                                    {card.points.map((pt: any, pIdx: number) => (
                                      <li key={pIdx} className={cn("flex items-start text-sm", isDarkGlass ? "text-gray-200" : "text-gray-700 dark:text-gray-300")}>
                                        <LucideIcons.CheckCircle2 className="w-5 h-5 mr-2 shrink-0 mt-0.5" style={{ color: card.accentColor || '#10b981' }} />
                                        <span>{pt.text}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )
                    }
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
                    case 'flexDashboardMock': {
                      const isDark = block.theme === 'dark';
                      return (
                        <div key={bIdx} className={cn(
                          "w-full rounded-2xl border shadow-2xl overflow-hidden flex flex-col",
                          isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
                        )}>
                          {/* Top bar */}
                          <div className={cn(
                            "px-6 py-4 flex items-center justify-between border-b",
                            isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-100 bg-gray-50/50"
                          )}>
                            <div className="flex space-x-2">
                              <div className="w-3 h-3 rounded-full bg-red-400" />
                              <div className="w-3 h-3 rounded-full bg-amber-400" />
                              <div className="w-3 h-3 rounded-full bg-emerald-400" />
                            </div>
                            <div className={cn("text-xs font-medium px-3 py-1 rounded-full", isDark ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-500")}>
                              {block.topBadgeLabel || 'DASHBOARD PREVIEW'}
                            </div>
                          </div>
                          
                          {/* Body */}
                          <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
                            <h3 className={cn("text-4xl md:text-5xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")} style={{ color: block.topBadgeValueColor || undefined }}>
                              {block.topBadgeValue || '1,000+'}
                            </h3>
                            <div className="flex flex-wrap justify-center gap-3">
                              {block.bottomChipPrimary && (
                                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                  {block.bottomChipPrimary}
                                </span>
                              )}
                              {block.bottomChipSecondary && (
                                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                  {block.bottomChipSecondary}
                                </span>
                              )}
                            </div>
                            {block.bottomSummary && (
                              <p className={cn("max-w-md mx-auto", isDark ? "text-slate-400" : "text-slate-600")} style={{ color: block.bottomSummaryColor || undefined }}>
                                {block.bottomSummary}
                              </p>
                            )}
                          </div>
                          
                          {/* Mock Charts */}
                          <div className={cn("p-6 grid gap-4 bg-opacity-50", isDark ? "bg-slate-800/50" : "bg-gray-50")}>
                            {Array.from({ length: block.chartCount || 2 }).map((_, i) => (
                              <div key={i} className={cn("h-16 rounded-xl w-full opacity-50 animate-pulse", isDark ? "bg-slate-700" : "bg-gray-200")} style={{ animationDelay: `${i * 150}ms` }} />
                            ))}
                          </div>
                          
                          {block.layoutVariant === 'syncStatusPanel' && block.syncFooterText && (
                            <div className={cn("px-6 py-4 text-xs font-bold tracking-widest text-center border-t", isDark ? "border-slate-800 text-slate-500" : "border-gray-200 text-gray-400")}>
                              {block.syncFooterText}
                            </div>
                          )}
                        </div>
                      )
                    }
                    case 'flexTable': {
                      if (!block.rows || block.rows.length === 0) return null

                      // 1. Padding classes based on selection
                      const paddingMap = {
                        compact: 'px-4 py-2 text-xs md:text-sm',
                        medium: 'px-6 py-4 text-sm md:text-base',
                        spacious: 'px-8 py-5 text-base md:text-lg',
                      }
                      const cellPaddingClass = paddingMap[block.cellPadding as keyof typeof paddingMap] || paddingMap.medium

                      // 2. Corner radius mapping
                      const radiusMap = {
                        none: 'rounded-none',
                        sm: 'rounded-sm',
                        md: 'rounded-md',
                        lg: 'rounded-lg',
                        xl: 'rounded-xl',
                        '2xl': 'rounded-2xl',
                      }
                      const borderRadiusClass = radiusMap[block.borderRadius as keyof typeof radiusMap] || radiusMap.xl

                      // 3. Shadow mapping
                      const shadowMap = {
                        none: 'shadow-none',
                        xs: 'shadow-xs',
                        sm: 'shadow-sm',
                        md: 'shadow-md border border-slate-150 dark:border-slate-800',
                        lg: 'shadow-lg border border-slate-150 dark:border-slate-800',
                      }
                      const shadowClass = shadowMap[block.shadow as keyof typeof shadowMap] || shadowMap.sm

                      // Find max column count across all rows
                      const maxCols = Math.max(...block.rows.map((r: any) => (r.cells || []).length), 1)

                      // 4. Style Themes
                      const theme = block.tableTheme || 'gradient'
                      const isGlass = theme === 'glass'
                      const isMinimal = theme === 'minimal'
                      const isBrutalist = theme === 'brutalist'

                      let tableContainerClass = cn("overflow-x-auto transition-all duration-300", borderRadiusClass, shadowClass)
                      let tableElementClass = "min-w-full text-left border-collapse"
                      
                      if (isGlass) {
                        tableContainerClass = cn(
                          tableContainerClass,
                          "bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/30"
                        )
                      } else if (isMinimal) {
                        tableContainerClass = cn(tableContainerClass, "bg-transparent shadow-none border-none")
                      } else if (isBrutalist) {
                        tableContainerClass = cn(tableContainerClass, "bg-white dark:bg-slate-950 border-3 border-slate-900 dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]")
                      } else { // gradient theme / standard card
                        tableContainerClass = cn(tableContainerClass, "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800")
                      }

                      // Header styling
                      const headerStyle = {
                        backgroundColor: block.headerBgColor || '#1A103D',
                        color: '#FFFFFF'
                      }

                      return (
                        <div key={bIdx} className="w-full my-8 group/table">
                          {/* Heading & Subtitle Block */}
                          {(block.heading || block.subtitle || block.icon) && (
                            <div className={cn(
                              "flex flex-col mb-6 gap-1",
                              block.headingAlignment === 'left' && "text-left items-start",
                              block.headingAlignment === 'right' && "text-right items-end",
                              (block.headingAlignment === 'center' || !block.headingAlignment) && "text-center items-center"
                            )}>
                              <div className="flex items-center gap-2.5">
                                {(() => {
                                  const IconComponent = block.icon ? (LucideIcons as any)[block.icon] : null;
                                  if (!IconComponent) return null;

                                  const sizeClasses = {
                                    sm: 'w-5 h-5',
                                    md: 'w-6 h-6',
                                    lg: 'w-8 h-8',
                                    xl: 'w-10 h-10',
                                  };
                                  const iconSizeClass = sizeClasses[block.iconSize as keyof typeof sizeClasses] || sizeClasses.md;

                                  return (
                                    <IconComponent
                                      className="shrink-0"
                                      style={{ color: block.iconColor || '#1A103D', width: '1.5rem', height: '1.5rem' }}
                                    />
                                  );
                                })()}
                                {block.heading && (
                                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-serif">
                                    {block.heading}
                                  </h3>
                                )}
                              </div>
                              {block.subtitle && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl font-sans">
                                  {block.subtitle}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Scroll wrapper */}
                          <div className="relative">
                            <div className={tableContainerClass}>
                              <table className={tableElementClass}>
                                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/40">
                                  {block.rows.map((row: any, rowIndex: number) => {
                                    const cells = row.cells || []
                                    const isSingleCell = cells.length === 1 && maxCols > 1

                                    if (row.isHeader) {
                                      return (
                                        <tr 
                                          key={rowIndex} 
                                          className={cn(
                                            "font-semibold tracking-wide uppercase text-sm border-b",
                                            isSingleCell ? "text-center" : "text-left"
                                          )}
                                          style={headerStyle}
                                        >
                                          {isSingleCell ? (
                                            <th
                                              colSpan={maxCols}
                                              className={cellPaddingClass}
                                            >
                                              {cells[0].value || ''}
                                            </th>
                                          ) : (
                                            cells.map((cell: any, cellIndex: number) => (
                                              <th
                                                key={cellIndex}
                                                className={cn(
                                                  cellPaddingClass,
                                                  block.bordered && !isMinimal ? "border-r border-white/10 last:border-r-0" : ""
                                                )}
                                              >
                                                {cell.value || ''}
                                              </th>
                                            ))
                                          )}
                                        </tr>
                                      )
                                    }

                                    // Dynamic Row Styling
                                    const isAlternate = rowIndex % 2 !== 0
                                    let rowStyle: React.CSSProperties = {}
                                    if (block.stripedRows && isAlternate && !isMinimal) {
                                      rowStyle.backgroundColor = '#F8FAFC'
                                    }

                                    // Border rules
                                    const cellBorderClass = block.bordered && !isMinimal
                                      ? `border-r border-slate-200 dark:border-slate-800 last:border-r-0`
                                      : ''

                                    return (
                                      <tr
                                        key={rowIndex}
                                        className={cn(
                                          "transition-all duration-200",
                                          block.hoverEffect && !isMinimal && "hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:translate-x-0.5"
                                        )}
                                        style={rowStyle}
                                      >
                                        {isSingleCell ? (
                                          <td
                                            colSpan={maxCols}
                                            className={cn(
                                              cellPaddingClass,
                                              "text-slate-700 dark:text-slate-300 font-serif leading-relaxed text-center font-medium"
                                            )}
                                          >
                                            {cells[0].value || ''}
                                          </td>
                                        ) : (
                                          cells.map((cell: any, cellIndex: number) => {
                                            const cellVal = cell.value || ''
                                            // Check if it's a number to right align
                                            const isNumeric = !isNaN(Number(cellVal.replace(/[^0-9.-]/g, ''))) && cellVal.trim() !== ''

                                            return (
                                              <td
                                                key={cellIndex}
                                                className={cn(
                                                  cellPaddingClass,
                                                  "text-slate-700 dark:text-slate-300 font-serif leading-relaxed font-sans",
                                                  cellBorderClass,
                                                  isNumeric ? "text-right tabular-nums" : "text-left"
                                                )}
                                              >
                                                {cellVal}
                                              </td>
                                            )
                                          })
                                        )}
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>

                            {/* Swipe Hint overlay (appears on mobile only if width overflows) */}
                            {block.showScrollHint && (
                              <div className="lg:hidden flex items-center justify-center gap-1.5 mt-2.5 text-xs text-slate-400 dark:text-slate-500 select-none">
                                <LucideIcons.ArrowLeft className="w-3.5 h-3.5" />
                                <span>Swipe horizontally to view full table</span>
                                <LucideIcons.ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>

                          {block.caption && (
                            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 font-semibold text-center italic font-sans">
                              {block.caption}
                            </p>
                          )}
                        </div>
                      )
                    }
                    default: {
                      const Block = blockComponents[block.blockType as keyof typeof blockComponents]
                      if (Block) {
                        return <Block key={bIdx} {...block} />
                      }
                      return <div key={bIdx} className="p-4 bg-red-50 text-red-600 border border-red-200 rounded text-center text-sm">Unknown block type: {block.blockType}</div>
                    }
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
