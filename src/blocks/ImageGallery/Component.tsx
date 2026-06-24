import React from 'react'
import Image from 'next/image'

type GalleryImage = { image: { url: string; alt?: string } | string; caption?: string }
type ImageGalleryProps = {
  heading?: string
  images: GalleryImage[]
  layout?: 'grid' | 'masonry'
  columns?: '2' | '3' | '4'
}

const colsMap: Record<string, string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-4',
}

export const ImageGalleryBlock: React.FC<ImageGalleryProps> = ({
  heading,
  images,
  layout = 'grid',
  columns = '3',
}) => {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      {heading && <h2 className="text-3xl font-bold text-center mb-10">{heading}</h2>}
      <div
        className={
          layout === 'masonry'
            ? `columns-1 ${colsMap[columns].replace('grid-cols', 'columns')} gap-4`
            : `grid grid-cols-1 ${colsMap[columns]} gap-4`
        }
      >
        {images.map((img, i) => {
          const url = typeof img.image === 'object' ? img.image?.url : undefined
          const alt = typeof img.image === 'object' ? img.image?.alt : ''
          return (
            <figure key={i} className={layout === 'masonry' ? 'mb-4' : 'relative w-full h-64'}>
              {url && (
                <Image
                  src={url}
                  alt={alt || img.caption || ''}
                  width={layout === 'masonry' ? 600 : undefined}
                  height={layout === 'masonry' ? 400 : undefined}
                  fill={layout !== 'masonry'}
                  className="object-cover rounded-md w-full"
                />
              )}
              {img.caption && <figcaption className="text-sm text-gray-500 mt-1">{img.caption}</figcaption>}
            </figure>
          )
        })}
      </div>
    </section>
  )
}