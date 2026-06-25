import type { Block } from 'payload'

export const DataSnapshot: Block = {
  slug: 'dataSnapshot',
  labels: { singular: 'Data Snapshot Block', plural: 'Data Snapshot Blocks' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'metrics',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'change', type: 'text', admin: { description: 'e.g. "+12%" or "-3 states"' } },
        {
          name: 'trend',
          type: 'select',
          defaultValue: 'neutral',
          options: ['up', 'down', 'neutral'],
        },
        { name: 'icon', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'lastUpdated',
      type: 'date',
      admin: { description: 'Shown as "Data as of ..."' },
    },
  ],
}