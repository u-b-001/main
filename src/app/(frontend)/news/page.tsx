import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NewsArchiveClient } from './NewsArchiveClient'
import { PageHero } from '@/components/shared/PageHero'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News & Notifications | MOSAI',
  description: 'Stay updated with the latest news, announcements, and opportunities from MOSAI.',
}

export default async function NewsArchivePage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'news',
    limit: 100,
    sort: '-publishedAt',
    where: {
      status: {
        equals: 'published',
      },
    },
  })

  const newsItems = result.docs || []

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-16">
      <PageHero title="News & Notifications" />
      <Breadcrumb />
      <div className="container mx-auto px-4 py-10">
        <NewsArchiveClient newsItems={newsItems} />
      </div>
    </div>
  )
}
