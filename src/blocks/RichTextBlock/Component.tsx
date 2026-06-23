import React from 'react'
import type { RichTextBlock as RichTextBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'

export const RichTextBlock: React.FC<RichTextBlockProps> = ({ content }) => {
  if (!content) return null
  return (
    <div className="container max-w-[48rem] mx-auto px-4 py-6">
      <RichText data={content} enableGutter={false} />
    </div>
  )
}
