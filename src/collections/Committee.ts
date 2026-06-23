import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { isEditor } from '../access/roles'

export const Committee: CollectionConfig = {
  slug: 'committee',
  access: {
    create: isEditor,
    delete: isEditor,
    read: anyone,
    update: isEditor,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Organisation',
    defaultColumns: ['name', 'role', 'order'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: { description: 'e.g. President, Secretary General, Treasurer' },
    },
    {
      name: 'designation',
      type: 'text',
      admin: { description: 'Professional designation / institution' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'bio', type: 'richText' },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Managing Committee', value: 'committee' },
        { label: 'Advisory Board',     value: 'advisory' },
        { label: 'Faculty',            value: 'faculty' },
      ],
      required: true,
    },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
