import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateSiteSettings: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context?.disableRevalidate) {
    try {
      payload.logger.info(`Revalidating site settings`)
      revalidateTag('global_site-settings', 'max')
    } catch (err: any) {
      payload.logger.warn(`Could not revalidate site settings: ${err.message}`)
    }
  }
  return doc
}
