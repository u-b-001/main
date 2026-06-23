import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { isEditor } from '../access/roles'

export const News: CollectionConfig = {
  slug: 'news',
  access: {
    create: isEditor,
    delete: isEditor,
    read: anyone,
    update: isEditor,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'tag', 'publishedAt', 'status'],
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'tag',
      type: 'select',
      required: true,
      options: [
        { label: 'Announcement', value: 'ANNOUNCEMENT' },
        { label: 'Event',        value: 'EVENT' },
        { label: 'Opportunity',  value: 'OPPORTUNITY' },
        { label: 'Result',       value: 'RESULT' },
        { label: 'Notice',       value: 'NOTICE' },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: { description: 'Short description shown in the notification list' },
    },
    { name: 'slug', type: 'text', unique: true, required: true },
    {
      name: 'content',
      type: 'richText',
      admin: { description: 'Full content (shown on the detail page)' },
    },
    {
      name: 'externalLink',
      type: 'text',
      admin: { description: 'If set, clicking the card redirects here instead of an internal page' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Pin to top of list' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft',     value: 'draft' },
        { label: 'Archived',  value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
