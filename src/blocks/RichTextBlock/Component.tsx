import React from 'react'
import type { RichTextBlock as RichTextBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'

export const RichTextBlock: React.FC<RichTextBlockProps> = ({
  content,
  textColor,
  headingColor,
}) => {
  if (!content) return null
  return (
    <div
      className="container max-w-[48rem] mx-auto px-6 md:px-12 py-6"
      style={
        {
          ...(textColor
            ? {
                '--tw-prose-body': textColor,
                '--tw-prose-invert-body': textColor,
                color: textColor,
              }
            : {}),
          ...(headingColor
            ? {
                '--tw-prose-headings': headingColor,
                '--tw-prose-invert-headings': headingColor,
              }
            : {}),
        } as React.CSSProperties
      }
    >
      <RichText data={content} enableGutter={false} />
    </div>
  )
}
