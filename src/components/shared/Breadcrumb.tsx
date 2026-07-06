import React from 'react'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { BreadcrumbClient } from './BreadcrumbClient'

export const Breadcrumb = async () => {
  const siteSettings = (await getCachedGlobal('site-settings', 1)()) as any
  const breadcrumbsProps = siteSettings?.breadcrumbs || {}

  return <BreadcrumbClient settings={breadcrumbsProps} />
}
