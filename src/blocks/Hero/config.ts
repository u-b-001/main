import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'buttons',
      type: 'array',
      maxRows: 2,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: ['primary', 'secondary'],
        },
      ],
    },
  ],
}