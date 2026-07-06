'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'

function isUrl(str?: string) {
  if (!str) return false
  return str.startsWith('/') || str.startsWith('http://') || str.startsWith('https://')
}

function PopupIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (LucideIcons as any)[name]
  if (!IconComponent) return null
  return <IconComponent className={className} />
}

type Props = {
  enablePopup?: boolean | null
  showOnAllPages?: boolean | null
  displayFrequency?: 'always' | 'once_per_session' | 'once_per_day' | string | null
  theme?: 'light' | 'dark' | 'primary' | string | null
  imageLayoutDirection?: 'horizontal' | 'vertical' | string | null
  popupTitle?: string | null
  titleFont?: 'sans' | 'serif' | string | null
  popupDescription?: string | null
  descriptionFont?: 'sans' | 'serif' | string | null
  bottomDescription?: string | null
  popupHeadingColor?: string | null
  popupTextColor?: string | null
  textSectionBackgroundColor?: string | null
  imageSectionBackgroundColor?: string | null
  popupBackgroundImage?: string | null
  popupImages?: { image?: any | null, title?: string | null, linkUrl?: string | null, linkTitle?: string | null, id?: string | null }[] | null
  buttons?: any[] | null
}

export const PopupNotification: React.FC<Props> = ({
  enablePopup,
  showOnAllPages,
  displayFrequency,
  theme,
  imageLayoutDirection,
  popupTitle,
  titleFont,
  popupDescription,
  descriptionFont,
  bottomDescription,
  popupHeadingColor,
  popupTextColor,
  textSectionBackgroundColor,
  imageSectionBackgroundColor,
  popupBackgroundImage,
  popupImages,
  buttons,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const containerClasses = theme === 'dark' 
    ? 'bg-zinc-900 text-white border-zinc-800' 
    : theme === 'primary' 
      ? 'bg-primary text-primary-foreground border-primary/20'
      : 'bg-background text-foreground border-border'
      
  const titleClasses = theme === 'dark' || theme === 'primary' ? 'text-inherit' : 'text-foreground'
  const descClasses = theme === 'dark' ? 'text-zinc-300' : theme === 'primary' ? 'text-primary-foreground/90' : 'text-foreground/90'
  
  const closeBtnClasses = theme === 'dark' 
    ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
    : theme === 'primary'
      ? 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-black/10'
      : 'text-muted-foreground hover:text-foreground hover:bg-muted'

  useEffect(() => {
    if (enablePopup && (showOnAllPages || isHomePage)) {
      let shouldShow = false
      try {
        if (displayFrequency === 'always') {
          shouldShow = true
        } else if (displayFrequency === 'once_per_day') {
          const lastSeen = localStorage.getItem('lastSeenPopupDate')
          const today = new Date().toDateString()
          if (lastSeen !== today) {
            shouldShow = true
            localStorage.setItem('lastSeenPopupDate', today)
          }
        } else {
          // Default to once_per_session
          const hasSeen = sessionStorage.getItem('hasSeenPopup')
          if (!hasSeen) {
            shouldShow = true
            sessionStorage.setItem('hasSeenPopup', 'true')
          }
        }
      } catch (err) {
        // Fallback for strict mode browsers
        shouldShow = true
      }
      
      if (shouldShow) {
        setIsOpen(true)
      }
    }
  }, [enablePopup, showOnAllPages, isHomePage, displayFrequency])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  // Pressing escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const isVisibleRoute = enablePopup && (showOnAllPages || isHomePage)

  if (!isVisibleRoute) return null

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[9900] p-4 bg-primary text-primary-foreground rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
          aria-label="Open notifications"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 animate-pulse group-hover:animate-none"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-title"
        >
          <div
            className={`relative w-full max-w-3xl shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300 p-8 sm:p-10 border ${containerClasses} ${popupBackgroundImage ? 'bg-cover bg-center bg-no-repeat' : ''}`}
            style={popupBackgroundImage ? { backgroundImage: `url(${popupBackgroundImage})` } : undefined}
          >
            <button
              onClick={handleClose}
              className={`absolute top-4 right-4 transition-colors p-2 rounded-full ${closeBtnClasses}`}
              aria-label="Close popup"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="overflow-y-auto flex flex-col gap-6 text-center">
              {(popupTitle || popupDescription) && (
                <div 
                  className={textSectionBackgroundColor ? "p-6 rounded-xl flex flex-col gap-4" : "flex flex-col gap-4"}
                  style={textSectionBackgroundColor ? { backgroundColor: textSectionBackgroundColor } : undefined}
                >
                  {popupTitle && (
                    <h2 
                      id="popup-title" 
                      className={`text-2xl font-bold ${titleFont === 'serif' ? 'font-serif' : 'font-sans'} ${titleClasses}`}
                      style={popupHeadingColor ? { color: popupHeadingColor } : undefined}
                    >
                      {popupTitle}
                    </h2>
                  )}

                  {popupDescription && (
                    <div 
                      className={`leading-relaxed whitespace-pre-wrap ${descriptionFont === 'serif' ? 'font-serif' : 'font-sans'} text-base sm:text-lg max-w-2xl mx-auto ${descClasses}`}
                      style={popupTextColor ? { color: popupTextColor } : undefined}
                    >
                      {popupDescription}
                    </div>
                  )}

                  {buttons && buttons.length > 0 && (
                    <div className="mt-4 flex gap-4 flex-wrap justify-center items-center">
                      {buttons.map((btn, i) => {
                        const buttonStyle: React.CSSProperties = {}
                        if (btn.backgroundColor) {
                          buttonStyle.backgroundColor = btn.backgroundColor
                        }
                        if (btn.textColor) {
                          buttonStyle.color = btn.textColor
                        }

                        // Determine default classes based on variant
                        let defaultClasses = ''
                        if (theme === 'dark') {
                          if (btn.variant === 'secondary') {
                            defaultClasses = 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                          } else if (btn.variant === 'outline') {
                            defaultClasses = 'border-2 border-zinc-700 text-white hover:bg-zinc-800'
                          } else {
                            defaultClasses = 'bg-primary text-primary-foreground hover:bg-primary/90'
                          }
                        } else {
                          if (btn.variant === 'secondary') {
                            defaultClasses = 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300'
                          } else if (btn.variant === 'outline') {
                            defaultClasses = 'border border-border text-foreground hover:bg-muted'
                          } else {
                            defaultClasses = 'bg-primary text-primary-foreground hover:bg-primary/90'
                          }
                        }

                        const customClasses = btn.backgroundColor || btn.textColor ? '' : defaultClasses
                        const hasUrlLabel = isUrl(btn.label)

                        return (
                          <Link
                            key={`${btn.label}-${i}`}
                            href={btn.url || '#'}
                            className={`inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${customClasses}`}
                            style={buttonStyle}
                          >
                            {btn.icon && <PopupIcon name={btn.icon} className="h-4 w-4 shrink-0" />}
                            {!hasUrlLabel && btn.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Images Grid */}
              {popupImages && popupImages.length > 0 && (
                <div
                  className={imageSectionBackgroundColor ? "p-6 rounded-xl" : ""}
                  style={imageSectionBackgroundColor ? { backgroundColor: imageSectionBackgroundColor } : undefined}
                >
                  <div
                    className={`grid gap-8 w-full ${
                      popupImages.length === 1 || imageLayoutDirection === 'vertical' 
                        ? 'grid-cols-1' 
                        : 'grid-cols-1 sm:grid-cols-2'
                    }`}
                  >
                  {popupImages.map((imgObj, i) => {
                    if (!imgObj || !imgObj.image || typeof imgObj.image === 'string') return null
                    const media = imgObj.image
                    if (!media.url) return null

                    return (
                      <div key={imgObj.id || i} className="flex flex-col items-center gap-4 w-full">
                        <div className="relative bg-white p-2 border border-border/50 rounded-lg inline-flex justify-center items-center max-w-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={media.url}
                            alt={media.alt || 'Popup image'}
                            className="max-w-full h-auto max-h-[60vh] object-contain"
                          />
                        </div>
                        
                        {imgObj.title && (
                          <h3 className="font-bold text-lg text-foreground">{imgObj.title}</h3>
                        )}

                        {imgObj.linkUrl && (
                          <a
                            href={imgObj.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#295188] hover:bg-[#1a3862] text-white text-sm font-medium px-4 py-3 rounded-md w-full max-w-sm text-center transition-colors break-words line-clamp-2"
                          >
                            {imgObj.linkTitle || imgObj.linkUrl}
                          </a>
                        )}
                      </div>
                    )
                  })}
                  </div>
                </div>
              )}

              {bottomDescription && (
                <div 
                  className={textSectionBackgroundColor ? "p-6 rounded-xl flex flex-col gap-4 mt-4" : "flex flex-col gap-4 mt-4"}
                  style={textSectionBackgroundColor ? { backgroundColor: textSectionBackgroundColor } : undefined}
                >
                  <div 
                    className={`leading-relaxed whitespace-pre-wrap ${descriptionFont === 'serif' ? 'font-serif' : 'font-sans'} text-base sm:text-lg max-w-2xl mx-auto ${descClasses}`}
                    style={popupTextColor ? { color: popupTextColor } : undefined}
                  >
                    {bottomDescription}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
