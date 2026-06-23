import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ req, originalDoc, searchDoc }) => {
  const { slug, title, seo } = originalDoc

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
    meta: {
      title: seo?.metaTitle || title,
      image: seo?.ogImage?.id || seo?.ogImage,
      description: seo?.metaDescription,
    },
  }

  return modifiedDoc
}
