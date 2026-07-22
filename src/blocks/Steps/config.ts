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
      name: 'layout',
      type: 'select',
      label: 'Steps Layout',
      defaultValue: 'vertical',
      options: [
        { label: 'Vertical (Alternating)', value: 'vertical' },
        { label: 'Horizontal (Snake Pattern)', value: 'horizontal-snake' },
      ],
      admin: {
        description: 'Choose how the steps are arranged.',
      }
    },
    {
      name: 'enableStepAnimations',
      type: 'checkbox',
      label: 'Enable Staggered Step Animations',
      defaultValue: true,
      admin: {
        description: 'Animate steps one by one as they scroll into view.',
      }
    },
    {
      name: 'staggerDelay',
      type: 'number',
      label: 'Stagger Delay (Seconds)',
      defaultValue: 0.2,
      admin: {
        description: 'The delay between each step animating in.',
        condition: (_, siblingData) => siblingData?.enableStepAnimations,
        step: 0.1,
      }
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
