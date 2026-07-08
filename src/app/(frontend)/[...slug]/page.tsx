import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { PageHero } from '@/components/shared/PageHero'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { CommitteeGrid } from '@/components/shared/CommitteeGrid'

type Args = {
  params: Promise<{
    slug?: string[]
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    pagination: false,
    select: {
      slug: true,
    },
  })

  // Convert slash slugs into segment arrays
  const params = pages.docs
    ?.filter((doc) => doc.slug && doc.slug !== 'home')
    .map(({ slug }) => {
      return { slug: slug.split('/') }
    })

  return params
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise

  if (!slug || slug.length === 0) {
    return notFound()
  }

  const fullSlug = slug.map(s => decodeURIComponent(s)).join('/')
  const page = await queryPageBySlug({ slug: fullSlug })

  if (!page) {
    return notFound()
  }

  const siteSettings = (await getCachedGlobal('site-settings', 1)()) as any
  const heroSettings = siteSettings?.pageHeroSettings || {}
  const isUniversalHero = heroSettings.heroSettingsMode === 'universal'

  // Map hero banner parameters based on mode (universal vs page-specific)
  const heroImage = isUniversalHero ? heroSettings.hero : page.hero
  const heroStyle = isUniversalHero ? heroSettings.heroStyle : page.heroStyle
  const heroType = isUniversalHero ? heroSettings.heroType : page.heroType
  const heroGradientPreset = isUniversalHero ? heroSettings.heroGradientPreset : page.heroGradientPreset
  const heroShape = isUniversalHero ? heroSettings.heroShape : page.heroShape
  const heroEyebrow = isUniversalHero ? (heroSettings.heroEyebrow || page.heroEyebrow) : page.heroEyebrow
  const heroEyebrowColor = isUniversalHero ? (heroSettings.heroEyebrowColor || page.heroEyebrowColor) : page.heroEyebrowColor
  const heroSubtitle = isUniversalHero ? (heroSettings.heroSubtitle || page.heroSubtitle) : page.heroSubtitle
  const heroPaddingTop = isUniversalHero ? heroSettings.heroPaddingTop : page.heroPaddingTop
  const heroPaddingBottom = isUniversalHero ? heroSettings.heroPaddingBottom : page.heroPaddingBottom
  const heroMarginBottom = isUniversalHero ? heroSettings.heroMarginBottom : page.heroMarginBottom
  const heroBgColor = isUniversalHero ? heroSettings.heroBgColor : page.heroBgColor

  const bgSettings = page?.backgroundSettings
  const bgTheme = bgSettings?.theme || 'default'
  const customBgColor = bgSettings?.customColor
  const bgImage = bgSettings?.backgroundImage

  let bgClass = "min-h-screen pb-16 "
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

  const layoutHeadingFont = page?.typographySettings?.headingFont || 'serif'
  const fontClass = layoutHeadingFont === 'serif' ? '[&_h2]:font-serif [&_h3]:font-serif' : '[&_h2]:font-sans [&_h3]:font-sans'

  return (
    <article className={bgClass} style={Object.keys(style).length > 0 ? style : undefined}>
      {draft && <LivePreviewListener />}

      {/* Hero Banner */}
      <PageHero
        title={page.title}
        heroImage={heroImage}
        heroStyle={heroStyle}
        heroType={heroType}
        heroGradientPreset={heroGradientPreset}
        heroShape={heroShape}
        heroEyebrow={heroEyebrow}
        heroEyebrowColor={heroEyebrowColor}
        heroSubtitle={heroSubtitle}
        heroPaddingTop={heroPaddingTop}
        heroPaddingBottom={heroPaddingBottom}
        heroMarginBottom={heroMarginBottom}
        bgTheme={bgTheme}
        customBgColor={customBgColor}
        heroBgColor={heroBgColor}
      />

      {/* Breadcrumbs */}
      <Breadcrumb />

      {/* Main Grid Content */}
      <main className="w-full">
        <div className={fontClass}>
          <RenderBlocks blocks={page.layout || []} />
        </div>

        {/* Dynamic Committee/Faculty Grids */}
        {fullSlug === 'about-mosai/managing-committee' && (
          <div className="container mx-auto px-4 mt-8">
            <CommitteeGrid type="committee" />
          </div>
        )}

      </main>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  if (!slug) return {}
  const fullSlug = slug.map(s => decodeURIComponent(s)).join('/')
  const page = await queryPageBySlug({ slug: fullSlug })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
