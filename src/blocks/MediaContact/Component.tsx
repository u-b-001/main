'use client'

import React, { useState } from 'react'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import * as LucideIcons from 'lucide-react'
const { MapPin, Phone, Mail, Clock, Info, CheckCircle2, Send } = LucideIcons
import type { MediaContactBlock as MediaContactProps } from '@/payload-types'

const bgClasses = {
  transparent: 'bg-transparent',
  slate50: 'bg-slate-50 dark:bg-slate-900/60 border-y border-slate-100 dark:border-slate-800/80',
  brandNavy: 'bg-brand-navy text-white border-y border-slate-850',
  brandRed: 'bg-brand-red text-white border-y border-red-700',
  brandCream: 'bg-brand-cream dark:bg-slate-900 border-y border-brand-gold/10',
}

const paddingClasses = {
  none: 'py-0',
  small: 'py-8 md:py-12',
  medium: 'py-16 md:py-24',
  large: 'py-24 md:py-32',
}

const aspectClasses = {
  original: 'h-auto max-h-[550px] w-full object-contain',
  video: 'aspect-video object-cover w-full h-full',
  square: 'aspect-square object-cover w-full h-full',
  portrait: 'aspect-[3/4] object-cover w-full h-full',
  tall: 'aspect-[9/16] object-cover w-full h-full',
}

const aspectWrapperClasses = {
  original: '',
  video: 'aspect-video',
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  tall: 'aspect-[9/16]',
}

const mediaColumnClasses = {
  'col-span-4': 'lg:col-span-4',
  'col-span-5': 'lg:col-span-5',
  'col-span-6': 'lg:col-span-6',
  'col-span-7': 'lg:col-span-7',
  'col-span-8': 'lg:col-span-8',
}

const contactColumnClasses = {
  'col-span-4': 'lg:col-span-8',
  'col-span-5': 'lg:col-span-7',
  'col-span-6': 'lg:col-span-6',
  'col-span-7': 'lg:col-span-5',
  'col-span-8': 'lg:col-span-4',
}

const iconMap = {
  address: MapPin,
  phone: Phone,
  email: Mail,
  hours: Clock,
  general: Info,
}

