import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Button = { label: string; url: string; style?: 'primary' | 'secondary' }
type HeroProps = {
  heading: string
  subheading?: string
  image?: { url: string; alt?: string } | string
  buttons?: Button[]
}

export const HeroBlock: React.FC<HeroProps> = ({ heading, subheading, image, buttons }) => {
  const imageUrl = typeof image === 'object' ? image?.url : undefined

  return (
    <section className="relative flex flex-col items-center justify-center text-center py-24 px-6 bg-black text-white overflow-hidden">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={typeof image === 'object' ? image?.alt || '' : ''}
          fill
          className="object-cover opacity-40 -z-10"
        />
      )}
      <h1 className="text-4xl md:text-6xl font-bold max-w-3xl">{heading}</h1>
      {subheading && <p className="mt-4 text-lg text-gray-300 max-w-2xl">{subheading}</p>}
      {buttons?.length ? (
        <div className="mt-8 flex gap-4">
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