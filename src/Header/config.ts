import type { GlobalConfig } from 'payload'
import { isSuperAdmin } from '../access/roles'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: isSuperAdmin,
  },
  admin: {
    group: 'Site Settings',
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'sticky',
      type: 'checkbox',
      label: 'Sticky Header',
      defaultValue: true,
      required: true,
      admin: {
        description: 'If checked, the header will remain visible at the top of the screen during scrolling.',
      },
    },
    {
      name: 'overlapHomepageHero',
      type: 'checkbox',
      label: 'Overlap Homepage Hero',
      defaultValue: false,
      admin: {
        description: 'If checked, the header will overlap the homepage hero carousel and will be transparent initially.',
      },
    },
    {
      name: 'nav',
      type: 'array',
      label: 'Navigation Items',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'link',  type: 'text' },
        { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown Items',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'link',  type: 'text', required: true },
            { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
            {
              name: 'subChildren',
              type: 'array',
              label: 'Sub-dropdown Items',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'link',  type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
