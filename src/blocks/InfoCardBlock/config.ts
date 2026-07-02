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
  ],
}
