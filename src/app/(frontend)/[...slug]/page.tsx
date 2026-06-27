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

  // Sidebar auto-generation removed. Layout relies entirely on blocks.

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950 pb-16">
      {draft && <LivePreviewListener />}

      {/* Hero Banner */}
      <PageHero title={page.title} heroImage={page.hero} heroStyle={page.heroStyle} />

      {/* Breadcrumbs */}
      <Breadcrumb />

      {/* Main Grid Content */}
      <main className="w-full">
        <RenderBlocks blocks={page.layout || []} />

        {/* Dynamic Committee/Faculty Grids */}
        {fullSlug === 'about-mosai/managing-committee' && (
          <div className="container mx-auto px-4 mt-8">
            <CommitteeGrid type="committee" />
          </div>
        )}
        {fullSlug === 'japanese-language/advisory-board-and-faculty' && (
          <div className="container mx-auto px-4 mt-8 space-y-10">
            <div>
              <h3 className="font-serif font-bold text-xl border-b border-slate-200 dark:border-slate-850 pb-2 text-brand-navy dark:text-white uppercase tracking-wide">
                Advisory Board
              </h3>
              <CommitteeGrid type="advisory" />
            </div>
            <div className="pt-6">
              <h3 className="font-serif font-bold text-xl border-b border-slate-200 dark:border-slate-850 pb-2 text-brand-navy dark:text-white uppercase tracking-wide">
                Faculty Members
              </h3>
              <CommitteeGrid type="faculty" />
            </div>
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
