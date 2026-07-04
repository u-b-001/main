import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import type { Metadata } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import { PopupNotification } from '@/components/PopupNotification'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })
  const homepage = result.docs?.[0]
  
  return generateMeta({ doc: homepage })
}

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })
  const homepage = result.docs?.[0]

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
  })

  const bgSettings = homepage?.backgroundSettings
  const bgTheme = bgSettings?.theme || 'default'
  const customBgColor = bgSettings?.customColor
  const bgImage = bgSettings?.backgroundImage

  let bgClass = "min-h-screen "
  const style: React.CSSProperties = {}

  if (bgTheme === 'light-gray') {
    bgClass += "bg-gray-50 dark:bg-gray-900"
  } else if (bgTheme === 'dark-navy') {
    bgClass += "bg-slate-900 text-white"
  } else if (bgTheme === 'custom' && customBgColor) {
    style.backgroundColor = customBgColor
  } else {
    bgClass += "bg-white dark:bg-slate-950"
  }

  if (bgImage && typeof bgImage === 'object' && bgImage.url) {
    style.backgroundImage = `url(${bgImage.url})`
    style.backgroundSize = 'cover'
    style.backgroundPosition = 'center'
    style.backgroundAttachment = 'fixed'
  }

  const layoutHeadingFont = homepage?.typographySettings?.headingFont || 'serif'
  const fontClass = layoutHeadingFont === 'serif' ? '[&_h2]:font-serif [&_h3]:font-serif' : '[&_h2]:font-sans [&_h3]:font-sans'

  const popupProps = siteSettings?.popupNotification || {}

  return (
    <main className={bgClass} style={Object.keys(style).length > 0 ? style : undefined}>
      <div className={fontClass}>
        <RenderBlocks blocks={homepage?.layout || []} />
      </div>
      <PopupNotification {...popupProps} />
    </main>
  )
}
