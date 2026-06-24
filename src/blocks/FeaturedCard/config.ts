import type { Block } from 'payload'

export const FeatureCards: Block = {
  slug: 'featureCards',
  labels: { singular: 'Feature Cards', plural: 'Feature Cards' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'features',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: ['2', '3', '4'],
    },
  ],
}