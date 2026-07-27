'use client'

import React from 'react'
import Link from 'next/link'
import RichText from '@/components/RichText'

type RibbonHeroButton = {
  label: string
  url: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
}

export type RibbonHeroBlockProps = {
  subtitle?: string
  title?: any
  description?: any
  buttons?: RibbonHeroButton[]
  backgroundImage?: { url: string; alt?: string } | null
  cutoutImage?: { url: string; alt?: string } | null
  ribbonImage?: { url: string; alt?: string } | null
  blockType?: string
}

function Btn({ btn }: { btn: RibbonHeroButton }) {
  const isPrimary = !btn.variant || btn.variant === 'primary'
  return (
    <Link
      href={btn.url}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 22px',
        borderRadius: '9999px',
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: 1,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        backgroundColor: isPrimary ? '#7a1a28' : 'transparent',
        color: isPrimary ? '#fff' : '#7a1a28',
        border: `2px solid ${btn.variant === 'outline' ? '#1a2e4a' : '#7a1a28'}`,
        ...(btn.variant === 'outline' && { color: '#1a2e4a' }),
        ...(btn.variant === 'ghost' && { border: '2px solid transparent', color: '#1a2e4a', backgroundColor: 'transparent' }),
      }}
    >
      {btn.label}
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </Link>
  )
}

export const RibbonHeroBlock: React.FC<RibbonHeroBlockProps> = ({
  subtitle,
  title,
  description,
  buttons,
  backgroundImage,
  cutoutImage,
  ribbonImage,
}) => {
  // Ribbon height estimation (in px) for padding at the bottom
  const RIBBON_HEIGHT = 130

  return (
    <section
      style={{
        position: 'relative',
        backgroundColor: 'transparent',
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        // Use a fixed height to match the reference
        height: '580px',
        overflow: 'hidden',
      }}
    >
      {/* ── 1. BACKGROUND IMAGE (faded architectural imagery) ── */}
      {backgroundImage?.url && (
        <img
          src={backgroundImage.url}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            opacity: 0.22,
            zIndex: 0,
          }}
        />
      )}

      {/* ── 2. Left fade overlay so text stays readable ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(to right, rgba(0,0,0,0.4) 38%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── 3. CUTOUT IMAGE — right side, fills full height ── */}
      {cutoutImage?.url && (
        <img
          src={cutoutImage.url}
          alt={cutoutImage.alt || ''}
          className="brightness-110 contrast-105"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '55%',         // slightly more than half so it bleeds right
            height: `calc(100% - ${RIBBON_HEIGHT}px)`, // stop above ribbon
            objectFit: 'cover',
            objectPosition: 'center top',
            zIndex: 1,
            // CSS mask: fade left edge into the background — zero visible boundary
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 12%, black 28%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 12%, black 28%)',
          }}
        />
      )}

      {/* ── 4. LEFT TEXT CONTENT ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: `calc(100% - ${RIBBON_HEIGHT}px)`,
          width: '50%',
          padding: '0 40px 0 60px',
          gap: '18px',
        }}
      >
        {subtitle && (
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              color: '#7a1a28',
            }}
          >
            {subtitle}
          </p>
        )}

        {title && (
          <div
            style={{
              margin: 0,
              fontSize: 'clamp(1.8rem, 3vw, 2.9rem)',
              fontWeight: 800,
              lineHeight: 1.14,
              color: '#1a2e4a',
              wordBreak: 'break-word',
            }}
          >
            {typeof title === 'object' ? (
              <RichText data={title} enableGutter={false} enableProse={false} />
            ) : (
              <h1>{title}</h1>
            )}
          </div>
        )}

        {description && (
          <div
            style={{
              margin: 0,
              fontSize: '14px',
              lineHeight: 1.7,
              color: '#4a5568',
              maxWidth: '380px',
            }}
          >
            {typeof description === 'object' ? (
              <RichText data={description} enableGutter={false} enableProse={false} />
            ) : (
              <p>{description}</p>
            )}
          </div>
        )}

        {buttons && buttons.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
            {buttons.map((btn, i) => (
              <Btn key={i} btn={btn} />
            ))}
          </div>
        )}
      </div>

      {/* ── 5. RIBBON IMAGE — pinned to bottom, full width, above everything ── */}
      {ribbonImage?.url && (
        <img
          src={ribbonImage.url}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: `${RIBBON_HEIGHT}px`,
            objectFit: 'fill',   // stretch to exactly fill the ribbon strip
            zIndex: 4,
            display: 'block',
            pointerEvents: 'none',
          }}
        />
      )}
    </section>
  )
}

export default RibbonHeroBlock
