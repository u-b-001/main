import type { Block } from 'payload'
import { sectionHeadingFields, iconField, colorField, opacityField } from '../shared'

export const LayoutCardsBlock: Block = {
  slug: 'layoutCards',
  labels: { singular: 'Layout Cards', plural: 'Layout Cards' },
  fields: [
    ...sectionHeadingFields,
    {
      name: 'columns',
      type: 'select',
      defaultValue: '4',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        iconField('icon', 'Card Icon'),
        {
          name: 'cardTitle',
          type: 'richText',
          required: true,
        },
        {
          name: 'cardSubtitle',
          type: 'richText',
          admin: {
            description: 'E.g., "From Beginner to Advanced"',
          },
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        colorField('overlayColor', 'Overlay Color', '#000000'),
        opacityField('overlayOpacity', 'Overlay Opacity', 60),
        {
          name: 'link',
          type: 'text',
          admin: {
            description: 'URL when the card or arrow is clicked',
          },
        },
      ],
    },
  ],
}
