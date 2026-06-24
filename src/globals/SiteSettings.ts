import type { GlobalConfig } from 'payload'
import { isSuperAdmin } from '../access/roles'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  access: {
    read: () => true,
    update: isSuperAdmin,
  },
  admin: { group: 'Global' },
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
        { label: 'Emerald Forest (Green, Sage & Gold)', value: 'emerald' },
        { label: 'Modern Digital (Slate Blue, Indigo & Teal)', value: 'modern' },
      ],
      required: true,
    },
    {
      name: 'headingFont',
      type: 'select',
      label: 'Heading Font Style',
      defaultValue: 'serif',
      options: [
        { label: 'Noto Serif JP (Classic Traditional)', value: 'serif' },
        { label: 'Inter Sans (Modern Minimalist)', value: 'sans' },
        { label: 'Geist Mono (Technical Sleek)', value: 'mono' },
      ],
      required: true,
    },
    {
      name: 'bodyFont',
      type: 'select',
      label: 'Body Font Style',
      defaultValue: 'sans',
      options: [
        { label: 'Inter Sans (Clean, Highly Readable)', value: 'sans' },
        { label: 'Noto Serif JP (Classic Serif)', value: 'serif' },
      ],
      required: true,
    },
    {
      name: 'siteTextSize',
      type: 'select',
      label: 'Base Site Sizing Scale',
      defaultValue: 'small',
      options: [
        { label: 'Standard text scale (15px)', value: 'small' },
        { label: 'Medium readable scale (16px)', value: 'medium' },
        { label: 'Large accessible scale (18px)', value: 'large' },
      ],
      required: true,
    },
    {
      name: 'showBgPattern',
      type: 'checkbox',
      label: 'Enable Background Pattern',
      defaultValue: true,
      required: true,
    },
    {
      name: 'bgPatternOpacity',
      type: 'select',
      label: 'Background Pattern Opacity (%)',
      defaultValue: '15',
      options: [
        { label: '0% (Disabled)', value: '0' },
        { label: '5% (Subtle)', value: '5' },
        { label: '10%', value: '10' },
        { label: '15% (Recommended)', value: '15' },
        { label: '20%', value: '20' },
        { label: '30%', value: '30' },
        { label: '40%', value: '40' },
        { label: '50% (Semi-visible)', value: '50' },
        { label: '70%', value: '70' },
        { label: '90% (High)', value: '90' },
      ],
      required: true,
      admin: {
        condition: (data) => Boolean(data?.showBgPattern),
      },
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
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
