import type { Block } from 'payload'

export const ShowcaseCards: Block = {
  slug: 'showcaseCards',
  labels: { singular: 'Showcase Cards', plural: 'Showcase Cards' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'link', type: 'text' },
        { name: 'linkLabel', type: 'text', defaultValue: 'Learn more' },
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