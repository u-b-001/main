'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

type Props = {
  enablePopup?: boolean | null
  popupTitle?: string | null
  popupDescription?: string | null
  popupImages?: { image?: any | null, id?: string | null }[] | null
}

export const PopupNotification: React.FC<Props> = ({
  enablePopup,
  popupTitle,
  popupDescription,
  popupImages,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (enablePopup) {
      const hasSeen = sessionStorage.getItem('hasSeenPopup')
      if (!hasSeen) {
        setIsOpen(true)
        // Optionally lock body scroll when popup is open
        document.body.style.overflow = 'hidden'
      }
    }
  }, [enablePopup])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem('hasSeenPopup', 'true')
    document.body.style.overflow = 'unset'
  }

  if (!isOpen) return null

  // Handle outside click
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

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div
        className="relative w-full max-w-2xl bg-background border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border/50">
          <h2 id="popup-title" className="text-2xl font-semibold text-foreground font-serif">
            {popupTitle}
          </h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
            aria-label="Close popup"
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
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex flex-col gap-6">
          {popupDescription && (
            <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans text-[var(--text-size)]">
              {popupDescription}
            </div>
          )}

          {/* Images Grid */}
          {popupImages && popupImages.length > 0 && (
            <div
              className={`grid gap-4 ${
                popupImages.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
              }`}
            >
              {popupImages.map((imgObj, i) => {
                if (!imgObj.image || typeof imgObj.image === 'string') return null
                const media = imgObj.image
                return (
                  <div
                    key={imgObj.id || i}
                    className="relative w-full overflow-hidden rounded-xl bg-muted aspect-video group"
                  >
                    <Image
                      src={media.url || ''}
                      alt={media.alt || 'Popup image'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
        
        {/* Footer Actions */}
        <div className="p-4 bg-muted/30 border-t border-border/50 flex justify-end">
          <button 
            onClick={handleClose}
            className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:brightness-110 transition-all shadow-sm"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  )
}
