import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateSiteSettings: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context?.disableRevalidate) {
    payload.logger.info(`Revalidating site settings`)
    try {
      revalidateTag('global_site-settings', 'max')
    } catch (err: any) {
      payload.logger.warn(`Failed to revalidate site settings (this is normal during CLI seed): ${err.message}`)
    }
  }
  return doc
}