export const MediaContactComponent: React.FC<MediaContactProps> = ({
  layoutDirection = 'mediaLeft',
  mediaWidth = 'col-span-6',
  verticalAlignment = 'items-start',
  backgroundColor = 'transparent',
  padding = 'medium',
  mediaType = 'upload',
  mediaFile,
  videoUrl,
  aspectRatio = 'video',
  contactHeading = 'Get in Touch',
  contactSubheading,
  description,
  contactDetails = [],
  showForm = true,
  formHeading = 'Send Us a Message',
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const isLightText = backgroundColor === 'brandNavy' || backgroundColor === 'brandRed'

  const getEmbedUrl = (url?: string) => {
    if (!url) return ''
    let id = ''
    if (url.includes('youtube.com/watch')) {
      id = url.split('v=')[1]?.split('&')[0] || ''
    } else if (url.includes('youtu.be/')) {
      id = url.split('youtu.be/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/embed/')) {
      id = url.split('youtube.com/embed/')[1]?.split('?')[0] || ''
    }
    if (id) return `https://www.youtube.com/embed/${id}`

    if (url.includes('vimeo.com/')) {
      id = url.split('vimeo.com/')[1]?.split('?')[0] || ''
      if (id) return `https://player.vimeo.com/video/${id}`
    }
    return url
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Send mock contact request to the server, or handle client-side fallback
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render the Media section
  const renderMedia = () => {
    if (mediaType === 'upload' && mediaFile && typeof mediaFile === 'object') {
      const isVideo = mediaFile.mimeType?.startsWith('video/') || 
                      mediaFile.filename?.endsWith('.mp4') || 
                      mediaFile.filename?.endsWith('.webm') || 
                      mediaFile.filename?.endsWith('.mov')
      
      const aspectClass = aspectClasses[aspectRatio as keyof typeof aspectClasses] || aspectClasses.video

      if (isVideo) {
        return (
          <div className="w-full overflow-hidden rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 bg-black">
            <div className={aspectWrapperClasses[aspectRatio as keyof typeof aspectWrapperClasses] || 'aspect-video'}>
              <video
                src={mediaFile.url || ''}
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )
      } else {
        // Image
        return (
          <div className="w-full overflow-hidden rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 relative bg-slate-50 dark:bg-slate-900">
            <Media resource={mediaFile} className="w-full h-full" imgClassName={aspectClass} />
          </div>
        )
      }
    }

    if (mediaType === 'videoUrl' && videoUrl) {
      const embedSrc = getEmbedUrl(videoUrl)
      return (
        <div className="w-full h-full overflow-hidden rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 bg-black">
          <div className={aspectWrapperClasses[aspectRatio as keyof typeof aspectWrapperClasses] || 'aspect-video'}>
            {embedSrc ? (
              <iframe
                src={embedSrc}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                title="Location or info video player"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                Invalid video link
              </div>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className={cn("w-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400", aspectWrapperClasses[aspectRatio as keyof typeof aspectWrapperClasses] || 'aspect-video')}>
        No media file selected
      </div>
    )
  }

  return (
    <section className={cn('w-full transition-all duration-300', bgClasses[backgroundColor || 'transparent'], paddingClasses[padding || 'medium'])}>
      <div className="container mx-auto px-4">
        <div className={cn(
          'grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16',
          verticalAlignment || 'items-start'
        )}>
          
          {/* Media Column */}
          <div className={cn(
            mediaColumnClasses[mediaWidth] || 'lg:col-span-6',
            'w-full',
            layoutDirection === 'mediaRight' ? 'lg:order-2' : 'lg:order-1'
          )}>
            {renderMedia()}
          </div>

          {/* Contact & Form Column */}
          <div className={cn(
            contactColumnClasses[mediaWidth] || 'lg:col-span-6',
            'flex flex-col space-y-8 w-full',
            layoutDirection === 'mediaRight' ? 'lg:order-1' : 'lg:order-2',
            isLightText ? 'text-white' : 'text-slate-800 dark:text-slate-200'
          )}>
            
            {/* Header */}
            <div>
              <h2 className={cn(
                'text-3xl md:text-4xl font-serif font-bold uppercase tracking-wide mb-2',
                isLightText ? 'text-white' : 'text-brand-navy dark:text-white'
              )}>
                {contactHeading}
              </h2>
              {contactSubheading && (
                <p className={cn(
                  'text-xs font-semibold uppercase tracking-wider',
                  isLightText ? 'text-slate-300' : 'text-brand-red dark:text-brand-gold'
                )}>
                  {contactSubheading}
                </p>
              )}
              
              {description && (
                <div className={cn(
                  'mt-4 prose prose-sm dark:prose-invert',
                  isLightText ? 'prose-headings:text-white prose-p:text-white/80' : 'prose-headings:text-brand-navy prose-p:text-slate-650'
                )}>
                  <RichText data={description} enableGutter={false} />
                </div>
              )}
            </div>

            {/* Contact Details List */}
            {contactDetails && contactDetails.length > 0 && (
              <div className="space-y-4">
                {contactDetails.map((detail, idx) => {
                  const IconComponent = iconMap[detail.type as keyof typeof iconMap] || (LucideIcons as any)[detail.type] || iconMap.general
                  const isDetailLinked = !!detail.link

                  const detailEl = (
                    <div className="flex items-start space-x-4">
                      <div className={cn(
                        'flex items-center justify-center p-2.5 rounded-lg border shrink-0',
                        isLightText 
                          ? 'bg-white/10 border-white/20 text-white' 
                          : 'bg-brand-cream/40 border-brand-gold/20 text-brand-red dark:bg-slate-800 dark:border-slate-700 dark:text-brand-gold'
                      )}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className={cn(
                          'text-xs font-bold uppercase tracking-wider mb-0.5',
                          isLightText ? 'text-slate-300' : 'text-slate-400 dark:text-slate-500'
                        )}>
                          {detail.label}
                        </h4>
                        <p className={cn(
                          'text-sm leading-relaxed whitespace-pre-line',
                          isLightText ? 'text-white/90' : 'text-slate-800 dark:text-slate-200',
                          isDetailLinked && 'hover:underline transition-all'
                        )}>
                          {detail.value}
                        </p>
                      </div>
                    </div>
                  )

                  if (isDetailLinked && detail.link) {
                    return (
                      <a key={idx} href={detail.link} className="block transition-transform duration-250 hover:translate-x-0.5">
                        {detailEl}
                      </a>
                    )
                  }

                  return <div key={idx}>{detailEl}</div>
                })}
              </div>
            )}

            {/* Optional AJAX Form */}
            {showForm && (
              <div className={cn(
                'rounded-2xl p-6 border shadow-sm',
                isLightText 
                  ? 'bg-white/5 border-white/10 text-white' 
                  : 'bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800'
              )}>
                <h3 className={cn(
                  'text-lg font-serif font-bold mb-4 uppercase tracking-wider',
                  isLightText ? 'text-white' : 'text-brand-navy dark:text-white'
                )}>
                  {formHeading}
                </h3>

                {submitStatus === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce" />
                    <h4 className="font-bold text-base">Message Sent Successfully!</h4>
                    <p className={cn(
                      'text-xs',
                      isLightText ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                    )}>
                      Thank you for contacting MOSAI. We will reply to your message shortly.
                    </p>
                    <button
                      onClick={() => setSubmitStatus('idle')}
                      className={cn(
                        'mt-2 text-xs font-semibold px-4 py-2 border rounded-lg transition-colors',
                        isLightText 
                          ? 'border-white/30 hover:bg-white/10' 
                          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                      )}
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className={cn(
                          'block text-xs font-bold mb-1 uppercase tracking-wider',
                          isLightText ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                        )}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className={cn(
                            'w-full text-sm px-4 py-2.5 rounded-lg border outline-hidden transition-all',
                            isLightText
                              ? 'bg-white/10 border-white/20 text-white placeholder-slate-400 focus:bg-white/15 focus:border-white/30'
                              : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-brand-red/50 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white dark:focus:border-brand-gold/50'
                          )}
                          placeholder="Your name"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className={cn(
                          'block text-xs font-bold mb-1 uppercase tracking-wider',
                          isLightText ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                        )}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className={cn(
                            'w-full text-sm px-4 py-2.5 rounded-lg border outline-hidden transition-all',
                            isLightText
                              ? 'bg-white/10 border-white/20 text-white placeholder-slate-400 focus:bg-white/15 focus:border-white/30'
                              : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-brand-red/50 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white dark:focus:border-brand-gold/50'
                          )}
                          placeholder="your.email@domain.com"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className={cn(
                        'block text-xs font-bold mb-1 uppercase tracking-wider',
                        isLightText ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                      )}>
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className={cn(
                          'w-full text-sm px-4 py-2.5 rounded-lg border outline-hidden transition-all',
                          isLightText
                            ? 'bg-white/10 border-white/20 text-white placeholder-slate-400 focus:bg-white/15 focus:border-white/30'
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-brand-red/50 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white dark:focus:border-brand-gold/50'
                        )}
                        placeholder="Subject / Purpose"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className={cn(
                        'block text-xs font-bold mb-1 uppercase tracking-wider',
                        isLightText ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                      )}>
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className={cn(
                          'w-full text-sm px-4 py-2.5 rounded-lg border outline-hidden transition-all resize-none',
                          isLightText
                            ? 'bg-white/10 border-white/20 text-white placeholder-slate-400 focus:bg-white/15 focus:border-white/30'
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-brand-red/50 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white dark:focus:border-brand-gold/50'
                        )}
                        placeholder="Type your message here..."
                      />
                    </div>

                    {submitStatus === 'error' && (
                      <p className="text-xs font-semibold text-red-500">
                        Error submitting form. Please try again.
                      </p>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        'w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-lg text-sm font-semibold tracking-wider uppercase border-2 shadow-xs transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed',
                        isLightText
                          ? 'bg-white text-brand-navy border-white hover:bg-slate-100'
                          : 'bg-brand-red text-white border-brand-red hover:bg-red-750'
                      )}
                    >
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                      {!isSubmitting && <Send className="w-4 h-4" />}
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}
