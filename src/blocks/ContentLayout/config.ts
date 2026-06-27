import type { Block } from 'payload'

export const ContentLayout: Block = {
  slug: 'contentLayout',
  interfaceName: 'ContentLayoutBlock',
  labels: { singular: 'Content Layout', plural: 'Content Layouts' },
  fields: [
    {
      name: 'columns',
      type: 'array',
      fields: [
        {
          name: 'size',
          type: 'select',
          defaultValue: 'oneThird',
          options: [
            { label: 'One Third', value: 'oneThird' },
            { label: 'Half', value: 'half' },
            { label: 'Two Thirds', value: 'twoThirds' },
            { label: 'Full', value: 'full' },
          ],
        },
        {
          name: 'richText',
          type: 'richText',
        },
      ],
    },
  ],
}
