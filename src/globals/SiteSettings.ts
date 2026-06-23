import type { GlobalConfig } from 'payload'
import { isSuperAdmin } from '../access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  access: {
    read: () => true,
    update: isSuperAdmin,
  },
  admin: { group: 'Site Settings' },
  fields: [
    { name: 'siteName',    type: 'text', defaultValue: 'MOSAI', required: true },
    { name: 'siteTagline', type: 'text', defaultValue: 'Mombusho Scholars Association of India', required: true },
    { name: 'favicon',     type: 'upload', relationTo: 'media' },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
    { name: 'googleAnalyticsId', type: 'text' },
  ],
}
