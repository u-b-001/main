import type { Metadata } from 'next'
import type { Media, Page } from '../payload-types'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | number | null) => {
  const serverUrl = getServerSideURL()
  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    url = serverUrl + (image.url || '')
  }

  return url
}

export const generateMeta = async (args: {
  doc: any | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.seo?.ogImage)

  const title = doc?.seo?.metaTitle
    ? doc.seo.metaTitle + ' | MOSAI'
    : doc?.title
    ? doc.title + ' | MOSAI'
    : 'MOSAI'

  return {
    description: doc?.seo?.metaDescription || 'Mombusho Scholars Association of India',
    openGraph: mergeOpenGraph({
      description: doc?.seo?.metaDescription || 'Mombusho Scholars Association of India',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc.slug.join('/') : '/',
    }),
    title,
  }
}
