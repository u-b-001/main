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

  // Fetch navigation for sidebar
  const payload = await getPayload({ config: configPromise })
  const headerData = await payload.findGlobal({ slug: 'header', depth: 2 })

  // Find parent nav item to build section sidebar
  const parentPath = `/${slug[0]}`
  const parentNavItem = headerData?.nav?.find(
    (item) => item.link === parentPath || (item.children && item.children.some(c => c.link.startsWith(parentPath)))
  )
  const sidebarLinks = parentNavItem?.children || []

  const showSidebar =
    ((page.layoutStyle || 'sidebar') === 'sidebar' || page.layoutStyle === 'rightSidebar') &&
    sidebarLinks.length > 0

  const sidebarElement = (
    <aside className="lg:col-span-1 space-y-6">
      <div className="bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-xl p-5 shadow-xs sticky top-24">
        <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-brand-navy dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
          {parentNavItem?.label || 'In This Section'}
        </h4>
        <nav className="space-y-1">
          {sidebarLinks.map((linkItem, idx) => {
            const isLinkActive = `/${fullSlug}` === linkItem.link
            return (
              <div key={idx} className="space-y-1">
                <Link
                  href={linkItem.link}
                  className={`block px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-colors ${
                    isLinkActive
                      ? 'text-brand-red bg-white dark:bg-slate-800 border-l-2 border-brand-red font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-brand-red hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {linkItem.label}
                </Link>
                {/* Render Subchildren if active */}
                {linkItem.subChildren && linkItem.subChildren.length > 0 && (
                  <div className="pl-4 space-y-1">
                    {linkItem.subChildren.map((subLink, sidx) => {
                      const isSubActive = `/${fullSlug}` === subLink.link
                      return (
                        <Link
                          key={sidx}
                          href={subLink.link}
                          className={`block px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
                            isSubActive
                              ? 'text-brand-red font-semibold'
                              : 'text-slate-500 hover:text-brand-red'
                          }`}
                        >
                          {subLink.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </aside>
  )

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950 pb-16">
      {draft && <LivePreviewListener />}

      {/* Hero Banner */}
      <PageHero title={page.title} heroImage={page.hero} heroStyle={page.heroStyle} />

      {/* Breadcrumbs */}
      <Breadcrumb />

      {/* Main Grid Content */}
      <div className="container mx-auto px-4 py-10">
        {showSidebar ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar (Left) */}
            {page.layoutStyle !== 'rightSidebar' && sidebarElement}

            {/* Main content area */}
            <main className="lg:col-span-3">
              <RenderBlocks blocks={page.layout || []} />

              {/* Dynamic Committee/Faculty Grids */}
              {fullSlug === 'about-mosai/managing-committee' && (
                <div className="mt-8">
                  <CommitteeGrid type="committee" />
                </div>
              )}
              {fullSlug === 'japanese-language/advisory-board-and-faculty' && (
                <div className="mt-8 space-y-10">
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

            {/* Sidebar (Right) */}
            {page.layoutStyle === 'rightSidebar' && sidebarElement}
          </div>
        ) : (
          <main className={page.layoutStyle === 'fullWidth' ? 'w-full' : 'max-w-[48rem] mx-auto'}>
            <RenderBlocks blocks={page.layout || []} />

            {/* Dynamic Committee/Faculty Grids without Sidebar */}
            {fullSlug === 'about-mosai/managing-committee' && (
              <div className="mt-8">
                <CommitteeGrid type="committee" />
              </div>
            )}
            {fullSlug === 'japanese-language/advisory-board-and-faculty' && (
              <div className="mt-8 space-y-10">
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
        )}
      </div>
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
