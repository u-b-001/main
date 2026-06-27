import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    try {
      revalidateTag('global_footer', 'max')
    } catch (err: any) {
      payload.logger.warn(`Could not revalidate footer: ${err.message}`)
    }
  }

  return doc
}
