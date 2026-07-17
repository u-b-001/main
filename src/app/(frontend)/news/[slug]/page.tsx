import React, { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { PageHero } from '@/components/shared/PageHero'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import RichText from '@/components/RichText'
import { Calendar, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { cn } from '@/utilities/ui'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const news = await payload.find({
    collection: 'news',
    draft: false,
    limit: 1000,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return news.docs.map(({ slug }) => ({ slug }))
}

export default async function NewsDetailPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise

  const newsItem = await queryNewsBySlug({ slug })

  if (!newsItem) {
    return notFound()
  }

  const formattedDate = newsItem.publishedAt
    ? format(new Date(newsItem.publishedAt), 'MMMM dd, yyyy')
    : ''

  const tagColors = {
    ANNOUNCEMENT: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
    EVENT: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900',
    OPPORTUNITY: 'bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
    RESULT: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900',
    NOTICE: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900',
  }

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950 pb-20">
      {draft && <LivePreviewListener />}
      <PageHero title="News Detail" />
      <Breadcrumb />

      <div className="container mx-auto px-4 py-12 max-w-[48rem]">
        {/* Back Link */}
        <Link
          href="/news"
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-brand-navy dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all news
        </Link>

        {/* Article Meta */}
        <div className="flex items-center gap-4 mb-6">
          <span
            className={cn(
              'px-3 py-1 text-xs font-bold tracking-wider rounded-md border uppercase',
              tagColors[newsItem.tag as keyof typeof tagColors] || tagColors.NOTICE
            )}
          >
            {newsItem.tag}
          </span>
          {formattedDate && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
              <Calendar className="w-4 h-4 text-brand-gold" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 
          className="text-3xl md:text-4xl font-bold font-serif text-brand-navy dark:text-white leading-tight mb-8"
          style={{ color: (newsItem as any).titleColor || undefined }}
        >
          {newsItem.title}
        </h1>

        {/* Content */}
        {newsItem.content && (
          <div 
            className="prose prose-slate dark:prose-invert max-w-none"
            style={{ color: (newsItem as any).contentColor || undefined }}
          >
            <RichText data={newsItem.content} enableGutter={false} />
          </div>
        )}

        {/* External Link Redirect option if available */}
        {newsItem.externalLink && (
          <div className="mt-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 text-center">
            <p className="text-sm font-medium mb-4">
              This notice contains external links or forms.
            </p>
            <a
              href={newsItem.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm"
            >
              Open External Attachment Link
            </a>
          </div>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const newsItem = await queryNewsBySlug({ slug })
  if (!newsItem) return {}
  return {
    title: `${newsItem.title} | MOSAI`,
    description: newsItem.excerpt,
  }
}

const queryNewsBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'news',
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
