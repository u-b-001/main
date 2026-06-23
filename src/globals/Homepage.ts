import type { GlobalConfig } from 'payload'
import { isSuperAdmin } from '../access/roles'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: {
    read: () => true,
    update: isSuperAdmin,
  },
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'carousel',
      type: 'array',
      label: 'Hero Carousel Slides',
      maxRows: 10,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt',   type: 'text' },
        { name: 'link',  type: 'text', admin: { description: 'Optional: clicking the slide goes here' } },
      ],
    },
    {
      name: 'offersHeading',
      type: 'text',
      defaultValue: 'WE OFFER',
      required: true,
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Select up to 4 service cards to display' },
    },
    {
      name: 'newsHeading',
      type: 'text',
      defaultValue: 'NEWS & NOTIFICATIONS',
      required: true,
    },
    {
      name: 'newsSubheading',
      type: 'text',
      defaultValue: 'Stay updated with the latest news, announcements, and achievements from MOSAI.',
    },
    {
      name: 'newsDisplayCount',
      type: 'number',
      defaultValue: 8,
      admin: { description: 'How many notification items to show on the homepage' },
      required: true,
    },
    {
      name: 'newsViewAllLink',
      type: 'text',
      defaultValue: '/news',
      required: true,
    },
    {
      name: 'galleryHeading',
      type: 'text',
      defaultValue: 'MOSAI Gallery',
      required: true,
    },
    {
      name: 'galleryDisplayCount',
      type: 'number',
      defaultValue: 8,
      required: true,
    },
    {
      name: 'eventsHeading',
      type: 'text',
      defaultValue: 'Our Past Events',
      required: true,
    },
    {
      name: 'eventsDisplayCount',
      type: 'number',
      defaultValue: 2,
      required: true,
    },
  ],
}
