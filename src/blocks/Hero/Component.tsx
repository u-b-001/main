import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utilities/ui'

type Button = { label: string; url: string; style?: 'primary' | 'secondary' }
type HeroProps = {
  heading: string
  subheading?: string
  image?: { url: string; alt?: string } | string
  buttons?: Button[]
  designSettings?: {
    overlapHeader?: boolean
    imageOpacity?: number
    imageScale?: number
  }
}

export const HeroBlock: React.FC<HeroProps> = ({ heading, subheading, image, buttons, designSettings }) => {
  const imageUrl = typeof image === 'object' ? image?.url : undefined

  const overlap = designSettings?.overlapHeader;
  const opacity = designSettings?.imageOpacity !== undefined ? designSettings.imageOpacity : 40;
  const scale = designSettings?.imageScale ?? 100;

  return (
    <section className={cn(
      "relative flex flex-col items-center justify-center text-center py-24 px-6 bg-black text-white overflow-hidden",
      overlap ? "-mt-20 pt-44 lg:-mt-24 lg:pt-48" : ""
    )}>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={typeof image === 'object' ? image?.alt || '' : ''}
          fill
          className="object-cover -z-10"
          style={{ 
            opacity: opacity / 100,
            transform: scale !== 100 ? `scale(${scale / 100})` : undefined
          }}
        />
      )}
      <h1 className="text-4xl md:text-6xl font-bold max-w-3xl relative z-10">{heading}</h1>
      {subheading && <p className="mt-4 text-lg text-gray-300 max-w-2xl relative z-10">{subheading}</p>}
      {buttons?.length ? (
        <div className="mt-8 flex gap-4 relative z-10">
          {buttons.map((btn, i) => (
            <Link
              key={i}
              href={btn.url}
              className={
                btn.style === 'secondary'
                  ? 'px-6 py-3 rounded-md border border-white text-white'
                  : 'px-6 py-3 rounded-md bg-white text-black font-medium'
              }
            >
              {btn.label}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  )
}