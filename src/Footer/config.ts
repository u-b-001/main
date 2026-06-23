import type { GlobalConfig } from 'payload'
import { isSuperAdmin } from '../access/roles'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: isSuperAdmin,
  },
  admin: {
    group: 'Site Settings',
  },
  fields: [
    {
      name: 'organizationName',
      type: 'text',
      defaultValue: 'MOMBUSHO SCHOLARS ASSOCIATION OF INDIA',
      required: true,
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'facebook',  type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'linkedin',  type: 'text' },
        { name: 'youtube',   type: 'text' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email',   type: 'email' },
        { name: 'phone',   type: 'text' },
        { name: 'address', type: 'textarea' },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '© 2026 MOSAI - Mombusho Scholars Association of India. All rights reserved.',
      required: true,
    },
    {
      name: 'showVisitorCounter',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Show the visitor statistics block in the footer' },
    },
    {
      name: 'showCalendar',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
