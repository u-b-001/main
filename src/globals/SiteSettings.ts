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
    {
      name: 'defaultTheme',
      type: 'select',
      label: 'Default Site Theme',
      defaultValue: 'light',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
      required: true,
    },
    {
      name: 'colorScheme',
      type: 'select',
      label: 'Website Color Scheme',
      defaultValue: 'classic',
      options: [
        { label: 'Classic (Navy & Red)', value: 'classic' },
        { label: 'Warm Sunset (Crimson, Orange-Red & Gold)', value: 'sunset' },
        { label: 'Cherry Dusk (Plum, Dusty Rose & Terracotta)', value: 'terracotta' },
      ],
      required: true,
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Site favicon image. WARNING: To change this image, click the "X" button to clear the field, then select or upload a new one. DO NOT click the pencil "Edit" icon to replace the file inside the media drawer, as that will overwrite the shared media asset globally across all pages!',
      },
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Site default Open Graph share image. WARNING: To change this image, click the "X" button to clear the field, then select or upload a new one. DO NOT click the pencil "Edit" icon to replace the file inside the media drawer, as that will overwrite the shared media asset globally across all pages!',
      },
    },
    { name: 'googleAnalyticsId', type: 'text' },
  ],
}
