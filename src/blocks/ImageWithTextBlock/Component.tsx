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
          'flex flex-col md:flex-row gap-8 items-center',
          imagePosition === 'left' ? 'md:flex-row-reverse' : ''
        )}
      >
        <div className={cn('w-full md:w-1/2 flex-1')}>
          {content && <RichText data={content} enableGutter={false} />}
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center">
          {image && typeof image === 'object' && (
            <Media
              resource={image}
              className="inline-block max-w-full rounded-lg shadow-md overflow-hidden"
              pictureClassName="inline-block max-w-full"
              imgClassName="w-auto h-auto max-w-full max-h-[500px] object-contain rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  )
}
