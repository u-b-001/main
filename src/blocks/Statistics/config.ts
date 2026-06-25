import type { Block } from 'payload'

export const StatsImpact: Block = {
  slug: 'statsImpact',
  labels: { singular: 'Statistics / Impact', plural: 'Statistics / Impact' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'suffix', type: 'text' },
      ],
    },
  ],
}