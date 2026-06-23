import React from 'react'
import type { EmbedBlock as EmbedBlockProps } from '@/payload-types'

export const EmbedBlock: React.FC<EmbedBlockProps> = ({ url, height, title }) => {
  if (!url) return null

  // Helper to convert watch link to embed link
  let embedUrl = url
  if (url.includes('youtube.com/watch')) {
    try {
      const u = new URL(url)
      const v = u.searchParams.get('v')
      if (v) {
        embedUrl = `https://www.youtube.com/embed/${v}`
      }
    } catch (e) {
      // ignore
    }
  } else if (url.includes('youtu.be/')) {
    try {
      const parts = url.split('/')
      const v = parts[parts.length - 1]
      if (v) {
        embedUrl = `https://www.youtube.com/embed/${v}`
      }
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-[48rem]">
      {title && <h4 className="text-lg font-bold mb-4 font-serif text-brand-navy">{title}</h4>}
      <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm w-full bg-slate-50">
        <iframe
          src={embedUrl}
          title={title || 'Embedded Content'}
          width="100%"
          height={height || 400}
          className="border-0 w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  )
}
