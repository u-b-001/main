import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const syncNavAfterChange: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (operation === 'create' || operation === 'update') {
    // Run asynchronously to prevent database locks
    syncNavToHeader(req.payload)
  }
  return doc
}

export const syncNavAfterDelete: CollectionAfterDeleteHook = async ({ req }) => {
  syncNavToHeader(req.payload)
}

const syncNavToHeader = async (payload: any) => {
  try {
    // 1. Fetch Active Pages (showInNav: true & published)
    const pagesRes = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1000,
      where: {
        _status: {
          equals: 'published',
        },
      },
    })
    const pages = pagesRes.docs

    // 2. Fetch Current Header Global
    const header = await payload.findGlobal({
      slug: 'header',
      depth: 0,
    })

    const currentNav = header.nav || []
    const hiddenUrls = (header.navSyncHiddenPageUrls || []).map((item: any) => item.url)

    // 3. Compute Merge & Sanitize
    // Preserve manual/external links, and update page links
    const manualLinks = currentNav.filter((item: any) => {
      // If it doesn't match a page slug, it's considered manual
      return !pages.some((p: any) => item.link === `/${p.slug}`)
    })

    const generatedLinks = pages
      .filter((p: any) => !hiddenUrls.includes(`/${p.slug}`))
      .map((p: any) => {
        // Find existing to preserve children submenus
        const existing = currentNav.find((item: any) => item.link === `/${p.slug}`)
        return {
          label: existing?.label || p.title,
          link: `/${p.slug}`,
          openInNewTab: existing?.openInNewTab || false,
          children: existing?.children || [],
        }
      })

    // Combine them, maybe preserving some order? For now, generated first then manual, or vice versa.
    // The simplest merge is to replace matching slugs and append manual ones that aren't hidden
    const mergedNav = [...generatedLinks, ...manualLinks]

    // 4. Update Header Global UI
    await payload.updateGlobal({
      slug: 'header',
      data: {
        nav: mergedNav,
      },
    })
  } catch (err) {
    console.error('Error syncing nav to header:', err)
  }
}
