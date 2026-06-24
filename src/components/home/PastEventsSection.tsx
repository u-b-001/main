'use client'

import React from 'react'
import type { Event as EventType } from '@/payload-types'
import { format } from 'date-fns'
import { Calendar, User, Facebook, Twitter, Link } from 'lucide-react'

interface PastEventsSectionProps {
  heading: string
  events: (string | EventType)[]
  headingAlignment?: 'left' | 'center' | 'right'
  headingSize?: 'small' | 'medium' | 'large'
  backgroundColor?: 'white' | 'slate' | 'cream'
  showUnderline?: boolean
}

export const PastEventsSection: React.FC<PastEventsSectionProps> = ({
  heading,
  events,
  headingAlignment = 'center',
  headingSize = 'medium',
  backgroundColor = 'white',
  showUnderline = true,
}) => {
  const list = (events || []).filter((e): e is EventType => typeof e === 'object')

  if (list.length === 0) return null

  // Function to extract/format youtube embed url
  const getEmbedUrl = (url: string) => {
    if (!url) return ''
    if (url.includes('youtube.com/embed/')) return url

    let videoId = ''
    if (url.includes('youtube.com/watch')) {
      try {
        const u = new URL(url)
        videoId = u.searchParams.get('v') || ''
      } catch (e) {
        // ignore
      }
    } else if (url.includes('youtu.be/')) {
      try {
        const parts = url.split('/')
        videoId = parts[parts.length - 1]
      } catch (e) {
        // ignore
      }
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }

  // Sizing styles mapping
  const sizeClasses = {
    small: 'text-xl md:text-2xl',
    medium: 'text-2xl md:text-4xl',
    large: 'text-3xl md:text-5xl',
  }

  // Alignment styles mapping
  const alignClass = headingAlignment === 'left' ? 'text-left' : headingAlignment === 'right' ? 'text-right' : 'text-center'
  const underlineAlignClass = headingAlignment === 'left' ? 'mr-auto ml-0' : headingAlignment === 'right' ? 'ml-auto mr-0' : 'mx-auto'

  // Background style mapping
  const bgClasses = {
    white: 'bg-white dark:bg-slate-950',
    slate: 'bg-slate-50 dark:bg-slate-900/50',
    cream: 'bg-brand-cream/40 dark:bg-slate-900/20',
  }

  return (
    <section className={`py-16 bg-pattern ${bgClasses[backgroundColor] || bgClasses.white}`}>
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className={`${alignClass} mb-12`}>
          <h2 className={`font-bold font-serif text-brand-navy dark:text-white tracking-wide uppercase relative inline-block pb-3 ${sizeClasses[headingSize]}`}>
            {heading}
          </h2>
          {showUnderline && (
            <div className={`w-12 h-1 bg-brand-red mt-2 rounded-full ${underlineAlignClass}`} />
          )}
        </div>

        {/* 2-column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {list.map((item) => {
            const embedSrc = getEmbedUrl(item.youtubeUrl)
            const formattedDate = item.eventDate
              ? format(new Date(item.eventDate), 'MMMM dd, yyyy')
              : ''

            return (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Embed player */}
                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-900 shadow-sm border border-slate-205 dark:border-slate-800">
                  {embedSrc ? (
                    <iframe
                      src={embedSrc}
                      title={item.title}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs italic">
                      Video Unavailable
                    </div>
                  )}
                </div>

                {/* Info & Shares */}
                <div className="mt-5 space-y-3">
                  <h3 className="font-serif font-bold text-lg text-brand-navy dark:text-white leading-snug">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-sm text-brand-text dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Metadata: Date and Organizer */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs text-slate-500 font-medium">
                    {formattedDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-brand-gold" />
                        <span>{formattedDate}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-brand-gold" />
                      <span>{item.organizer || 'Organized by MOSAI'}</span>
                    </div>
                  </div>

                  {/* Social Share list */}
                  <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Share Event
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          item.youtubeUrl
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors text-slate-400 dark:hover:bg-blue-950/40"
                        aria-label="Share on Facebook"
                      >
                        <Facebook className="w-4 h-4" />
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          item.youtubeUrl
                        )}&text=${encodeURIComponent(item.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-slate-100 hover:text-black transition-colors text-slate-400 dark:hover:bg-slate-800"
                        aria-label="Share on Twitter/X"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.youtubeUrl)
                          alert('Link copied to clipboard!')
                        }}
                        className="p-1.5 rounded-md hover:bg-slate-100 transition-colors text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
                        aria-label="Copy Link"
                      >
                        <Link className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
