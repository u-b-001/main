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
  const siteSettings = await getCachedGlobal('site-settings', 1)()

  const themePreset = siteSettings?.themePreset || 'mosai'
  const headingFontFamily = siteSettings?.headingFont || 'Playfair Display'
  const bodyFontFamily = siteSettings?.bodyFont || 'Inter'
  const themeColors = siteSettings?.themeColors || {}
  const primaryColor = themeColors.primaryColor || '#4B2E83'
  const secondaryColor = themeColors.secondaryColor || '#1A103D'
  const accentColor = themeColors.accentColor || '#EAB308'
  const backgroundColor = themeColors.backgroundColor || '#FFFFFF'
  const surfaceColor = themeColors.surfaceColor || '#FFFFFF'
  const mutedBackgroundColor = themeColors.mutedBackgroundColor || '#F8F4FF'
  const textColor = themeColors.textColor || '#1A103D'

  const siteTextSize = 'small'
  const showBgPattern = true
  const bgPatternOpacity = '0.15'

  return (
    <html
      className={cn(inter.variable, notoSerifJp.variable, GeistMono.variable)}
      lang="en"
      data-color-scheme={themePreset}
      data-heading-font="serif"
      data-body-font="sans"
      data-text-size={siteTextSize}
      style={{ '--bg-pattern-opacity': bgPatternOpacity } as React.CSSProperties}
      suppressHydrationWarning
    >
      <head>
        <InitTheme defaultTheme="light" />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        
        {/* Load custom selected Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href={`https://fonts.googleapis.com/css2?family=${headingFontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800&family=${bodyFontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`}
          rel="stylesheet"
        />

        {/* Dynamic theme style overrides */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --brand-red: ${primaryColor};
                --brand-navy: ${secondaryColor};
                --brand-gold: ${accentColor};
                --brand-cream: ${mutedBackgroundColor};
                --brand-lightgray: ${surfaceColor};
                --brand-text: ${textColor};
                --font-sans: "${bodyFontFamily}", sans-serif;
                --font-serif: "${headingFontFamily}", serif;
              }
              html[data-theme='light'] {
                --background: ${backgroundColor};
                --foreground: ${textColor};
                --card: ${surfaceColor};
                --card-foreground: ${textColor};
                --popover: ${surfaceColor};
                --popover-foreground: ${textColor};
                --primary: ${primaryColor};
                --primary-foreground: ${backgroundColor};
                --secondary: ${secondaryColor};
                --muted: ${mutedBackgroundColor};
                --accent: ${accentColor};
                --border: ${mutedBackgroundColor};
              }
            `,
          }}
        />
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
