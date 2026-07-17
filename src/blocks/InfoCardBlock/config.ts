import type { Block } from 'payload'
import { iconField, colorField } from '../shared'

export const InfoCardBlock: Block = {
  slug: 'infoCard',
  interfaceName: 'InfoCardBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    iconField('icon', 'Icon'),
    colorField('iconColor', 'Icon Color', '#1A103D'),
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
    {
      name: 'animation',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Fade In', value: 'fade-in' },
        { label: 'Slide Up', value: 'slide-up' },
        { label: 'Pulse', value: 'pulse' },
        { label: 'Bounce', value: 'bounce' },
        { label: 'Lift Up (Hover)', value: 'lift-up' }
      ],
      defaultValue: 'none',
      admin: {
        description: 'Select an animation for this info card',
      },
    },
  ],
}
