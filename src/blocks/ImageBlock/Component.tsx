import React from 'react'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import type { ImageBlockType as ImageBlockProps } from '@/payload-types'

export const ImageBlockComponent: React.FC<ImageBlockProps> = ({ image, caption, objectFit, rounded }) => {
  if (!image) return null

  return (
    <div className="w-full my-8">
      <div className={cn('relative w-full overflow-hidden mb-2 shadow-sm border border-gray-100 dark:border-gray-800', {
        'rounded-none': rounded === 'none',
        'rounded-sm': rounded === 'sm',
        'rounded-md': rounded === 'md',
        'rounded-lg': rounded === 'lg' || !rounded,
        'rounded-full aspect-square': rounded === 'full',
      })}>
        <Media
          resource={image}
          className={cn('w-full', {
            'object-cover h-full': objectFit === 'cover',
            'object-contain': objectFit === 'contain',
            'object-none': objectFit === 'none',
          })}
        />
      </div>
      {caption && (
        <p className="text-sm mt-2 text-center text-gray-500 dark:text-gray-400 font-medium">
          {caption}
        </p>
      )}
    </div>
  )
}
