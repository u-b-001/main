import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getHomepageData() {
  const payload = await getPayload({ config: configPromise })
  const [pagesResult, header, footer, settings] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      limit: 1,
    }),
    payload.findGlobal({ slug: 'header',   depth: 2 }),
    payload.findGlobal({ slug: 'footer',   depth: 1 }),
    payload.findGlobal({ slug: 'site-settings', depth: 1 }),
  ])
  const homepage = pagesResult.docs?.[0] || null
  return { homepage, header, footer, settings }
}

export async function getLatestNews(limit = 8) {
  const payload = await getPayload({ config: configPromise })
  return payload.find({
    collection: 'news',
    limit,
    sort: '-publishedAt',
    where: { status: { equals: 'published' } },
  })
}

export async function getGalleryImages(limit = 8) {
  const payload = await getPayload({ config: configPromise })
  return payload.find({
    collection: 'gallery',
    limit,
    sort: 'order',
  })
}

export async function getFeaturedEvents(limit = 2) {
  const payload = await getPayload({ config: configPromise })
  return payload.find({
    collection: 'events',
    limit,
    where: { featured: { equals: true } },
    sort: '-eventDate',
  })
}

export async function getPageBySlug(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 3,
  })
  return result.docs[0] ?? null
}
