
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Play, ArrowRight, LifeBuoy } from 'lucide-react'

type SupportCard = {
  title: string
  description?: string
  buttonLabel?: string
  buttonUrl?: string
}

type HelpSupportProps = {
  heading?: string
  description?: string
  layout?: 'sideBySide' | 'stacked'
  supportCards?: SupportCard[]
  video?: {
    enabled?: boolean
    title?: string
    videoUrl?: string
    poster?: {
      url?: string
    }
  }
}

function getEmbedUrl(url: string) {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)

  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`
  }

  return null
}

export const HelpSupportBlock: React.FC<HelpSupportProps> = ({
  heading,
  description,
  layout = 'sideBySide',
  supportCards = [],
  video,
}) => {
  const [playVideo, setPlayVideo] = useState(false)

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      {heading && (
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">{heading}</h2>
          {description && (
            <p className="text-gray-500 mt-3">{description}</p>
          )}
        </div>
      )}

      <div
        className={
          layout === 'stacked'
            ? 'space-y-10'
            : 'grid lg:grid-cols-2 gap-10'
        }
      >
        <div className="space-y-4">
          {supportCards.map((card, index) => (
            <div
              key={index}
              className="border rounded-xl p-6 shadow-sm"
            >
              <LifeBuoy className="mb-4" size={24} />

              <h3 className="font-semibold text-lg mb-2">
                {card.title}
              </h3>

              {card.description && (
                <p className="text-gray-500 mb-4">
                  {card.description}
                </p>
              )}

              {card.buttonLabel && card.buttonUrl && (
                <a
                  href={card.buttonUrl}
                  className="inline-flex items-center gap-2 text-blue-600"
                >
                  {card.buttonLabel}
                  <ArrowRight size={16} />
                </a>
              )}
            </div>
          ))}
        </div>

        {video?.enabled && (
          <div>
            {video.title && (
              <h3 className="font-semibold text-lg mb-4">
                {video.title}
              </h3>
            )}

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              {playVideo && video.videoUrl ? (
                <iframe
                  src={getEmbedUrl(video.videoUrl) || ''}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                />
              ) : (
                <>
                  {video.poster?.url && (
                    <Image
                      src={video.poster.url}
                      alt="Video"
                      fill
                      className="object-cover"
                    />
                  )}

                  <button
                    onClick={() => setPlayVideo(true)}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="bg-white rounded-full p-4">
                      <Play size={24} />
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
