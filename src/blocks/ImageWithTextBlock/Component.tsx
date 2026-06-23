import React from 'react'
import type { ImageWithTextBlock as ImageWithTextBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

export const ImageWithTextBlock: React.FC<ImageWithTextBlockProps> = ({
  image,
  imagePosition,
  content,
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 gap-8 items-center',
          imagePosition === 'left' ? 'md:flex-row-reverse' : ''
        )}
      >
        <div className={cn('w-full', imagePosition === 'left' ? 'md:order-last' : '')}>
          {content && <RichText data={content} enableGutter={false} />}
        </div>
        <div className="w-full">
          {image && typeof image === 'object' && (
            <Media
              resource={image}
              className="rounded-lg shadow-md overflow-hidden w-full max-h-[450px] object-cover"
            />
          )}
        </div>
      </div>
    </div>
  )
}
