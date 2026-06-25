import type { Block } from 'payload'

export const Marquee: Block = {
  slug: 'marquee',
  labels: { singular: 'Marquee / Ticker', plural: 'Marquees' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'text', type: 'text' },
        { name: 'logo', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'speed',
      type: 'number',
      defaultValue: 30,
      admin: { description: 'Animation duration in seconds — lower = faster' },
    },
    {
      name: 'direction',
      type: 'select',
      defaultValue: 'left',
      options: ['left', 'right'],
    },
  ],
}