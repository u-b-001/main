// src/Header/config.ts
import type { GlobalConfig } from 'payload'
import { isSuperAdmin } from '../access/roles'
import { revalidateHeader } from './hooks/revalidateHeader'
import { link } from '@/fields/link' // reuse existing link field util if present, else see note below

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: isSuperAdmin,
  },
  admin: {
    group: 'Global',
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'logoMobile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional compact logo for small screens. Falls back to main logo if not set.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sticky',
          type: 'checkbox',
          label: 'Sticky Header',
          defaultValue: true,
          required: true,
          admin: {
            description: 'Header stays visible at the top of the screen while scrolling.',
            width: '50%',
          },
        },
        {
          name: 'overlapHomepageHero',
          type: 'checkbox',
          label: 'Overlap Homepage Hero',
          defaultValue: false,
          admin: {
            description: 'Header overlaps the homepage hero and is transparent initially.',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'showThemeSelector',
      type: 'checkbox',
      label: 'Show Theme Selector',
      defaultValue: true,
      admin: {
        description: 'Show/hide the light-dark mode toggle in the header.',
      },
    },
    {
      name: 'announcementBar',
      type: 'group',
      label: 'Announcement Bar',
      admin: {
        description: 'Optional thin bar above the header, e.g. for urgent notices (admit cards, deadlines).',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'message',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            description: 'Optional URL to link the announcement to',
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'dismissible',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
      ],
    },
    {
      name: 'nav',
      type: 'array',
      label: 'Navigation Items',
      maxRows: 8,
      admin: {
        description: 'Top-level navigation items. Keep to 8 or fewer for a clean desktop layout.',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'link', type: 'text' },
        { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
        {
          name: 'highlight',
          type: 'checkbox',
          label: 'Highlight as button',
          defaultValue: false,
          admin: {
            description: 'Render this item as a filled CTA button instead of a plain link (e.g. "Apply Now").',
          },
        },
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown Items',
          maxRows: 12,
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'link', type: 'text', required: true },
            { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
            {
              name: 'description',
              type: 'text',
              admin: {
                description: 'Optional one-line description shown under the label in the dropdown (mega-menu style).',
              },
            },
            {
              name: 'subChildren',
              type: 'array',
              label: 'Sub-dropdown Items',
              maxRows: 12,
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'link', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'navSyncHiddenPageUrls',
      type: 'array',
      label: 'Hidden Pages from Auto-Sync',
      admin: {
        description: 'Add page slugs/URLs here (e.g., /about) to prevent them from automatically appearing in the header navigation.',
      },
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}