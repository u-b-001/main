import type { Block } from 'payload'

export const InfoCardBlock: Block = {
  slug: 'infoCard',
  interfaceName: 'InfoCardBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'style',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Highlight', value: 'highlight' },
        { label: 'Warning', value: 'warning' },
      ],
      defaultValue: 'default',
      required: true,
    },
  ],
}
