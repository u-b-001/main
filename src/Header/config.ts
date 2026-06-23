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
