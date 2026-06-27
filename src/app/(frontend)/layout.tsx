import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { Inter, Noto_Serif_JP } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { getCachedGlobal } from '@/utilities/getGlobals'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const notoSerifJp = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const siteSettings = (await getCachedGlobal('site-settings', 1)()) as any
  const defaultTheme = siteSettings?.defaultTheme || 'light'
  const colorScheme = siteSettings?.colorScheme || 'classic'
  const headingFont = siteSettings?.headingFont || 'serif'
  const bodyFont = siteSettings?.bodyFont || 'sans'
  const siteTextSize = siteSettings?.siteTextSize || 'small'
  const showBgPattern = siteSettings?.showBgPattern !== false
  const bgPatternOpacity = showBgPattern ? (Number(siteSettings?.bgPatternOpacity || 15) / 100).toFixed(2) : '0'

  const themeColors = siteSettings?.themeColors || {}
  const customStyles: React.CSSProperties = {
    '--bg-pattern-opacity': bgPatternOpacity,
    ...(themeColors.secondaryColor && { '--brand-navy': themeColors.secondaryColor, '--secondary': themeColors.secondaryColor }),
    ...(themeColors.primaryColor && { '--brand-red': themeColors.primaryColor, '--primary': themeColors.primaryColor }),
    ...(themeColors.accentColor && { '--brand-gold': themeColors.accentColor, '--accent': themeColors.accentColor }),
    ...(themeColors.mutedBackgroundColor && { '--brand-cream': themeColors.mutedBackgroundColor, '--muted': themeColors.mutedBackgroundColor }),
    ...(themeColors.textColor && { '--brand-text': themeColors.textColor, '--foreground': themeColors.textColor }),
    ...(themeColors.surfaceColor && { '--brand-lightgray': themeColors.surfaceColor, '--card': themeColors.surfaceColor }),
    ...(themeColors.backgroundColor && { '--background': themeColors.backgroundColor }),
  } as React.CSSProperties

  return (
    <html
      className={cn(inter.variable, notoSerifJp.variable, GeistMono.variable)}
      lang="en"
      data-heading-font={headingFont}
      data-body-font={bodyFont}
      data-text-size={siteTextSize}
      style={customStyles}
      suppressHydrationWarning
    >
      <head>
        <InitTheme defaultTheme={defaultTheme} />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className={cn(showBgPattern ? 'has-pattern' : '')}>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
