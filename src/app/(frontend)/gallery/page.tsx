import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { GalleryArchiveClient } from './GalleryArchiveClient'
import { PageHero } from '@/components/shared/PageHero'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MOSAI Photo Gallery',
  description: 'View photos and memories of past events and achievements from MOSAI.',
}

export default async function GalleryArchivePage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'gallery',
    limit: 500,
    sort: 'order',
  })

  const galleryItems = result.docs || []

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-16">
      <PageHero title="Photo Gallery" />
      <Breadcrumb />
      <div className="container mx-auto px-4 py-10">
        <GalleryArchiveClient items={galleryItems} />
      </div>
    </div>
  )
}
