import React from 'react'
import Image from 'next/image'

type Feature = { icon?: { url: string; alt?: string } | string; title: string; description?: string }
type FeatureCardsProps = {
  heading?: string
  subheading?: string
  features: Feature[]
  columns?: '2' | '3' | '4'
}

const colsMap: Record<string, string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-4',
}

export const FeatureCardsBlock: React.FC<FeatureCardsProps> = ({
  heading,
  subheading,
  features,
  columns = '3',
}) => {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      {heading && <h2 className="text-3xl font-bold text-center mb-3">{heading}</h2>}
      {subheading && <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">{subheading}</p>}
      <div className={`grid grid-cols-1 ${colsMap[columns]} gap-8`}>
        {features.map((f, i) => {
          const iconUrl = typeof f.icon === 'object' ? f.icon?.url : undefined
          return (
            <div key={i} className="text-center">
              {iconUrl && (
                <Image src={iconUrl} alt={f.title} width={48} height={48} className="mx-auto mb-4" />
              )}
              <h3 className="font-semibold text-lg">{f.title}</h3>
              {f.description && <p className="text-gray-500 text-sm mt-2">{f.description}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}