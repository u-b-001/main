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
    group: 'Global',
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
    {
      name: 'styling',
      type: 'group',
      label: 'Styling & Design',
      fields: [
        {
          name: 'footerBgColor',
          type: 'text',
          label: 'Footer Background Color',
          admin: {
            components: {
              Field: '@/globals/ColorPickerField#ColorPickerField',
            },
            description: 'Custom background color for the site footer.',
          },
        },
        {
          name: 'textColor',
          type: 'text',
          label: 'Text Color',
          admin: {
            components: {
              Field: '@/globals/ColorPickerField#ColorPickerField',
            },
            description: 'Custom text color for footer descriptions, copyright, and lists.',
          },
        },
        {
          name: 'iconColor',
          type: 'text',
          label: 'Icon Color',
          admin: {
            components: {
              Field: '@/globals/ColorPickerField#ColorPickerField',
            },
            description: 'Custom color for both contact and social icons.',
          },
        },
        {
          name: 'widgetBgColor',
          type: 'text',
          label: 'Visitor/Calendar Background Color',
          admin: {
            components: {
              Field: '@/globals/ColorPickerField#ColorPickerField',
            },
            description: 'Background color for the stats and calendar widgets.',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
