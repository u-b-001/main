import React from 'react'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import type { ContentLayoutBlock as ContentLayoutProps } from '@/payload-types'

export const ContentLayoutComponent: React.FC<ContentLayoutProps> = ({ columns }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap -mx-4">
        {columns?.map((col, idx) => {
          let colClass = "w-full px-4"
          if (col.size === 'oneThird') colClass += " md:w-1/3"
          if (col.size === 'half') colClass += " md:w-1/2"
          if (col.size === 'twoThirds') colClass += " md:w-2/3"
          if (col.size === 'full') colClass += " md:w-full"
          
          return (
            <div key={idx} className={colClass}>
              {col.richText && <RichText data={col.richText} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
