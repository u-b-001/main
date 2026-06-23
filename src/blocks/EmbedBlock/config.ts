import type { Block } from 'payload'

export const EmbedBlock: Block = {
  slug: 'embed',
  interfaceName: 'EmbedBlock',
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'YouTube embed URL or Google Form embed URL',
      },
    },
    {
      name: 'height',
      type: 'number',
      defaultValue: 400,
      required: true,
    },
    {
      name: 'title',
      type: 'text',
    },
  ],
}
