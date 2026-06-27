import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    try {
      revalidateTag('global_header', 'max')
    } catch (err: any) {
      payload.logger.warn(`Could not revalidate header: ${err.message}`)
    }
  }

  return doc
}
