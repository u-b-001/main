import type { Block } from 'payload'
import { iconField, colorField } from '../shared'

export const StepsBlock: Block = {
  slug: 'steps',
  interfaceName: 'StepsBlock',
  labels: { singular: 'Steps', plural: 'Steps Blocks' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Section Description',
    },
    {
      name: 'hoverLuminous',
      type: 'checkbox',
      label: 'Luminous Glow on Hover',
      defaultValue: false,
    },
    {
      name: 'hoverBulge',
      type: 'checkbox',
      label: 'Bulge Cards on Hover',
      defaultValue: false,
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
        },
        iconField('icon', 'Icon'),
      ],
    },
    colorField('backgroundColor', 'Section Background Color', '#FFFFFF'),
  ],
}
