import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Card = {
  image?: { url: string; alt?: string } | string
  title: string
  description?: string
  link?: string
  linkLabel?: string
}
type ShowcaseCardsProps = {
  heading?: string
  subheading?: string
  cards: Card[]
  columns?: '2' | '3' | '4'
}

const colsMap: Record<string, string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-4',
}

export const ShowcaseCardsBlock: React.FC<ShowcaseCardsProps> = ({
  heading,
  subheading,
  cards,
  columns = '3',
}) => {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      {heading && <h2 className="text-3xl font-bold text-center mb-3">{heading}</h2>}
      {subheading && (
        <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">{subheading}</p>
      )}
      <div className={`grid grid-cols-1 ${colsMap[columns]} gap-6`}>
        {cards.map((card, i) => {
          const imageUrl = typeof card.image === 'object' ? card.image?.url : undefined
          return (
            <div key={i} className="border rounded-lg overflow-hidden bg-white">
              {imageUrl && (
                <div className="relative w-full h-48">
                  <Image src={imageUrl} alt={card.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-semibold text-lg">{card.title}</h3>
                {card.description && (
                  <p className="text-gray-500 text-sm mt-2">{card.description}</p>
                )}
                {card.link && (
                  <Link href={card.link} className="text-sm font-medium text-blue-600 mt-3 inline-block">
                    {card.linkLabel || 'Learn more'} →
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}