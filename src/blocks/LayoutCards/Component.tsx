import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import RichText from '@/components/RichText'

// Helper to convert hex and opacity to rgba
function getRGBA(hex: string, opacity: number) {
  if (!hex) return `rgba(0,0,0,0)`
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
}

type Card = {
  icon?: string
  cardTitle: any
  cardSubtitle?: any
  backgroundImage: { url: string; alt?: string } | string
  overlayColor?: string
  overlayOpacity?: number
  link?: string
}

type LayoutCardsProps = {
  sectionHeading?: string
  sectionDescription?: string
  headingAlignment?: 'left' | 'center' | 'right'
  columns?: '2' | '3' | '4'
  cards: Card[]
}

const colsMap: Record<string, string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-2 lg:grid-cols-4',
}

export const LayoutCardsBlock: React.FC<LayoutCardsProps> = ({
  sectionHeading,
  sectionDescription,
  headingAlignment = 'center',
  columns = '4',
  cards,
}) => {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto w-full">
      {(sectionHeading || sectionDescription) && (
        <div className={`mb-12 ${headingAlignment === 'center' ? 'text-center' : headingAlignment === 'right' ? 'text-right' : 'text-left'}`}>
          {sectionHeading && <h2 className="text-3xl md:text-4xl font-bold mb-4">{sectionHeading}</h2>}
          {sectionDescription && <p className="text-gray-600 max-w-2xl mx-auto">{sectionDescription}</p>}
        </div>
      )}
      
      <div className={`grid grid-cols-1 ${colsMap[columns]} gap-4`}>
        {cards?.map((card, i) => {
          const imageUrl = typeof card.backgroundImage === 'object' ? card.backgroundImage?.url : card.backgroundImage
          const overlayColor = card.overlayColor || '#000000'
          const overlayOpacity = card.overlayOpacity ?? 60
          
          // Dynamically get the icon component from Lucide
          const IconComponent = card.icon && (LucideIcons as any)[card.icon] 
            ? (LucideIcons as any)[card.icon] 
            : null

          const CardContent = (
            <div className="relative w-full h-full min-h-[320px] rounded-xl overflow-hidden group cursor-pointer shadow-md transition-transform hover:-translate-y-1 flex flex-col">
              {/* Background Image */}
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={typeof card.backgroundImage === 'object' ? card.backgroundImage?.alt || card.cardTitle : card.cardTitle}
                  fill
                  className="object-cover z-0 transition-transform duration-500 group-hover:scale-105"
                />
              )}
              
              {/* Overlay */}
              <div 
                className="absolute inset-0 z-10"
                style={{ backgroundColor: getRGBA(overlayColor, overlayOpacity) }}
              />

              {/* Content */}
              <div className="relative z-20 flex flex-col justify-between p-6 flex-1 h-full">
                <div>
                  {IconComponent && (
                    <div className="mb-6">
                      <IconComponent className="text-white w-8 h-8" strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="text-white text-xl md:text-2xl font-semibold mb-2 leading-tight [&_p]:m-0">
                    {card.cardTitle && typeof card.cardTitle === 'object' ? (
                      <RichText data={card.cardTitle} enableGutter={false} enableProse={false} />
                    ) : (
                      <p>{card.cardTitle}</p>
                    )}
                  </div>
                  {card.cardSubtitle && (
                    <div className="text-white/90 text-sm md:text-base font-medium mt-1 [&_p]:m-0">
                      {typeof card.cardSubtitle === 'object' ? (
                        <RichText data={card.cardSubtitle} enableGutter={false} enableProse={false} />
                      ) : (
                        <p>{card.cardSubtitle}</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex-shrink-0">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-gray-50 transition-colors">
                    <ArrowRight className="text-gray-800 w-5 h-5" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </div>
          )

          return card.link ? (
            <Link href={card.link} key={i} className="h-full block">
              {CardContent}
            </Link>
          ) : (
            <div key={i} className="h-full block">{CardContent}</div>
          )
        })}
      </div>
    </section>
  )
}
