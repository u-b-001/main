import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import type { Metadata } from 'next'
import { generateMeta } from '@/utilities/generateMeta'

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

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <RenderBlocks blocks={homepage?.layout || []} />
    </main>
  )
}
