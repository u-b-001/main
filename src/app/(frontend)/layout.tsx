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
import { PopupNotification } from '@/components/PopupNotification'

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
  const siteTextSize = siteSettings?.siteTextSize || 'small'
  const showBgPattern = siteSettings?.showBgPattern !== false
  const bgPatternOpacity = showBgPattern ? (Number(siteSettings?.bgPatternOpacity || 15) / 100).toFixed(2) : '0'

  const themeColors = siteSettings?.themeColors || {}
  const themePreset = siteSettings?.themePreset || 'default'
  const primaryColor = themeColors.primaryColor || '#000000'
  const secondaryColor = themeColors.secondaryColor || '#ffffff'
  const accentColor = themeColors.accentColor || '#ff0000'
  const mutedBackgroundColor = themeColors.mutedBackgroundColor || '#f5f5f5'
  const surfaceColor = themeColors.surfaceColor || '#ffffff'
  const textColor = themeColors.textColor || '#000000'
  const backgroundColor = themeColors.backgroundColor || '#ffffff'

  // FIX: must match the Payload SiteSettings schema field names exactly
  // (`headingFont` / `bodyFont`). The previous `headingFontFamily` /
  // `bodyFontFamily` names don't exist on the schema, so they were always
  // undefined and silently fell back to 'Inter' no matter what was
  // selected in the admin panel — that was the whole bug.
  const headingFontFamily = siteSettings?.headingFont || 'Playfair Display'
  const bodyFontFamily = siteSettings?.bodyFont || 'Inter'

  const popupProps = siteSettings?.popupNotification || {}
  const safePopupProps = {
    enablePopup: Boolean(popupProps.enablePopup),
    showOnAllPages: Boolean(popupProps.showOnAllPages),
    displayFrequency: popupProps.displayFrequency || 'once_per_session',
    theme: popupProps.theme || 'light',
    popupHeadingColor: popupProps.popupHeadingColor || null,
    popupTextColor: popupProps.popupTextColor || null,
    textSectionBackgroundColor: popupProps.textSectionBackgroundColor || null,
    imageSectionBackgroundColor: popupProps.imageSectionBackgroundColor || null,
    popupBackgroundImage: typeof popupProps.popupBackgroundImage === 'object' && popupProps.popupBackgroundImage?.url ? popupProps.popupBackgroundImage.url : null,
    imageLayoutDirection: popupProps.imageLayoutDirection || 'horizontal',
    popupTitle: popupProps.popupTitle || null,
    titleFont: popupProps.titleFont || 'sans',
    popupDescription: popupProps.popupDescription || null,
    descriptionFont: popupProps.descriptionFont || 'sans',
    bottomDescription: popupProps.bottomDescription || null,
    popupImages: Array.isArray(popupProps.popupImages) ? JSON.parse(JSON.stringify(popupProps.popupImages)) : [],
    buttons: Array.isArray(popupProps.buttons) ? JSON.parse(JSON.stringify(popupProps.buttons)) : [],
  }

  const customStyles = {
    '--bg-pattern-opacity': bgPatternOpacity,
  } as React.CSSProperties

  return (
    <html
      className={cn(inter.variable, notoSerifJp.variable, GeistMono.variable)}
      lang="en"
      data-color-scheme={themePreset}
      data-heading-font={headingFontFamily}
      data-body-font={bodyFontFamily}
      data-text-size={siteTextSize}
      style={customStyles}
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
          <PopupNotification {...safePopupProps} />
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